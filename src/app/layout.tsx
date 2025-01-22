import type { Metadata } from "next"
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import Wrapper from "@/components/layout/wrapper"
import { ToastProvider } from "@/providers/toast-provider"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "TaskMaster - Manage Tasks with Ease",
  description:
    "Boost your productivity and streamline your workflow with TaskMaster, the ultimate task management application.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <UserProvider>
          <Wrapper>
            {children}
          </Wrapper>
        </UserProvider>
        <ToastProvider />
      </body>
    </html>
  )
}

