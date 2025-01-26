import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import TaskActions from "./task-actions"
import type { Task } from "@/lib/api"

interface TaskListProps {
  tasks: Task[]
  selectedTasks: string[]
  onTaskSelect: (taskId: string) => void
  onSelectAll: (checked: boolean) => void
  onEdit: (task: Task) => void
  isLoading?: boolean
}

export default function TaskList({
  tasks,
  selectedTasks,
  onTaskSelect,
  onSelectAll,
  onEdit,
  isLoading
}: TaskListProps) {
  // Check if all visible tasks are selected
  const allSelected = tasks.length > 0 && tasks.every(task => selectedTasks.includes(task._id));

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Skeleton className="h-4 w-4" /></TableHead>
              <TableHead className="min-w-[200px]"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="min-w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="min-w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="min-w-[180px]"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="min-w-[180px]"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead className="min-w-[140px]"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="min-w-[80px]"><Skeleton className="h-4 w-16" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
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
            tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task._id)}
                    onCheckedChange={() => onTaskSelect(task._id)}
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