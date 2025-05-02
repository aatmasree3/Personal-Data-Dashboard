"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getAnalysisById } from "@/lib/data"
import type { Analysis } from "@/lib/types"
import { BarChart, LineChart, AreaChart, PieChart } from "@/components/ui/chart"

export function Visualizations() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("id")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColumn, setSelectedColumn] = useState<string>("")

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
        if (data && data.columns.length > 0) {
          setSelectedColumn(data.columns[0].name)
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [analysisId])

  if (loading) {
    return <VisualizationsSkeleton />
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No analysis data available. Select a dataset to view visualizations.
          </p>
        </CardContent>
      </Card>
    )
  }

  const selectedColumnData = analysis.columns.find((col) => col.name === selectedColumn)
  const numericColumns = analysis.columns.filter((col) => col.dataType === "numeric")

  // Generate sample data for visualizations based on column type
  const generateChartData = () => {
    if (!selectedColumnData) return []

    if (selectedColumnData.dataType === "numeric") {
      // Create histogram-like data for numeric columns
      return selectedColumnData.distribution.map((bin) => ({
        name: `${bin.min.toFixed(1)}-${bin.max.toFixed(1)}`,
        value: bin.count,
      }))
    } else {
      // Create frequency data for categorical columns
      return selectedColumnData.categories
        .map((category) => ({
          name: category.value || "N/A",
          value: category.count,
        }))
        .slice(0, 10) // Limit to top 10 categories
    }
  }

  const chartData = generateChartData()

  // Generate correlation data between numeric columns
  const correlationData = numericColumns.map((col) => {
    const correlations = numericColumns.map((otherCol) => ({
      name: otherCol.name,
      value: col.name === otherCol.name ? 1 : Math.random() * 2 - 1, // Simulate correlation values
    }))

    return {
      name: col.name,
      data: correlations,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h3 className="text-lg font-medium">Data Visualizations</h3>
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {analysis.columns.map((column) => (
              <SelectItem key={column.name} value={column.name}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="distribution">
        <TabsList>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedColumnData?.dataType === "numeric" ? "Value Distribution" : "Category Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {selectedColumnData?.dataType === "numeric" ? (
                <BarChart
                  data={chartData}
                  index="name"
                  categories={["value"]}
                  colors={["teal"]}
                  valueFormatter={(value) => value.toString()}
                  yAxisWidth={48}
                />
              ) : (
                <PieChart
                  data={chartData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => value.toString()}
                  colors={["sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "orange", "amber", "yellow"]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {numericColumns.length > 1 ? (
                <BarChart
                  data={correlationData}
                  index="name"
                  categories={numericColumns.map((col) => col.name)}
                  colors={["sky", "indigo", "violet", "purple", "fuchsia"]}
                  valueFormatter={(value) => value.toFixed(2)}
                  yAxisWidth={60}
                  stack
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    At least two numeric columns are required for correlation analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {selectedColumnData?.dataType === "numeric" ? (
                <LineChart
                  data={chartData}
                  index="name"
                  categories={["value"]}
                  colors={["violet"]}
                  valueFormatter={(value) => value.toString()}
                  yAxisWidth={48}
                />
              ) : (
                <AreaChart
                  data={chartData}
                  index="name"
                  categories={["value"]}
                  colors={["purple"]}
                  valueFormatter={(value) => value.toString()}
                  yAxisWidth={48}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VisualizationsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <Skeleton className="mb-4 h-10 w-[300px]" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
