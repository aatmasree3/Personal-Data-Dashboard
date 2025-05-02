"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getAnalysisById } from "@/lib/data"
import type { Analysis, ColumnSummary } from "@/lib/types"

export function DataSummary() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("id")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      if (!analysisId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data = await getAnalysisById(analysisId)
        setAnalysis(data)
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [analysisId])

  if (loading) {
    return <DataSummarySkeleton />
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No analysis data available. Select a dataset to view summary.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Rows</div>
              <div className="text-2xl font-bold">{analysis.rowCount}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Columns</div>
              <div className="text-2xl font-bold">{analysis.columnCount}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Missing Values</div>
              <div className="text-2xl font-bold">{analysis.missingValues}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">File Size</div>
              <div className="text-2xl font-bold">{formatFileSize(analysis.fileSize)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Column Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={analysis.columns[0]?.name || "tab1"}>
            <TabsList className="w-full max-w-md flex-wrap">
              {analysis.columns.map((column) => (
                <TabsTrigger key={column.name} value={column.name}>
                  {column.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {analysis.columns.map((column) => (
              <TabsContent key={column.name} value={column.name}>
                <ColumnSummaryCard column={column} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ColumnSummaryCard({ column }: { column: ColumnSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium text-muted-foreground">Type</div>
        <div className="text-xl font-bold capitalize">{column.dataType}</div>
      </div>

      {column.dataType === "numeric" && (
        <>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Mean</div>
            <div className="text-xl font-bold">{formatNumber(column.stats.mean)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Std Dev</div>
            <div className="text-xl font-bold">{formatNumber(column.stats.std)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Min</div>
            <div className="text-xl font-bold">{formatNumber(column.stats.min)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Max</div>
            <div className="text-xl font-bold">{formatNumber(column.stats.max)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Median</div>
            <div className="text-xl font-bold">{formatNumber(column.stats.median)}</div>
          </div>
        </>
      )}

      {column.dataType === "categorical" && (
        <>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Unique Values</div>
            <div className="text-xl font-bold">{column.stats.uniqueCount}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Most Common</div>
            <div className="text-xl font-bold">{column.stats.mostCommon}</div>
          </div>
        </>
      )}

      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium text-muted-foreground">Missing</div>
        <div className="text-xl font-bold">
          {column.stats.missingCount} ({formatPercentage(column.stats.missingPercentage)})
        </div>
      </div>
    </div>
  )
}

function DataSummarySkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <Skeleton className="mb-2 h-4 w-[80px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-4 h-10 w-[300px]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <Skeleton className="mb-2 h-4 w-[80px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A"
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}

function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A"
  return `${(value * 100).toFixed(1)}%`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
