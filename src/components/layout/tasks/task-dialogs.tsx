import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Task, CreateTaskInput } from "@/lib/api"

interface TaskDialogsProps {
  isAddOpen: boolean
  isEditOpen: boolean
  editingTask: Task | null
  newTask: CreateTaskInput
  onAddClose: () => void
  onEditClose: () => void
  onAddSubmit: () => void
  onEditSubmit: () => void
  onNewTaskChange: (field: keyof CreateTaskInput, value: string | number | Date) => void
  onEditingTaskChange: (field: keyof Task, value: string | number | Date) => void
}

function formatDateForInput(date: Date | string): string {
  const d = new Date(date)
  // Adjust for local timezone
  const tzOffset = d.getTimezoneOffset() * 60000 // offset in milliseconds
  const localDate = new Date(d.getTime() - tzOffset)
  return localDate.toISOString().slice(0, 16)
}

export default function TaskDialogs({
  isAddOpen,
  isEditOpen,
  editingTask,
  newTask,
  onAddClose,
  onEditClose,
  onAddSubmit,
  onEditSubmit,
  onNewTaskChange,
  onEditingTaskChange
}: TaskDialogsProps) {
  return (
    <>
      <Dialog open={isAddOpen} onOpenChange={onAddClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => onNewTaskChange('title', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Priority</Label>
              <Select
                value={newTask.priority.toString()}
                onValueChange={(value) => onNewTaskChange('priority', parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formatDateForInput(newTask.startTime)}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  onNewTaskChange('startTime', date)
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formatDateForInput(newTask.endTime)}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  onNewTaskChange('endTime', date)
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onAddClose}>Cancel</Button>
            <Button onClick={onAddSubmit}>Add Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      {editingTask && (
        <Dialog open={isEditOpen} onOpenChange={onEditClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted with task:', editingTask);
              onEditSubmit();
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => onEditingTaskChange('title', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                  <Select
                    value={editingTask.priority.toString()}
                    onValueChange={(value) => onEditingTaskChange('priority', parseInt(value))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-status"
                      checked={editingTask.status === "finished"}
                      onCheckedChange={(checked) => 
                        onEditingTaskChange('status', checked ? "finished" : "pending")
                      }
                      className={editingTask.status === "finished" ? "bg-green-500" : "bg-red-500"}
                    />
                    <span>{editingTask.status === "finished" ? "Finished" : "Pending"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startTime" className="text-right">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    type="datetime-local"
                    value={formatDateForInput(editingTask.startTime)}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      onEditingTaskChange('startTime', date)
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endTime" className="text-right">End Time</Label>
                  <Input
                    id="edit-endTime"
                    type="datetime-local"
                    value={formatDateForInput(editingTask.endTime)}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      onEditingTaskChange('endTime', date)
                    }}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onEditClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Task
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 