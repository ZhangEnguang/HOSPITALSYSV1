"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Trash2 } from "lucide-react"

interface StepAttachmentProps {
  files: File[]
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (index: number) => void
}

export function StepAttachment({ files, handleFileChange, removeFile }: StepAttachmentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h3 className="text-base font-medium">附件上传</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              <span>上传附件</span>
            </div>
            <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
          </Label>
          <span className="text-sm text-muted-foreground">支持上传PDF、Word、Excel等文件</span>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>已上传附件</Label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-xs text-blue-600">{file.name.split(".").pop()?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
