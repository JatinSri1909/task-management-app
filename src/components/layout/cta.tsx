"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Cta() {

  const router = useRouter()

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users and start managing your tasks effectively today.
        </p>
        <Button size="lg" variant="secondary" className="rounded-full" onClick={() => router.push('/auth/login')}>
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

