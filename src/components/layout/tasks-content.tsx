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
import React from "react"
import { AxiosError } from "axios"

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
      await tasks.create(newTask);
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      setIsAddDialogOpen(false);
      refetch(); // Refresh the task list
    } catch (error) {
      console.error('Failed to add task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add task"
      });
    }
  };

  const handleEditClick = (task: Task) => {
    console.log('Setting editing task:', { id: task._id, task });
    setEditingTask({
      ...task,
      id: task._id // Use MongoDB's _id
    });
    setIsEditDialogOpen(true);
  };

  const handleEditTask = async () => {
    if (!editingTask?.id) {
      console.error('Invalid task ID:', editingTask);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid task ID"
      });
      return;
    }

    try {
      console.log('Updating task:', { id: editingTask.id, editingTask });
      
      await tasks.update(editingTask.id, {
        title: editingTask.title,
        priority: editingTask.priority,
        status: editingTask.status,
        startTime: new Date(editingTask.startTime),
        endTime: new Date(editingTask.endTime)
      });

      toast({ title: "Success", description: "Task updated successfully" });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      await refetch();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Update failed:', error.response?.data);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to update task"
        });
      }
    }
  };

  const handleDeleteSelected = async () => {
    try {
      console.log('Deleting tasks:', selectedTasks);
      await Promise.all(selectedTasks.map(id => tasks.delete(id)));
      
      toast({
        title: "Success",
        description: `${selectedTasks.length} task(s) deleted successfully`,
      });
      setSelectedTasks([]);
      await refetch();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Delete failed:', error.response?.data);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to delete tasks"
        });
      }
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all visible tasks
      const visibleTaskIds = paginatedTasks.map(task => task._id);
      setSelectedTasks(visibleTaskIds);
    } else {
      // Deselect all
      setSelectedTasks([]);
    }
  };

  const filteredAndSortedTasks = React.useMemo(() => {
    if (!taskData?.tasks) return [];
    
    return taskData.tasks
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
      });
  }, [taskData?.tasks, filterPriority, filterStatus, sortBy]);

  const paginatedTasks = React.useMemo(() => {
    return filteredAndSortedTasks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAndSortedTasks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage)

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
        onEdit={handleEditClick}
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
          setIsEditDialogOpen(false);
          setEditingTask(null);
        }}
        onAddSubmit={handleAddTask}
        onEditSubmit={handleEditTask}
        onNewTaskChange={(field, value) => setNewTask({ ...newTask, [field]: value })}
        onEditingTaskChange={(field, value) => {
          if (editingTask) {
            setEditingTask({ ...editingTask, [field]: value });
          }
        }}
      />
    </div>
  )
}

