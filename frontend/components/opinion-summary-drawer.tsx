"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface OpinionSummaryDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onSaveSummary: (projectId: string, summaryData: any) => void
}

export function OpinionSummaryDrawer({ isOpen, onClose, project, onSaveSummary }: OpinionSummaryDrawerProps) {
  const [summary, setSummary] = useState({
    strengths: "",
    weaknesses: "",
    suggestions: "",
    conclusion: "",
    score: "",
    decision: "通过",
  })

  const handleChange = (field: string, value: string) => {
    setSummary((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    onSaveSummary(project.id, summary)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>评审意见汇总</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{project?.name}</h3>
                <Badge variant="outline">{project?.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project?.description}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strengths">项目优势</Label>
                <Textarea
                  id="strengths"
                  placeholder="请输入项目优势..."
                  value={summary.strengths}
                  onChange={(e) => handleChange("strengths", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaknesses">项目不足</Label>
                <Textarea
                  id="weaknesses"
                  placeholder="请输入项目不足..."
                  value={summary.weaknesses}
                  onChange={(e) => handleChange("weaknesses", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">改进建议</Label>
                <Textarea
                  id="suggestions"
                  placeholder="请输入改进建议..."
                  value={summary.suggestions}
                  onChange={(e) => handleChange("suggestions", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conclusion">总体评价</Label>
                <Textarea
                  id="conclusion"
                  placeholder="请输入总体评价..."
                  value={summary.conclusion}
                  onChange={(e) => handleChange("conclusion", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">综合评分</Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="0-100"
                    value={summary.score}
                    onChange={(e) => handleChange("score", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decision">评审决定</Label>
                  <select
                    id="decision"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={summary.decision}
                    onChange={(e) => handleChange("decision", e.target.value)}
                  >
                    <option value="通过">通过</option>
                    <option value="修改后通过">修改后通过</option>
                    <option value="不通过">不通过</option>
                  </select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">专家评审意见</h4>
              <div className="space-y-4">
                {project?.reviewers?.map((reviewer: any) => (
                  <div key={reviewer.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{reviewer.name}</span>
                      </div>
                      <Badge
                        variant={reviewer.score >= 80 ? "success" : reviewer.score >= 60 ? "warning" : "destructive"}
                      >
                        {reviewer.score} 分
                      </Badge>
                    </div>
                    {reviewer.comments && <p className="text-xs text-muted-foreground">{reviewer.comments}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 border-t">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSubmit}>保存意见汇总</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

