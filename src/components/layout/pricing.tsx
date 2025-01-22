"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals getting started",
    price: "$0",
    features: ["Up to 10 projects", "Basic task management", "Calendar view", "Mobile app access"],
  },
  {
    name: "Pro",
    description: "Best for professionals and small teams",
    price: "$9",
    popular: true,
    features: [
      "Unlimited projects",
      "Advanced task management",
      "Team collaboration",
      "Custom workflows",
      "Priority support",
      "Analytics dashboard",
    ],
  },
  {
    name: "Business",
    description: "For growing businesses and large teams",
    price: "$19",
    features: [
      "Everything in Pro",
      "Enterprise security",
      "Admin controls",
      "API access",
      "Custom integrations",
      "Dedicated support",
    ],
  },
]

export default function Pricing() {

  const router = useRouter()
  
  return (
    <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-500">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full rounded-full ${plan.popular ? "" : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}`}
                  variant={plan.popular ? "default" : "ghost"}
                  onClick={() => router.push('/auth/login')}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

