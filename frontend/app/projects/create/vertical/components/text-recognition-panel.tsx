"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface TextRecognitionPanelProps {
  mockAnalysisResult?: Record<string, any>
  filledFields?: string[]
  handleFillField?: (field: string) => void
  isFillingAll?: boolean
  currentFillingIndex?: number
  isFillingField?: string | null
}

export const TextRecognitionPanel = ({
  mockAnalysisResult = {
    项目名称: "智慧校园管理系统",
    项目类型: "纵向项目",
    负责人: "张三",
    联系电话: "13800138000",
    项目简介: "本项目旨在开发一套基于人工智能的智慧校园管理系统，提升校园管理效率和服务质量。",
    开始日期: "2023-09-01",
    结束日期: "2024-08-31",
    预算金额: "50万元",
  },
  filledFields = [],
  handleFillField = () => {},
  isFillingAll = false,
  currentFillingIndex = -1,
  isFillingField = null,
}: TextRecognitionPanelProps) => {
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [fillingField, setFillingField] = useState<string | null>(null)

  // 处理填充单个字段
  const handleFill = (field: string) => {
    if (filledFields.includes(field) || isFillingAll) return

    setFillingField(field)

    // 模拟填充过程
    setTimeout(() => {
      handleFillField(field)
      setFillingField(null)

      toast({
        title: "字段已填充",
        description: `已成功填充"${field}"`,
        duration: 2000,
      })
    }, 800)
  }

  return (
    <div className="space-y-4 p-1">
      <div className="text-sm text-muted-foreground space-y-2 bg-muted/5 rounded-lg border border-muted/30 p-3">
        <div className="flex flex-col gap-2">
          <p>AI已从上传的文件中识别出以下信息，点击相应字段进行填充。</p>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 self-start">
            已识别 {Object.keys(mockAnalysisResult).length} 个字段
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(mockAnalysisResult).map(([field, value], index) => {
          const isFilled = filledFields.includes(field)
          const isCurrentFilling = isFillingAll && currentFillingIndex === index
          const isCurrentFillingField = fillingField === field

          return (
            <div
              key={field}
              className={cn(
                "p-3.5 rounded-lg border transition-all shadow-sm hover:shadow", // 增加内边距和阴影效果
                "bg-white", // 纯白色背景
                isFilled ? "border-primary/20" : "border-muted/30 hover:border-primary/20",
                isCurrentFilling && "border-primary border-dashed animate-pulse",
              )}
              onMouseEnter={() => setHoveredField(field)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex items-start justify-between gap-3">
                {" "}
                {/* 增加间距 */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  {" "}
                  {/* 使用flex-1和min-width确保内容有足够空间 */}
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium">{field}</h4>
                    {isFilled && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground break-words">{value}</p>{" "}
                  {/* 使用break-words防止文本溢出 */}
                </div>
                <Button
                  size="sm"
                  variant={isFilled ? "ghost" : "outline"} // 使用outline变体
                  className={cn(
                    "h-7 px-2 shrink-0", // 减小按钮高度，防止挤压
                    isFilled
                      ? "text-muted-foreground/70 hover:text-muted-foreground" // 弱化已填充按钮
                      : "text-primary border-primary/30 hover:bg-primary/5", // 未填充按钮使用主题色文字
                  )}
                  onClick={() => handleFill(field)}
                  disabled={isFilled || isFillingAll || isCurrentFillingField}
                >
                  {isCurrentFillingField ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin text-primary" />
                      <span className="text-xs">填充中</span>
                    </>
                  ) : isFilled ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      <span className="text-xs">已填充</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1 text-primary" />
                      <span className="text-xs">填充</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

