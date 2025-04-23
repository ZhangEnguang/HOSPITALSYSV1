"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { XCircle, Loader2, Sparkles, Copy, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BatchRejectionDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedItems: any[]
  onConfirm: (comments: Record<number, string>) => void
}

export default function BatchRejectionDialog({ isOpen, onClose, selectedItems, onConfirm }: BatchRejectionDialogProps) {
  // 为每个选中的项目存储单独的审核意见
  const [itemComments, setItemComments] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatingItemId, setGeneratingItemId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string>("individual")
  const [commonComment, setCommonComment] = useState("")
  const [isGeneratingCommon, setIsGeneratingCommon] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)

  // 当选中项目变化时，默认选中第一个项目
  useEffect(() => {
    if (selectedItems.length > 0 && !selectedItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(selectedItems[0].id)
    }
  }, [selectedItems, selectedItemId])

  // 检查是否所有必填项都已填写
  const allItemsHaveComments = () => {
    return selectedItems.every(
      (item) => itemComments[item.id]?.trim() || (activeTab === "common" && commonComment.trim()),
    )
  }

  // 处理单个项目的意见变更
  const handleCommentChange = (id: number, comment: string) => {
    setItemComments((prev) => ({
      ...prev,
      [id]: comment,
    }))
  }

  // 为单个项目生成AI意见
  const generateAIComment = (id: number) => {
    setGeneratingItemId(id)
    // 模拟AI生成审核意见
    setTimeout(() => {
      const item = selectedItems.find((item) => item.id === id)
      let aiSuggestion = ""

      // 根据项目类型生成不同的审核意见
      if (item.type === "项目申请") {
        aiSuggestion = "项目申请材料不完整，缺少必要的预算明细和实施计划。请补充完整后重新提交。"
      } else if (item.type === "经费申请") {
        aiSuggestion = "经费申请金额超出规定限额，且部分支出项目缺乏合理性说明。请按照规定调整后重新提交。"
      } else if (item.type === "成果提交") {
        aiSuggestion = "成果内容与申请目标存在偏差，部分关键指标未达到预期。请修改完善后重新提交。"
      } else {
        aiSuggestion = "申请内容存在问题，未能满足审核标准。请根据相关规定修改后重新提交。"
      }

      setItemComments((prev) => ({
        ...prev,
        [id]: aiSuggestion,
      }))
      setGeneratingItemId(null)

      toast({
        title: "AI审核意见已生成",
        description: "您可以根据需要修改AI生成的审核意见",
        variant: "default",
      })
    }, 1000)
  }

  // 生成通用的AI审核意见
  const generateCommonAIComment = () => {
    setIsGeneratingCommon(true)
    // 模拟AI生成通用审核意见
    setTimeout(() => {
      const aiSuggestion =
        "经审核，提交的申请材料存在以下问题：1. 部分必要文件缺失或不完整；2. 数据填写与实际情况不符；3. 未按照最新规定格式提交。请修正上述问题后重新提交申请。"
      setCommonComment(aiSuggestion)
      setIsGeneratingCommon(false)

      toast({
        title: "通用AI审核意见已生成",
        description: "您可以��据需要修改AI生成的审核意见",
        variant: "default",
      })
    }, 1000)
  }

  // 应用通用意见到所有项目
  const applyCommonToAll = () => {
    const newComments = { ...itemComments }
    selectedItems.forEach((item) => {
      newComments[item.id] = commonComment
    })
    setItemComments(newComments)

    toast({
      title: "已应用到所有项目",
      description: `已将通用意见应用到全部 ${selectedItems.length} 个项目`,
      variant: "default",
    })
  }

  // 一键生成所有项目的AI意见
  const generateAllAIComments = () => {
    setIsGeneratingCommon(true)

    // 模拟为所有项目生成AI意见
    setTimeout(() => {
      const newComments = { ...itemComments }

      selectedItems.forEach((item) => {
        let aiSuggestion = ""

        // 根据项目类型生成不同的审核意见
        if (item.type === "项目申请") {
          aiSuggestion = "项目申请材料不完整，缺少必要的预算明细和实施计划。请补充完整后重新提交。"
        } else if (item.type === "经费申请") {
          aiSuggestion = "经费申请金额超出规定限额，且部分支出项目缺乏合理性说明。请按照规定调整后重新提交。"
        } else if (item.type === "成果提交") {
          aiSuggestion = "成果内容与申请目标存在偏差，部分关键指标未达到预期。请修改完善后重新提交。"
        } else {
          aiSuggestion = "申请内容存在问题，未能满足审核标准。请根据相关规定修改后重新提交。"
        }

        newComments[item.id] = aiSuggestion
      })

      setItemComments(newComments)
      setIsGeneratingCommon(false)

      toast({
        title: "所有AI审核意见已生成",
        description: `已为全部 ${selectedItems.length} 个项目生成审核意见`,
        variant: "default",
      })
    }, 1500)
  }

  const handleConfirm = () => {
    if (activeTab === "common" && !commonComment.trim()) {
      toast({
        title: "请填写通用审核意见",
        description: "退回操作需要填写审核意见",
        variant: "destructive",
      })
      return
    }

    if (!allItemsHaveComments()) {
      toast({
        title: "请填写所有项目的审核意见",
        description: "每个退回的项目都需要填写审核意见",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // 如果使用通用意见，将通用意见应用到所有项目
    const finalComments = { ...itemComments }
    if (activeTab === "common") {
      selectedItems.forEach((item) => {
        finalComments[item.id] = commonComment
      })
    }

    // 模拟提交过程
    setTimeout(() => {
      onConfirm(finalComments)
      setIsSubmitting(false)
      setItemComments({})
      setCommonComment("")

      toast({
        title: "批量退回成功",
        description: `已成功退回 ${selectedItems.length} 个待办事项`,
        variant: "default",
      })
    }, 1000)
  }

  // 检查项目是否有审核意见
  const hasComment = (id: number) => {
    return !!itemComments[id]?.trim() || (activeTab === "common" && !!commonComment.trim())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="p-6 pb-0">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              批量退回确认
            </DialogTitle>
            <DialogDescription>
              您正在批量退回 <span className="font-medium text-foreground">{selectedItems.length}</span> 个待办事项
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4 overflow-y-auto flex-grow">
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-red-50">
              <AlertDescription>退回操作必须为每个项目填写审核意见，说明退回原因</AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual">单独填写意见</TabsTrigger>
                <TabsTrigger value="common">使用通用意见</TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="mt-4">
                <div className="grid grid-cols-5 gap-6">
                  {/* 左侧项目列表 */}
                  <div className="col-span-2 flex flex-col">
                    <div className="border rounded-md overflow-hidden flex-grow">
                      <div className="bg-muted p-3 border-b">
                        <h4 className="text-sm font-medium">待退回项目 ({selectedItems.length})</h4>
                      </div>
                      <div className="h-[280px] overflow-y-auto">
                        <div className="divide-y">
                          {selectedItems.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedItemId === item.id ? "bg-muted/50" : ""}`}
                              onClick={() => setSelectedItemId(item.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.type} ·{" "}
                                    {item.priority === "high"
                                      ? "高优先级"
                                      : item.priority === "medium"
                                        ? "中优先级"
                                        : "低优先级"}
                                  </p>
                                </div>
                                {hasComment(item.id) && (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧审核意见 */}
                  <div className="col-span-3 flex flex-col">
                    {selectedItemId && (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium">
                              {selectedItems.find((item) => item.id === selectedItemId)?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedItems.find((item) => item.id === selectedItemId)?.type} ·
                              {selectedItems.find((item) => item.id === selectedItemId)?.priority === "high"
                                ? "高优先级"
                                : selectedItems.find((item) => item.id === selectedItemId)?.priority === "medium"
                                  ? "中优先级"
                                  : "低优先级"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateAIComment(selectedItemId)}
                            disabled={generatingItemId === selectedItemId}
                            className="h-8 gap-1"
                          >
                            {generatingItemId === selectedItemId ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                生成中
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                                AI生成意见
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2 mt-3 flex-grow">
                          <label htmlFor="item-comment" className="text-sm font-medium">
                            审核意见 <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Textarea
                              id="item-comment"
                              placeholder="请输入审核意见..."
                              value={itemComments[selectedItemId] || ""}
                              onChange={(e) => handleCommentChange(selectedItemId, e.target.value)}
                              className="min-h-[150px] resize-none pr-10 pb-10"
                              required
                            />
                            {itemComments[selectedItemId]?.trim() && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 absolute bottom-2 right-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(itemComments[selectedItemId])
                                  toast({
                                    title: "已复制到剪贴板",
                                    variant: "default",
                                  })
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-xs text-muted-foreground">
                            已完成 {Object.keys(itemComments).filter((id) => itemComments[Number(id)]?.trim()).length}/
                            {selectedItems.length} 个项目的审核意见
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="common" className="mt-4">
                <div className="grid grid-cols-5 gap-6">
                  {/* 左侧项目列表 */}
                  <div className="col-span-2 flex flex-col">
                    <div className="border rounded-md overflow-hidden flex-grow">
                      <div className="bg-muted p-3 border-b">
                        <h4 className="text-sm font-medium">待退回项目 ({selectedItems.length})</h4>
                      </div>
                      <div className="h-[280px] overflow-y-auto">
                        <div className="divide-y">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="p-3 hover:bg-muted/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.type} ·{" "}
                                    {item.priority === "high"
                                      ? "高优先级"
                                      : item.priority === "medium"
                                        ? "中优先级"
                                        : "低优先级"}
                                  </p>
                                </div>
                                {commonComment.trim() && (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧通用审核意见 */}
                  <div className="col-span-3 flex flex-col">
                    <div className="flex justify-between items-center">
                      <label htmlFor="common-comment" className="text-base font-medium">
                        通用审核意见 <span className="text-red-500">*</span>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateCommonAIComment}
                        disabled={isGeneratingCommon}
                        className="h-8 gap-1"
                      >
                        {isGeneratingCommon ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                            AI生成意见
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-3 flex-grow">
                      <div className="relative">
                        <Textarea
                          id="common-comment"
                          placeholder="请输入适用于所有项目的通用审核意见..."
                          value={commonComment}
                          onChange={(e) => setCommonComment(e.target.value)}
                          className="min-h-[150px] resize-none pr-10 pb-10"
                          required
                        />
                        {commonComment.trim() && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 absolute bottom-2 right-2"
                            onClick={() => {
                              navigator.clipboard.writeText(commonComment)
                              toast({
                                title: "已复制到剪贴板",
                                variant: "default",
                              })
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        此意见将应用于所有选中的项目。请确保意见内容适用于所有项目。
                      </p>
                      {commonComment && (
                        <Button variant="secondary" size="sm" onClick={applyCommonToAll} className="h-8 ml-2">
                          应用到所有项目
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30 flex justify-between items-center">
          <div>
            {activeTab === "individual" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={generateAllAIComments}
                disabled={isGeneratingCommon}
                className="h-9 gap-1"
              >
                {isGeneratingCommon ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                    一键生成所有AI意见
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={generateCommonAIComment}
                disabled={isGeneratingCommon}
                className="h-9 gap-1"
              >
                {isGeneratingCommon ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                    AI生成通用意见
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isSubmitting || (activeTab === "common" ? !commonComment.trim() : !allItemsHaveComments())}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>确认退回</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

