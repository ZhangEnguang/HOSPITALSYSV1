"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Check, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export enum UploadStatus {
  IDLE = 0,
  UPLOADING = 1,
  ANALYZING = 2,
  COMPLETED = 3,
  ERROR = 4,
}

interface FileUploaderProps {
  uploadStatus: UploadStatus
  fileName: string
  progress: number
  error: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onUploadClick: () => void
}

export const FileUploader = ({
  uploadStatus,
  fileName,
  progress,
  error,
  onFileChange,
  onCancel,
  onUploadClick,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Card className="mb-6 border-muted/50 overflow-hidden">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {uploadStatus === UploadStatus.IDLE && (
            <motion.div
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all relative overflow-hidden",
                isHovering
                  ? "border-primary bg-primary/5"
                  : "border-muted/70 hover:border-primary/50 hover:bg-muted/10",
              )}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative"
                  animate={{
                    boxShadow: isHovering
                      ? [
                          "0 0 0 0 rgba(33, 86, 255, 0)",
                          "0 0 0 10px rgba(33, 86, 255, 0.1)",
                          "0 0 0 15px rgba(33, 86, 255, 0)",
                        ]
                      : "0 0 0 0 rgba(33, 86, 255, 0)",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "loop",
                  }}
                >
                  <Upload
                    className={cn("h-8 w-8 transition-colors", isHovering ? "text-primary" : "text-muted-foreground")}
                  />
                </motion.div>
              </div>
              <div className="text-lg font-medium mb-1">点击上传文件或拖拽文件到此处</div>
              <div className="text-sm text-muted-foreground">支持 PDF、Word、TXT 等格式，文件大小不超过20MB</div>
            </motion.div>
          )}

          {(uploadStatus === UploadStatus.UPLOADING ||
            uploadStatus === UploadStatus.ANALYZING ||
            uploadStatus === UploadStatus.COMPLETED) && (
            <div className="space-y-4">
              {uploadStatus === UploadStatus.UPLOADING && (
                <motion.div
                  className="flex items-center p-5 border border-muted/50 rounded-lg bg-muted/5 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mr-4 relative">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted/20"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (progress / 100) * 264}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileName}</div>
                    <div className="text-sm text-primary">正在上传文件...</div>
                  </div>

                  <div className="ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCancel}
                      className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      取消
                    </Button>
                  </div>
                </motion.div>
              )}

              {(uploadStatus === UploadStatus.ANALYZING || uploadStatus === UploadStatus.COMPLETED) && (
                <motion.div
                  className="flex items-center p-6 border border-muted/50 rounded-lg bg-muted/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mr-4">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileName}</div>
                    {uploadStatus === UploadStatus.ANALYZING && (
                      <div className="text-sm text-muted-foreground">分析中...</div>
                    )}
                    {uploadStatus === UploadStatus.COMPLETED && <div className="text-sm text-green-600">分析完成</div>}
                  </div>

                  {uploadStatus === UploadStatus.COMPLETED && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="ml-2"
                    >
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {uploadStatus === UploadStatus.COMPLETED && (
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    <span>分析完成，正在准备结果...</span>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {uploadStatus === UploadStatus.ERROR && (
            <motion.div
              className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error || "文件上传失败，请重试"}</span>
            </motion.div>
          )}

          {uploadStatus === UploadStatus.IDLE && (
            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                <Button
                  onClick={onUploadClick}
                  className="w-full max-w-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  选择文件
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

