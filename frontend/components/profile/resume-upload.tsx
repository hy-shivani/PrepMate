"use client"

import { useRef, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResumeUploadProps {
  initialName?: string;
  onFileSelect: (file: File | null) => void;
}

export function ResumeUpload({
  initialName,
  onFileSelect,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | undefined>(initialName)

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="sr-only"
        aria-label="Upload resume"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;

          if (file) {
            setFileName(file.name);
            onFileSelect(file);
          }
        }}
      />
      {fileName ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/60 p-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">PDF / DOC</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFileName(undefined)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
            aria-label="Remove resume"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-secondary/60"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Upload className="size-5" />
          </span>
          <span className="text-sm font-medium text-foreground">Upload your resume</span>
          <span className="text-xs text-muted-foreground">PDF, DOC or DOCX up to 5MB</span>
        </button>
      )}
    </div>
  )
}
