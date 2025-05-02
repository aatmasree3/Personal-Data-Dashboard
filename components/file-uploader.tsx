"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { uploadCSV } from "@/lib/actions"

export function FileUploader() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      })
      e.target.value = ""
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadCSV(formData)

      clearInterval(interval)
      setProgress(100)

      if (result.success) {
        toast({
          title: "Upload successful",
          description: "Your CSV file has been uploaded and analyzed",
        })

        // Redirect to dashboard with the new analysis
        setTimeout(() => {
          router.push(`/dashboard?id=${result.analysisId}`)
          router.refresh()
        }, 1000)
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 text-center">
        <FileUpIcon className="mb-4 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Upload CSV File</h3>
        <p className="mb-4 text-sm text-muted-foreground">Drag and drop your CSV file here, or click to browse</p>
        <input
          type="file"
          id="csv-upload"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <Button variant="outline" onClick={() => document.getElementById("csv-upload")?.click()} disabled={uploading}>
          Select File
        </Button>
        {file && (
          <p className="mt-2 text-sm">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {file && (
        <div className="space-y-2">
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs text-muted-foreground">
                {progress < 100 ? "Processing your file..." : "Finalizing analysis..."}
              </p>
            </div>
          )}
          <Button className="w-full" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload and Analyze"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
