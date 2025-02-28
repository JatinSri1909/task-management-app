import type { Task } from "@/lib/api"

export const dummyData = {
  // User data
  user: {
    id: "1",
    email: "john@example.com",
  },

  // Dashboard data
  stats: {
    overview: {
      totalTasks: 50,
      completedTasks: 30,
      pendingTasks: 20,
      completedPercentage: 60,
      pendingPercentage: 40,
      averageTime: 2.5,
    },
    timeMetrics: {
      averageCompletionTime: 2.5,
      totalTimeElapsed: 48,
      totalTimeToFinish: 72,
      pendingTasksByPriority: [
        { priority: 5, count: 5, timeElapsed: 10, estimatedTimeLeft: 15 },
        { priority: 3, count: 10, timeElapsed: 24, estimatedTimeLeft: 36 },
        { priority: 1, count: 5, timeElapsed: 14, estimatedTimeLeft: 21 },
      ]
    }
  },

  // Tasks data
  tasks: [
    {
      id: "1",
      title: "Complete project proposal",
      priority: 5 as const,
      status: "pending" as const,
      startTime: "2023-06-01T09:00",
      endTime: "2023-06-07T17:00",
      userId: "1",
    },
    {
      id: "2",
      title: "Review code changes",
      priority: 3 as const,
      status: "pending" as const,
      startTime: "2023-06-03T10:00",
      endTime: "2023-06-05T16:00",
      timeToFinish: 16,
    },
    {
      id: "3",
      title: "Update documentation",
      priority: 1 as const,
      status: "finished" as const,
      startTime: "2023-06-02T14:00",
      endTime: "2023-06-04T12:00",
      timeToFinish: 24,
    }
  ] as Task[]
}; 