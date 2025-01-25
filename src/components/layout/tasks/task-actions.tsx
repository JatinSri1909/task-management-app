import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { Task } from "@/lib/api"

interface TaskActionsProps {
  task: Task
  onEdit: (task: Task) => void
}

export default function TaskActions({ task, onEdit }: TaskActionsProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => onEdit(task)}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  )
} 