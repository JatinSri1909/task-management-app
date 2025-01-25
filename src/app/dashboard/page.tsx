"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardContent from "@/components/layout/dashboard-content"
import TaskContent from "@/components/layout/tasks-content"

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 lg:px-12 max-w-7xl">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <DashboardContent />
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <TaskContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

