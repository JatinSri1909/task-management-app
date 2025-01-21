import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const summaryData = {
  totalTasks: 50,
  completedTasks: 30,
  pendingTasks: 20,
  averageTime: 2.5,
}

const pendingSummary = {
  pendingTasks: 20,
  timeLapsed: 48,
  timeToFinish: 72,
}

const taskTableData = [
  { priority: 5, pendingTasks: 5, timeElapsed: 10, timeToFinish: 15 },
  { priority: 3, pendingTasks: 10, timeElapsed: 24, timeToFinish: 36 },
  { priority: 1, pendingTasks: 5, timeElapsed: 14, timeToFinish: 21 },
]

export default function DashboardContent() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.pendingTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time per Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.averageTime} hrs</div>
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
              <p className="text-2xl">{pendingSummary.pendingTasks}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time Lapsed</p>
              <p className="text-2xl">{pendingSummary.timeLapsed} hrs</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Time to Finish</p>
              <p className="text-2xl">{pendingSummary.timeToFinish} hrs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Priority Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Pending Tasks</TableHead>
                <TableHead>Time Elapsed (hrs)</TableHead>
                <TableHead>Time to Finish (hrs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskTableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.pendingTasks}</TableCell>
                  <TableCell>{row.timeElapsed}</TableCell>
                  <TableCell>{row.timeToFinish}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

