"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function Header() {
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl text-blue-600 flex items-center ml-4">
          <CheckCircle className="mr-2 h-6 w-6" />
          TaskMaster
        </Link>
        <nav className="hidden md:flex space-x-6">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-base font-medium hover:text-blue-600 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-base font-medium hover:text-blue-600 transition-colors"
          >
            Pricing
          </button>
        </nav>
        <div className="flex space-x-3 -mr-4">
          <Button variant="ghost" asChild>
            <Link href="auth/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="auth/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

