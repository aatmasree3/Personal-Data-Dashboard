import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DatasetSelector } from "@/components/dataset-selector"
import { DataSummary } from "@/components/data-summary"
import { Visualizations } from "@/components/visualizations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRecentAnalyses } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const analyses = await getRecentAnalyses()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">View and analyze your uploaded CSV data</p>
          </div>

          {analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold">No datasets available</h3>
              <p className="mb-4 text-sm text-muted-foreground">Upload a CSV file to get started with analysis</p>
              <Button asChild>
                <Link href="/">Upload CSV</Link>
              </Button>
            </div>
          ) : (
            <>
              <DatasetSelector analyses={analyses} />

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-4 pt-4">
                  <DataSummary />
                </TabsContent>
                <TabsContent value="visualizations" className="space-y-4 pt-4">
                  <Visualizations />
                </TabsContent>
                <TabsContent value="data" className="space-y-4 pt-4">
                  <div className="rounded-lg border">
                    <div className="h-[500px] w-full overflow-auto p-4">
                      <p className="text-center text-muted-foreground">Select a dataset to view raw data</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DashboardShell>
    </div>
  )
}
