import Header from "@/components/layout/header"
import Hero from "@/components/layout/hero"
import Features from "@/components/layout/features"
import Cta from "@/components/layout/cta"
import Footer from "@/components/layout/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

