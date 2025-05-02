"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Analysis } from "@/lib/types"

interface DatasetSelectorProps {
  analyses: Analysis[]
}

export function DatasetSelector({ analyses }: DatasetSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("id") || (analyses.length > 0 ? analyses[0].id : null),
  )

  useEffect(() => {
    // If there's an ID in the URL, use that
    const idFromUrl = searchParams.get("id")

    if (idFromUrl) {
      setSelectedId(idFromUrl)
    } else if (analyses.length > 0 && !selectedId) {
      // If no ID in URL but we have analyses, use the first one
      setSelectedId(analyses[0].id)
      router.push(`/dashboard?id=${analyses[0].id}`)
    }
  }, [analyses, router, searchParams, selectedId])

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No datasets available. Upload a CSV file to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <label htmlFor="dataset-select" className="text-sm font-medium">
        Select Dataset
      </label>
      <Select value={selectedId || undefined} onValueChange={setSelectedId}>
        <SelectTrigger id="dataset-select" className="w-full sm:w-[300px]">
          <SelectValue placeholder="Select a dataset" />
        </SelectTrigger>
        <SelectContent>
          {analyses.map((analysis) => (
            <SelectItem key={analysis.id} value={analysis.id}>
              {analysis.fileName} ({formatDate(analysis.createdAt)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
