"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Copy, RefreshCw } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface AISummaryProps {
  data: any
}

export default function AISummary({ data }: AISummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAnalysisUpdated, setIsAnalysisUpdated] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // 更新AI分析
  const updateAnalysis = () => {
    setIsUpdating(true)
    
    // 模拟API调用延迟
    setTimeout(() => {
      setIsAnalysisUpdated(true)
      setIsUpdating(false)
      toast({
        title: "AI分析已更新",
        description: "已根据最新数据更新AI分析结果",
      })
    }, 1500)
  }

  // 生成AI摘要内容
  const generateAISummary = (isUpdated: boolean) => {
    if (!data) return ""
    
    const baseContent = `该笔经费外拨总金额为${data.amount.toLocaleString()}元，用于${data.description}。接收单位为${data.recipient}，经费类别为${data.category}。该笔外拨经费${data.status === "已通过" ? "已审批通过" : data.status === "已退回" ? "已被退回" : "正在等待审批"}。`
    
    const updatedContent = isUpdated 
      ? `根据最新分析，该笔经费外拨符合项目预算规划，接收单位资质良好，无异常风险。建议按计划执行后续资金拨付，并做好经费使用跟踪。`
      : `初步分析显示，该笔经费外拨在预算范围内，但建议关注接收单位的资金使用情况，确保经费按计划用于项目相关活动。`
    
    return baseContent + " " + updatedContent
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <span className="bg-blue-100 text-blue-800 p-1 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
                <path d="M12 8v4l3 3"></path>
              </svg>
            </span>
            AI 摘要
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={updateAnalysis}
            disabled={isUpdating}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "更新中..." : "更新分析"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-700 leading-relaxed">
          {isCollapsed ? (
            <div className="line-clamp-2">
              {generateAISummary(isAnalysisUpdated)}
            </div>
          ) : (
            <div>{generateAISummary(isAnalysisUpdated)}</div>
          )}
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">主要风险点</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">中</Badge>
                      <span>接收单位资金使用监管不足</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">低</Badge>
                      <span>外拨经费超出预算计划</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">建议措施</h4>
                  <ul className="space-y-2 text-xs">
                    <li>1. 加强与接收单位的沟通，明确经费使用范围</li>
                    <li>2. 要求接收单位定期提交经费使用报告</li>
                    <li>3. 建立经费使用跟踪机制，确保资金合规使用</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-end items-center mt-2 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? "展开详情" : "收起详情"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 ml-2"
            onClick={() => {
              // 复制AI摘要内容
              navigator.clipboard.writeText(generateAISummary(isAnalysisUpdated))
              toast({
                title: "已复制到剪贴板",
                description: "AI摘要内容已复制",
              })
            }}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            复制摘要
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
