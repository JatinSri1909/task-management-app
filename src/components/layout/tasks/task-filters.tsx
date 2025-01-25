import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface TaskFiltersProps {
  sortBy: string
  filterPriority: string
  filterStatus: string
  onSortChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClearPriority: () => void
  onClearStatus: () => void
}

const PRIORITY_OPTIONS = [
  { value: "5", label: "5" },
  { value: "4", label: "4" },
  { value: "3", label: "3" },
  { value: "2", label: "2" },
  { value: "1", label: "1" }
]

export default function TaskFilters({
  sortBy,
  filterPriority,
  filterStatus,
  onSortChange,
  onPriorityChange,
  onStatusChange,
  onClearPriority,
  onClearStatus
}: TaskFiltersProps) {
  return (
    <>
      <Select value={sortBy} onValueChange={onSortChange}>
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

      <Select value={filterPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filterPriority && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onClick={onClearPriority}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="min-w-[140px] sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="finished">Finished</SelectItem>
        </SelectContent>
      </Select>

      {filterStatus && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0"
          onClick={onClearStatus}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </>
  )
} 