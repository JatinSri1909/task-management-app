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

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    priority: filterPriority ? Number(filterPriority) : undefined,
    status: filterStatus || undefined,
    field: sortBy.split(':')[0],
    order: sortBy.split(':')[1] as 'asc' | 'desc'
  }

  const { data, isLoading, refetch } = usePolling(
    () => tasks.getAll(queryParams),
    {
      interval: 30000,
    }
  )

  const [newTask, setNewTask] = useState<CreateTaskInput>({
      title: "",
      priority: 3,
    startTime: new Date(),
    endTime: new Date(),
    })

  const handleAddTask = async () => {
    try {
      await tasks.create(newTask)
    toast({
      title: "Success",
      description: "Task added successfully",
    })
      refetch()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add task:', error)
      let errorMessage = 'Failed to add task'
      
      if (error instanceof Error) {
        // Handle specific validation errors
        if (error.message.includes('End time must be after start time')) {
          errorMessage = 'End time must be after start time'
        } else if (error.message.includes('Title is required')) {
          errorMessage = 'Title is required'
        } else if (error.message.includes('Invalid priority')) {
          errorMessage = 'Priority must be between 1 and 5'
        } else {
          errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      })
    }
  }

  const handleEditTask = async () => {
    if (!editingTask) return
    try {
      const updatePayload = {
        title: editingTask.title,
        priority: editingTask.priority,
        status: editingTask.status,
        startTime: new Date(editingTask.startTime),
        endTime: new Date(editingTask.endTime)
      }

      await tasks.update(editingTask._id, updatePayload)
    toast({
      title: "Success",
      description: "Task updated successfully",
    })
      refetch()
      setIsEditDialogOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
      let errorMessage = 'Failed to update task'
      
      if (error instanceof Error) {
        // Handle specific validation errors
        if (error.message.includes('End time must be after start time')) {
          errorMessage = 'End time must be after start time'
        } else if (error.message.includes('Title is required')) {
          errorMessage = 'Title is required'
        } else if (error.message.includes('Invalid priority')) {
          errorMessage = 'Priority must be between 1 and 5'
        } else if (error.message.includes('Task not found')) {
          errorMessage = 'Task no longer exists'
        } else {
          errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      })
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map(_id => tasks.delete(_id)))
    toast({
      title: "Success",
      description: `${selectedTasks.length} task(s) deleted successfully`,
    })
      setSelectedTasks([])
      refetch()
    } catch (error) {
      console.error('Failed to delete tasks:', error)
      let errorMessage = 'Failed to delete tasks'

      if (error instanceof Error) {
        if (error.message.includes('Task not found')) {
          errorMessage = 'One or more tasks no longer exist'
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = 'You are not authorized to delete these tasks'
        } else {
          errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
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
      const pageTaskIds = data?.tasks.map(task => task._id) || []
      setSelectedTasks(pageTaskIds)
    } else {
      setSelectedTasks([])
    }
  }

  const filteredAndSortedTasks = data?.tasks
    .filter((task) => !filterPriority || task.priority === Number(filterPriority))
    .filter((task) => !filterStatus || task.status === filterStatus)
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
        isLoading={isLoading}
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

