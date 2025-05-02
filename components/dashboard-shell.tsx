import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="container flex-1 items-start px-4 py-6 sm:px-6 md:py-8">{children}</div>
}
