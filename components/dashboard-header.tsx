"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { FileUpIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <FileUpIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CSV Analyzer</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
