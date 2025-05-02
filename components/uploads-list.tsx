"use client"

import { useState } from "react"
import Link from "next/link"
import { FileIcon, MoreHorizontalIcon, RefreshCwIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { formatDate, formatFileSize } from "@/lib/utils"
import { deleteUpload, reanalyzeUpload } from "@/lib/actions"
import type { FileUpload } from "@/lib/types"

interface UploadsListProps {
  uploads: FileUpload[]
}

export function UploadsList({ uploads }: UploadsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [localUploads, setLocalUploads] = useState<FileUpload[]>(uploads)

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteUpload(deleteId)
      setLocalUploads(localUploads.filter((upload) => upload.id !== deleteId))
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the file",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleReanalyze = async (id: string) => {
    setProcessing(id)

    try {
      await reanalyzeUpload(id)
      toast({
        title: "Reanalysis started",
        description: "The file is being reanalyzed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reanalyze the file",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  if (localUploads.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 text-center">
        <FileIcon className="mb-4 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No files uploaded</h3>
        <p className="mb-4 text-sm text-muted-foreground">Upload a CSV file to get started with analysis</p>
        <Button asChild>
          <Link href="/">Upload File</Link>
        </Button>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard?id=${upload.analysisId}`} className="flex items-center hover:underline">
                      <FileIcon className="mr-2 h-4 w-4" />
                      {upload.fileName}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(upload.createdAt)}</TableCell>
                  <TableCell>{formatFileSize(upload.fileSize)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {upload.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard?id=${upload.analysisId}`}>View Analysis</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReanalyze(upload.id)}
                          disabled={processing === upload.id}
                        >
                          {processing === upload.id ? (
                            <>
                              <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <RefreshCwIcon className="mr-2 h-4 w-4" />
                              Reanalyze
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(upload.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file and all associated analysis data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
