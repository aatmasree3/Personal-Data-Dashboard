import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UploadsList } from "@/components/uploads-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUploads } from "@/lib/data"

export default async function UploadsPage() {
  const uploads = await getUploads()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Uploads</h2>
              <p className="text-muted-foreground">Manage your uploaded CSV files</p>
            </div>
            <Button asChild>
              <Link href="/">Upload New File</Link>
            </Button>
          </div>

          <UploadsList uploads={uploads} />
        </div>
      </DashboardShell>
    </div>
  )
}
