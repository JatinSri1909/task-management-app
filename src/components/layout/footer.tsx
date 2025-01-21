import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 lg:px-8 bg-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-xl font-bold text-blue-600">
            TaskMaster
          </Link>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end space-x-4">
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}

