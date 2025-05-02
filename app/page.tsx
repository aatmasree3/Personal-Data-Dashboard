import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FileUploader } from "@/components/file-uploader"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center md:py-12">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">CSV Data Analysis Dashboard</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Upload your CSV files for automated analysis and interactive visualizations
            </p>
          </div>
          <div className="w-full max-w-2xl space-y-4 rounded-lg border p-6 shadow-sm">
            <FileUploader />
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/uploads">View Uploads</Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}
