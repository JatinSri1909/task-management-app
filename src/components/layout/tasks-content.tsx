/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import TaskList from "./tasks/task-list"
import TaskFilters from "./tasks/task-filters"
import TaskDialogs from "./tasks/task-dialogs"
import TaskPagination from "./tasks/task-pagination"
import { tasks } from "@/lib/api"
import type { Task, CreateTaskInput } from "@/lib/api"
import { dummyData } from "@/data/dummy"
import { usePolling } from "@/hooks/use-polling"

export default function TaskContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("startTime:asc")
  const [filterPriority, setFilterPriority] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const itemsPerPage = 10
  const { toast } = useToast()

  const { data: taskData, loading, error, refetch } = usePolling(
    () => tasks.getAll({
      page: currentPage,
      limit: itemsPerPage,
      priority: filterPriority ? Number(filterPriority) : undefined,
      status: filterStatus || undefined,
      field: sortBy.split(':')[0],
      order: sortBy.split(':')[1] as 'asc' | 'desc'
    }),
    {
      interval: 30000, // 30 seconds
      fallbackData: { tasks: dummyData.tasks, total: dummyData.tasks.length }
    }
  )

  const [newTask, setNewTask] = useState<CreateTaskInput>({
      title: "",
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    startTime: new Date(),
    endTime: new Date(),
  })

  const handleAddTask = async () => {
    try {
      const result = await tasks.create(newTask)
    toast({
      title: "Success",
      description: "Task added successfully",
    })
      refetch()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add task:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task"
      })
    }
  }

  const handleEditTask = async () => {
    if (!editingTask) return
    try {
      console.log('Starting task update:', editingTask);

      const updatePayload = {
        title: editingTask.title,
        priority: editingTask.priority,
        status: editingTask.status,
        startTime: new Date(editingTask.startTime),
        endTime: new Date(editingTask.endTime)
      }

      console.log('Update payload:', updatePayload);

      const updatedTask = await tasks.update(editingTask.id, updatePayload)
      console.log('Task updated successfully:', updatedTask);
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
      refetch()
      setIsEditDialogOpen(false)
      setEditingTask(null)
    } catch (error: any) {
      console.error('Failed to update task:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        task: editingTask,
        stack: error.stack
      })
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update task"
      })
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map(id => tasks.delete(id)))
    toast({
      title: "Success",
      description: `${selectedTasks.length} task(s) deleted successfully`,
    })
      setSelectedTasks([])
      refetch()
    } catch (error) {
      console.error('Failed to delete tasks:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tasks"
      })
    }
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => 
      prev.includes(taskId) 
        ? prev.filter((id) => id !== taskId) 
        : [...prev, taskId]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageTaskIds = taskData?.tasks.map(task => task.id) || []
      setSelectedTasks(pageTaskIds)
    } else {
      setSelectedTasks([])
    }
  }

  const filteredAndSortedTasks = taskData?.tasks
    .filter((task) => !filterPriority || task.priority === Number(filterPriority))
    .filter((task) => !filterStatus || task.status === filterStatus)
    .filter((task) => !selectedTasks.includes(task.id))
    .sort((a, b) => {
      const [field, order] = sortBy.split(":")
      if (field === 'startTime' || field === 'endTime') {
        const aDate = new Date(a[field]).getTime()
        const bDate = new Date(b[field]).getTime()
        return order === "asc" ? aDate - bDate : bDate - aDate
      }
      return 0
    }) || []

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage)
  const paginatedTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {/* Left Controls */}
        <div className="space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 lg:hidden" />
                <span className="hidden lg:inline">Add Task</span>
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button 
            variant="destructive" 
            onClick={handleDeleteSelected} 
            disabled={selectedTasks.length === 0}
          >
            <Trash2 className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline">Delete Selected</span>
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 pb-2 sm:pb-0">
          <TaskFilters
            sortBy={sortBy}
            filterPriority={filterPriority}
            filterStatus={filterStatus}
            onSortChange={setSortBy}
            onPriorityChange={setFilterPriority}
            onStatusChange={setFilterStatus}
            onClearPriority={() => setFilterPriority("")}
            onClearStatus={() => setFilterStatus("")}
          />
        </div>
      </div>

      {/* Task List */}
      <TaskList
        tasks={paginatedTasks}
        selectedTasks={selectedTasks}
        onTaskSelect={toggleTaskSelection}
        onSelectAll={handleSelectAll}
        onEdit={(task) => {
          setEditingTask(task)
          setIsEditDialogOpen(true)
        }}
      />

      {/* Pagination */}
      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemCount={paginatedTasks.length}
        totalItems={filteredAndSortedTasks.length}
      />

      {/* Dialogs */}
      <TaskDialogs
        isAddOpen={isAddDialogOpen}
        isEditOpen={isEditDialogOpen}
        editingTask={editingTask}
        newTask={newTask}
        onAddClose={() => setIsAddDialogOpen(false)}
        onEditClose={() => {
          setIsEditDialogOpen(false)
          setEditingTask(null)
        }}
        onAddSubmit={handleAddTask}
        onEditSubmit={handleEditTask}
        onNewTaskChange={(field, value) => setNewTask({ ...newTask, [field]: value })}
        onEditingTaskChange={(field, value) => 
          setEditingTask(editingTask ? { ...editingTask, [field]: value } : null)
        }
      />
    </div>
  )
}

