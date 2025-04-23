"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Check, Copy, Database, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AISidebarProps {
  mockAnalysisResult: Record<string, any>
  filledFields: string[]
  handleFillField: (field: string) => void
  handleFillAll: () => void
}

export const AISidebar = ({ mockAnalysisResult, filledFields, handleFillField, handleFillAll }: AISidebarProps) => {
  return (
    <div className="w-full lg:w-[350px] lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-80px)]">
      <Card className="border-muted/50 overflow-hidden h-full">
        <CardHeader className="pb-3 border-b border-muted/30">
          <CardTitle className="flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            AI分析结果
          </CardTitle>
          <CardDescription>AI已从您上传的文件中提取出以下信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
          <div className="p-4 rounded-lg border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-0" />

            <div className="flex justify-between items-center mb-3 relative">
              <h3 className="font-medium text-sm flex items-center">
                <Database className="h-3.5 w-3.5 mr-1.5 text-primary" />
                提取到的字段
              </h3>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {Object.keys(mockAnalysisResult).length}个字段
              </Badge>
            </div>

            <div className="space-y-3 relative">
              {Object.keys(mockAnalysisResult).map((field, index) => (
                <motion.div
                  className="flex justify-between items-center p-2 rounded-md hover:bg-primary/5 transition-colors"
                  key={field}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <div className="text-sm flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2"></div>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 text-xs transition-all",
                      filledFields.includes(field)
                        ? "text-green-500 hover:text-green-600 hover:bg-green-50"
                        : "text-primary hover:text-primary hover:bg-primary/10",
                    )}
                    onClick={() => handleFillField(field)}
                    disabled={filledFields.includes(field)}
                  >
                    {filledFields.includes(field) ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        已填充
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        填充
                      </>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group relative overflow-hidden"
            onClick={handleFillAll}
            disabled={filledFields.length === Object.keys(mockAnalysisResult).length}
          >
            <div
              className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] group-hover:animate-shimmer"
              style={{ transform: "translateX(-100%)" }}
            />
            <Zap className="mr-2 h-4 w-4" />
            {filledFields.length === Object.keys(mockAnalysisResult).length ? "已全部填充" : "一键填充所有字段"}
          </Button>

          <div className="text-sm text-muted-foreground mt-4 space-y-2 p-3 rounded-lg border border-muted/30">
            <p className="flex items-start">
              <Sparkles className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary" />
              AI已从您上传的文件中提取出关键信息
            </p>
            <p className="flex items-start">
              <Sparkles className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary" />
              您可以点击"填充"按钮将信息填入表单
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

