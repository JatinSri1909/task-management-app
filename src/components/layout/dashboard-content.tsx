"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tasks } from "@/lib/api"
import { Progress } from "@/components/ui/progress"
import { usePolling } from "@/hooks/use-polling"
import { Skeleton } from "@/components/ui/skeleton"


export default function DashboardContent() {
  const { data: stats, isLoading } = usePolling(
    () => tasks.getStats(),
    { 
      interval: 60000,
      enabled: true
    }
  )

  console.log('Dashboard loading state:', { isLoading, stats })

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { overview, timeMetrics } = stats

  // Calculate percentages safely
  const totalTasks = overview.totalTasks || 0;
  const completedPercentage = totalTasks ? Math.round((overview.completedTasks / totalTasks) * 100) : 0;
  const pendingPercentage = totalTasks ? Math.round((overview.pendingTasks / totalTasks) * 100) : 0;

  // Destructure with defaults
  const { 
    pendingSummary = { timeLapsed: 0, timeToFinish: 0, pendingTasks: 0 },
    tasksByPriority = []
  } = stats;

  const PRIORITY_LEVELS = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{overview.completedTasks}</div>
              <div className="text-sm text-muted-foreground">
                {completedPercentage}%
              </div>
            </div>
            <Progress 
              value={completedPercentage} 
              className="mt-2"
              indicatorColor="bg-green-500"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{overview.pendingTasks}</div>
              <div className="text-sm text-muted-foreground">
                {pendingPercentage}%
              </div>
            </div>
            <Progress 
              value={pendingPercentage} 
              className="mt-2"
              indicatorColor="bg-yellow-500"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time per Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeMetrics.averageCompletionTime.toFixed(1)} hrs
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Pending Tasks</p>
              <p className="text-2xl font-bold">{overview.pendingTasks || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time Elapsed</p>
              <p className="text-2xl font-bold">{timeMetrics.totalTimeElapsed} hrs</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time to Finish</p>
              <p className="text-2xl font-bold">{timeMetrics.totalTimeToFinish} hrs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Priority Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Time Elapsed</TableHead>
                <TableHead>Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRIORITY_LEVELS.map((priority) => {
                const priorityData = timeMetrics.pendingTasksByPriority.find(
                  item => item.priority === priority
                ) || {
                  priority,
                  count: 0,
                  timeElapsed: 0,
                  estimatedTimeLeft: 0
                };

                return (
                  <TableRow key={priority}>
                    <TableCell>{priority}</TableCell>
                    <TableCell>{priorityData.count}</TableCell>
                    <TableCell>{priorityData.timeElapsed}</TableCell>
                    <TableCell>{priorityData.estimatedTimeLeft}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

