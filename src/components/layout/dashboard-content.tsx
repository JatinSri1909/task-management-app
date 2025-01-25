"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tasks } from "@/lib/api"
import { dummyData } from "@/data/dummy"
import { Progress } from "@/components/ui/progress"
import { usePolling } from "@/hooks/use-polling"

const PRIORITY_LEVELS = [5, 4, 3, 2, 1]

export default function DashboardContent() {
  const { data: stats, loading, error } = usePolling(
    () => tasks.getStats(),
    {
      interval: 60000,
      fallbackData: dummyData.stats
    }
  )

  if (loading) return <div>Loading...</div>
  if (error || !stats) return <div>Error loading dashboard</div>

  // For percentages
  const completedPercentage = Math.round((stats.overview.completedTasks / stats.overview.totalTasks) * 100)
  const pendingPercentage = Math.round((stats.overview.pendingTasks / stats.overview.totalTasks) * 100)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{stats.overview.completedTasks}</div>
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
              <div className="text-2xl font-bold">{stats.overview.pendingTasks}</div>
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
            <div className="text-2xl font-bold">{stats.overview.averageTime} hrs</div>
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
              <p className="text-2xl font-bold">{stats.overview.pendingTasks}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time Elapsed</p>
              <p className="text-2xl font-bold">
                {stats.timeMetrics.totalTimeElapsed} hrs
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time to Finish</p>
              <p className="text-2xl font-bold">
                {stats.timeMetrics.totalTimeToFinish} hrs
              </p>
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
                <TableHead>Task Priority</TableHead>
                <TableHead>Pending Tasks</TableHead>
                <TableHead>Time Elapsed (hrs)</TableHead>
                <TableHead>Time to Finish (hrs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRIORITY_LEVELS.map((priority) => {
                const pendingData = stats.timeMetrics.pendingTasksByPriority.find(
                  r => r.priority === priority
                ) || { count: 0, timeElapsed: 0, estimatedTimeLeft: 0 }

                return (
                  <TableRow key={priority}>
                    <TableCell>{priority}</TableCell>
                    <TableCell>{pendingData.count}</TableCell>
                    <TableCell>{pendingData.timeElapsed}</TableCell>
                    <TableCell>{pendingData.estimatedTimeLeft}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

