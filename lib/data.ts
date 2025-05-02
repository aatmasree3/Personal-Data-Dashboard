import type { Analysis, FileUpload } from "./types"

// Mock data for demonstration purposes
// In a real application, this would be fetched from a database

export const mockUploads: FileUpload[] = [
  {
    id: "1",
    fileName: "sales_data.csv",
    fileSize: 1024 * 1024 * 2.5, // 2.5 MB
    mimeType: "text/csv",
    status: "processed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    analysisId: "1",
  },
  {
    id: "2",
    fileName: "customer_data.csv",
    fileSize: 1024 * 1024 * 1.2, // 1.2 MB
    mimeType: "text/csv",
    status: "processed",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    analysisId: "2",
  },
]

export const mockAnalyses: Analysis[] = [
  {
    id: "1",
    fileId: "1",
    fileName: "sales_data.csv",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rowCount: 1500,
    columnCount: 8,
    missingValues: 45,
    fileSize: 1024 * 1024 * 2.5,
    columns: [
      {
        name: "date",
        dataType: "datetime",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
        },
        distribution: Array(10)
          .fill(0)
          .map((_, i) => ({
            min: i * 30,
            max: (i + 1) * 30,
            count: Math.floor(Math.random() * 200) + 50,
          })),
        categories: [],
      },
      {
        name: "product_id",
        dataType: "categorical",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
          uniqueCount: 120,
          mostCommon: "PRD-123",
        },
        distribution: [],
        categories: Array(10)
          .fill(0)
          .map((_, i) => ({
            value: `PRD-${100 + i}`,
            count: Math.floor(Math.random() * 100) + 20,
          })),
      },
      {
        name: "quantity",
        dataType: "numeric",
        stats: {
          missingCount: 15,
          missingPercentage: 0.01,
          mean: 12.5,
          median: 10,
          std: 8.3,
          min: 1,
          max: 100,
        },
        distribution: Array(10)
          .fill(0)
          .map((_, i) => ({
            min: i * 10,
            max: (i + 1) * 10,
            count: Math.floor(Math.random() * 200) + 50,
          })),
        categories: [],
      },
      {
        name: "price",
        dataType: "numeric",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
          mean: 45.99,
          median: 39.99,
          std: 25.5,
          min: 9.99,
          max: 199.99,
        },
        distribution: Array(10)
          .fill(0)
          .map((_, i) => ({
            min: i * 20,
            max: (i + 1) * 20,
            count: Math.floor(Math.random() * 200) + 50,
          })),
        categories: [],
      },
      {
        name: "customer_id",
        dataType: "categorical",
        stats: {
          missingCount: 5,
          missingPercentage: 0.003,
          uniqueCount: 450,
          mostCommon: "CUST-789",
        },
        distribution: [],
        categories: Array(10)
          .fill(0)
          .map((_, i) => ({
            value: `CUST-${700 + i}`,
            count: Math.floor(Math.random() * 50) + 10,
          })),
      },
      {
        name: "is_promotion",
        dataType: "boolean",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
        },
        distribution: [],
        categories: [
          { value: "true", count: 350 },
          { value: "false", count: 1150 },
        ],
      },
    ],
  },
  {
    id: "2",
    fileId: "2",
    fileName: "customer_data.csv",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    rowCount: 800,
    columnCount: 6,
    missingValues: 25,
    fileSize: 1024 * 1024 * 1.2,
    columns: [
      {
        name: "customer_id",
        dataType: "categorical",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
          uniqueCount: 800,
          mostCommon: "CUST-001",
        },
        distribution: [],
        categories: Array(10)
          .fill(0)
          .map((_, i) => ({
            value: `CUST-00${i}`,
            count: Math.floor(Math.random() * 20) + 5,
          })),
      },
      {
        name: "age",
        dataType: "numeric",
        stats: {
          missingCount: 10,
          missingPercentage: 0.0125,
          mean: 42.5,
          median: 39,
          std: 15.2,
          min: 18,
          max: 85,
        },
        distribution: Array(10)
          .fill(0)
          .map((_, i) => ({
            min: 18 + i * 7,
            max: 18 + (i + 1) * 7,
            count: Math.floor(Math.random() * 100) + 30,
          })),
        categories: [],
      },
      {
        name: "income",
        dataType: "numeric",
        stats: {
          missingCount: 15,
          missingPercentage: 0.01875,
          mean: 65000,
          median: 58000,
          std: 25000,
          min: 20000,
          max: 150000,
        },
        distribution: Array(10)
          .fill(0)
          .map((_, i) => ({
            min: 20000 + i * 13000,
            max: 20000 + (i + 1) * 13000,
            count: Math.floor(Math.random() * 100) + 30,
          })),
        categories: [],
      },
      {
        name: "region",
        dataType: "categorical",
        stats: {
          missingCount: 0,
          missingPercentage: 0,
          uniqueCount: 5,
          mostCommon: "North",
        },
        distribution: [],
        categories: [
          { value: "North", count: 250 },
          { value: "South", count: 200 },
          { value: "East", count: 150 },
          { value: "West", count: 180 },
          { value: "Central", count: 20 },
        ],
      },
    ],
  },
]

export async function getUploads(): Promise<FileUpload[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUploads
}

export async function getRecentAnalyses(): Promise<Analysis[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAnalyses
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockAnalyses.find((analysis) => analysis.id === id) || null
}
