import { CheckCircle, Clock, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    title: "Task Organization",
    description: "Easily create, categorize, and prioritize your tasks for maximum efficiency.",
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-500" />,
    title: "Time Tracking",
    description: "Monitor time spent on tasks to improve productivity and project management.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-500" />,
    title: "Team Collaboration",
    description: "Share tasks and collaborate with your team in real-time for seamless workflow.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "Automation",
    description: "Set up automated workflows to reduce manual work and increase productivity.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border border-blue-100">
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-blue-800">
                  {feature.icon}
                  <span className="ml-2">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

