import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import TaskActions from "./task-actions"
import type { Task } from "@/lib/api"

interface TaskListProps {
  tasks: Task[]
  selectedTasks: string[]
  onTaskSelect: (taskId: string) => void
  onSelectAll: (checked: boolean) => void
  onEdit: (task: Task) => void
}

export default function TaskList({
  tasks,
  selectedTasks,
  onTaskSelect,
  onSelectAll,
  onEdit
}: TaskListProps) {
  const allSelected = tasks.length > 0 && tasks.every(task => selectedTasks.includes(task._id))

  return (
    <div className="rounded-md border bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="min-w-[100px]">Priority</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[180px]">Start Time</TableHead>
            <TableHead className="min-w-[180px]">End Time</TableHead>
            <TableHead className="min-w-[140px]">Time to Finish (hrs)</TableHead>
            <TableHead className="min-w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => (
              <TableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task._id)}
                    onCheckedChange={(checked) => onTaskSelect(task._id)}
                    aria-label={`Select task ${task.title}`}
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
                <TableCell>
                  {Math.round((new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / (1000 * 60 * 60))}
                </TableCell>
                <TableCell>
                  <TaskActions task={task} onEdit={onEdit} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 