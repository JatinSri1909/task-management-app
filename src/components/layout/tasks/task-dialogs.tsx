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
  onNewTaskChange: (field: keyof CreateTaskInput, value: any) => void
  onEditingTaskChange: (field: keyof Task, value: any) => void
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
                  {[1, 2, 3, 4, 5].map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      Priority {p}
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
                value={new Date(newTask.startTime).toISOString().slice(0, 16)}
                onChange={(e) => onNewTaskChange('startTime', new Date(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={new Date(newTask.endTime).toISOString().slice(0, 16)}
                onChange={(e) => onNewTaskChange('endTime', new Date(e.target.value))}
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
                    {[1, 2, 3, 4, 5].map((p) => (
                      <SelectItem key={p} value={p.toString()}>
                        Priority {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Switch
                  id="edit-status"
                  checked={editingTask.status === "Finished"}
                  onCheckedChange={(checked) => 
                    onEditingTaskChange('status', checked ? "Finished" : "Pending")
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startTime" className="text-right">Start Time</Label>
                <Input
                  id="edit-startTime"
                  type="datetime-local"
                  value={new Date(editingTask.startTime).toISOString().slice(0, 16)}
                  onChange={(e) => onEditingTaskChange('startTime', new Date(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endTime" className="text-right">End Time</Label>
                <Input
                  id="edit-endTime"
                  type="datetime-local"
                  value={new Date(editingTask.endTime).toISOString().slice(0, 16)}
                  onChange={(e) => onEditingTaskChange('endTime', new Date(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onEditClose}>Cancel</Button>
              <Button onClick={onEditSubmit}>Update Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 