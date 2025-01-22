"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="pt-28 pb-20 px-4 md:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="container mx-auto text-center">
        <Badge className="mb-4" variant="secondary">
          ✨ Your Productivity Companion
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl lg:leading-[2] md:leading-[2] font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Manage Tasks with Ease
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Boost your productivity and streamline your workflow with TaskMaster. The ultimate task management solution
          for teams and individuals.
        </p>
        <Button size="lg" className="rounded-full" onClick={() => router.push('/auth/login')}>
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

