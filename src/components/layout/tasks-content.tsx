/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Pencil, X, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    priority: 5,
    status: "Pending",
    startTime: "2023-06-01T09:00",
    endTime: "2023-06-07T17:00",
    timeToFinish: 40,
  },
  {
    id: 2,
    title: "Review code changes",
    priority: 3,
    status: "Pending",
    startTime: "2023-06-03T10:00",
    endTime: "2023-06-05T16:00",
    timeToFinish: 16,
  },
  {
    id: 3,
    title: "Update documentation",
    priority: 1,
    status: "Finished",
    startTime: "2023-06-02T14:00",
    endTime: "2023-06-04T12:00",
    timeToFinish: 24,
  },
]

export default function TaskContent() {
  const [tasks, setTasks] = useState(initialTasks)
  const [sortBy, setSortBy] = useState("startTime:asc")
  const [filterPriority, setFilterPriority] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    priority: 3,
    status: "Pending",
    startTime: "",
    endTime: "",
  })
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Adjust this number as needed

  const handleAddTask = () => {
    const taskToAdd = {
      ...newTask,
      id: tasks.length + 1,
      timeToFinish: 0, // You might want to calculate this based on start and end time
    }
    setTasks([...tasks, taskToAdd])
    setIsAddDialogOpen(false)
    setNewTask({
      title: "",
      priority: 3,
      status: "Pending",
      startTime: "",
      endTime: "",
    })
    toast({
      variant: "success",
      title: "Success",
      description: "Task added successfully",
    })
  }

  const handleEditTask = () => {
    const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    setTasks(updatedTasks)
    setIsEditDialogOpen(false)
    setEditingTask(null)
    toast({
      variant: "success",
      title: "Success",
      description: "Task updated successfully",
    })
  }

  const handleDeleteSelected = () => {
    const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id))
    setTasks(updatedTasks)
    setSelectedTasks([])
    toast({
      variant: "success",
      title: "Success",
      description: `${selectedTasks.length} task(s) deleted successfully`,
    })
  }

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => !filterPriority || task.priority === Number.parseInt(filterPriority))
    .filter((task) => !filterStatus || task.status === filterStatus)
    .sort((a, b) => {
      const [field, order] = sortBy.split(":") as [keyof typeof tasks[0], string]
      if (a[field] < b[field]) return order === "asc" ? -1 : 1
      if (a[field] > b[field]) return order === "asc" ? 1 : -1
      return 0
    })

  // Add pagination calculation
  const paginatedTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allTaskIds = paginatedTasks.map(task => task.id)
      setSelectedTasks(allTaskIds)
    } else {
      setSelectedTasks([])
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls Section - Make it stack on mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {/* Left Controls - Updated for small and medium devices */}
        <div className="space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 lg:hidden" />
                <span className="hidden lg:inline">Add Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTask.priority.toString()}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Switch
                    id="status"
                    checked={newTask.status === "Finished"}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, status: checked ? "Finished" : "Pending" })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedTasks.length === 0}>
            <Trash2 className="h-4 w-4 lg:hidden" />
            <span className="hidden lg:inline">Delete Selected</span>
          </Button>
        </div>
        
        {/* Right Controls - Make filters scroll horizontally on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="min-w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startTime:asc">Start Time: Asc</SelectItem>
              <SelectItem value="startTime:desc">Start Time: Desc</SelectItem>
              <SelectItem value="endTime:asc">End Time: Asc</SelectItem>
              <SelectItem value="endTime:desc">End Time: Desc</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="min-w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((p) => (
                <SelectItem key={p} value={p.toString()}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filterPriority && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              onClick={() => setFilterPriority("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="min-w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
            </SelectContent>
          </Select>

          {filterStatus && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              onClick={() => setFilterStatus("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table Section - Make it scroll horizontally on mobile */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={paginatedTasks.length > 0 && paginatedTasks.every(task => selectedTasks.includes(task.id))}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[100px]">Priority</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[180px]">Start Time</TableHead>
              <TableHead className="min-w-[180px]">End Time</TableHead>
              <TableHead className="min-w-[140px]">Time to Finish (hrs)</TableHead>
              <TableHead className="min-w-[80px]">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                <TableCell>{task.timeToFinish}</TableCell>
                <TableCell>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                      </DialogHeader>
                      {editingTask && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="edit-title"
                              value={editingTask.title}
                              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-priority" className="text-right">
                              Priority
                            </Label>
                            <Select
                              value={editingTask.priority.toString()}
                              onValueChange={(value) =>
                                setEditingTask({ ...editingTask, priority: Number.parseInt(value) })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((p) => (
                                  <SelectItem key={p} value={p.toString()}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">
                              Status
                            </Label>
                            <Switch
                              id="edit-status"
                              checked={editingTask.status === "Finished"}
                              onCheckedChange={(checked) =>
                                setEditingTask({ ...editingTask, status: checked ? "Finished" : "Pending" })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-startTime" className="text-right">
                              Start Time
                            </Label>
                            <Input
                              id="edit-startTime"
                              type="datetime-local"
                              value={editingTask.startTime}
                              onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-endTime" className="text-right">
                              End Time
                            </Label>
                            <Input
                              id="edit-endTime"
                              type="datetime-local"
                              value={editingTask.endTime}
                              onChange={(e) => setEditingTask({ ...editingTask, endTime: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEditTask}>Update Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section - Make it stack on mobile */}
      <div className="flex flex-col gap-4 items-center sm:items-stretch">
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                // Show first page, last page, and pages around currentPage
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="text-sm text-gray-600 text-center">
          <span>Showing {paginatedTasks.length} of {filteredAndSortedTasks.length} items</span>
        </div>
      </div>
    </div>
  )
}

