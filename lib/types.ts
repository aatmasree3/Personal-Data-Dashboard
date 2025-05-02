export interface FileUpload {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  status: "processed" | "processing" | "failed"
  createdAt: string
  analysisId: string
}

export interface Analysis {
  id: string
  fileId: string
  fileName: string
  createdAt: string
  rowCount: number
  columnCount: number
  missingValues: number
  fileSize: number
  columns: ColumnSummary[]
}

export interface ColumnSummary {
  name: string
  dataType: "numeric" | "categorical" | "datetime" | "boolean"
  stats: {
    // Common stats
    missingCount: number
    missingPercentage: number

    // Numeric stats
    mean?: number
    median?: number
    std?: number
    min?: number
    max?: number

    // Categorical stats
    uniqueCount?: number
    mostCommon?: string
  }
  // For visualizations
  distribution: {
    min: number
    max: number
    count: number
  }[]
  categories: {
    value: string
    count: number
  }[]
}
