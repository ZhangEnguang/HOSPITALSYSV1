"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Zap, CheckCircle2, Lightbulb } from "lucide-react"

interface AnalysisContentProps {
  analysisResult: Record<string, any>
  filledFields: string[]
  handleFillField: (field: string) => void
  handleFillAll: () => void
  fieldAnalysisResults: Record<string, { confidence: number; suggestion: string }>
  analysisProgress: number
  analysisComplete: boolean
}

export function AnalysisContent({
  analysisResult,
  filledFields,
  handleFillField,
  handleFillAll,
  fieldAnalysisResults,
  analysisProgress,
  analysisComplete,
}: AnalysisContentProps) {
  // 获取字段填充状态
  const getFieldStatus = (field: string) => {
    if (filledFields.includes(field)) {
      return "filled"
    }
    return "unfilled"
  }

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500"
    if (confidence >= 75) return "text-amber-500"
    return "text-red-500"
  }

  // 获取置信度标签
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return "高"
    if (confidence >= 75) return "中"
    return "低"
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 bg-muted/30">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-primary mr-1" />
            <span className="text-sm font-medium">智能分析结果</span>
          </div>
          <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20">
            {analysisComplete ? "分析完成" : "分析中..."}
          </Badge>
        </div>

        {!analysisComplete && <Progress value={analysisProgress} className="h-1 mb-2" />}

        <div className="text-xs text-muted-foreground">
          已识别 <span className="font-medium text-foreground">{Object.keys(analysisResult).length}</span> 个字段，
          已填充 <span className="font-medium text-foreground">{filledFields.length}</span> 个字段
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="mb-4">
              <Button
                onClick={handleFillAll}
                className="w-full bg-primary/90 hover:bg-primary"
                disabled={Object.keys(analysisResult).length === 0}
              >
                <Zap className="h-4 w-4 mr-2" />
                一键智能填充所有字段
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                识别字段
              </h4>

              <div className="space-y-3">
                {Object.entries(analysisResult).map(([field, value]) => {
                  const fieldStatus = getFieldStatus(field)
                  const fieldAnalysis = fieldAnalysisResults[field] || {
                    confidence: 85,
                    suggestion: "内容符合填写要求",
                  }

                  return (
                    <div key={field} className="border rounded-md p-3 bg-card">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">{field}</div>
                        <div className="flex items-center">
                          <span className={`text-xs ${getConfidenceColor(fieldAnalysis.confidence)}`}>
                            置信度: {getConfidenceLabel(fieldAnalysis.confidence)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2 break-all line-clamp-1">{String(value)}</div>

                      <div className="text-xs text-muted-foreground mb-2 flex items-start">
                        <Lightbulb className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{fieldAnalysis.suggestion}</span>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant={fieldStatus === "filled" ? "outline" : "default"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleFillField(field)}
                          disabled={fieldStatus === "filled"}
                        >
                          {fieldStatus === "filled" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              已填充
                            </>
                          ) : (
                            <>
                              <Zap className="h-3 w-3 mr-1" />
                              填充此字段
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

