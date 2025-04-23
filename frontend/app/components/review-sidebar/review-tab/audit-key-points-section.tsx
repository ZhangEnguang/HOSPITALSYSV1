"use client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

// 审核要点列表
const auditKeyPoints = [
  { id: "1", text: "合同内容与项目负责人研究方向是否一致" },
  { id: "2", text: "合同签订是否有利于学科发展" },
  { id: "3", text: "与境外单位或个人合作是否真实" },
  { id: "4", text: "研究内容是否符合学校政策规定" },
  { id: "5", text: "经费预算是否合理" },
]

interface AuditKeyPointsSectionProps {
  isReviewCompleted: boolean
  selectedKeyPoints: string[]
  setSelectedKeyPoints: (points: string[]) => void
  isAllPointsDialogOpen: boolean
  setIsAllPointsDialogOpen: (isOpen: boolean) => void
  tempSelectedPoints: string[]
  setTempSelectedPoints: (points: string[]) => void
}

export function AuditKeyPointsSection({
  isReviewCompleted,
  selectedKeyPoints,
  setSelectedKeyPoints,
  isAllPointsDialogOpen,
  setIsAllPointsDialogOpen,
  tempSelectedPoints,
  setTempSelectedPoints,
}: AuditKeyPointsSectionProps) {
  // 处理审核要点选择
  const handleKeyPointChange = (pointId: string, checked: boolean) => {
    if (checked) {
      setSelectedKeyPoints([...selectedKeyPoints, pointId])
    } else {
      setSelectedKeyPoints(selectedKeyPoints.filter((id) => id !== pointId))
    }
  }

  // 处理临时审核要点选择
  const handleTempKeyPointChange = (pointId: string, checked: boolean) => {
    if (checked) {
      setTempSelectedPoints([...tempSelectedPoints, pointId])
    } else {
      setTempSelectedPoints(tempSelectedPoints.filter((id) => id !== pointId))
    }
  }

  // 确认审核要点选择
  const confirmKeyPointSelection = () => {
    setSelectedKeyPoints([...tempSelectedPoints])
    setIsAllPointsDialogOpen(false)
  }

  return (
    <div className="my-4 bg-white/80 backdrop-blur-md rounded-xl overflow-hidden border border-slate-100 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-800 flex items-center">
          <div className="w-1 h-4 bg-blue-500 mr-2 rounded-sm"></div>
          审核要点
        </h3>
      </div>

      <div className="p-4">
        {isReviewCompleted ? (
          // 审核完成状态：只显示已选中的审核要点，不显示开关
          selectedKeyPoints.length > 0 ? (
            <div className="space-y-3">
              {auditKeyPoints
                .filter((point) => selectedKeyPoints.includes(point.id))
                .map((point) => (
                  <div key={point.id} className="flex items-start py-2">
                    <span className="flex items-center justify-center min-w-[20px] h-5 bg-blue-50 text-blue-600 rounded mr-2 text-xs font-medium">
                      {point.id}
                    </span>
                    <span className="text-sm text-slate-700">{point.text}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-2 text-sm text-slate-500 italic">未选择审核要点</div>
          )
        ) : (
          // 审核进行中状态：显示所有审核要点和开关
          <>
            {auditKeyPoints.slice(0, 3).map((point, index) => (
              <div key={point.id}>
                <div className="flex items-center justify-between py-3">
                  <div className="text-sm text-slate-700 flex items-start">
                    <span className="flex items-center justify-center min-w-[20px] h-5 bg-blue-50 text-blue-600 rounded mr-2 text-xs font-medium">
                      {point.id}
                    </span>
                    <span>{point.text}</span>
                  </div>
                  <Switch
                    checked={selectedKeyPoints.includes(point.id)}
                    onCheckedChange={(checked) => handleKeyPointChange(point.id, checked)}
                    className="data-[state=checked]:bg-blue-500"
                    disabled={isReviewCompleted}
                  />
                </div>
                {index < 2 && <div className="h-px bg-slate-100 w-full"></div>}
              </div>
            ))}

            <Dialog open={isAllPointsDialogOpen} onOpenChange={setIsAllPointsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-3 text-blue-600 font-normal text-sm flex items-center justify-center w-full hover:bg-blue-50 rounded-lg h-10 border-blue-200 transition-all duration-300"
                  disabled={isReviewCompleted}
                >
                  全部要点 ({auditKeyPoints.length}){" "}
                  <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>审核要点</DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">
                    请选择需要审核的要点，您可以选择多个要点进行审核
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto p-1">
                  {auditKeyPoints.map((point) => (
                    <div
                      key={point.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    >
                      <div className="text-sm text-slate-700 flex items-start">
                        <span className="flex items-center justify-center min-w-[20px] h-5 bg-blue-50 text-blue-600 rounded mr-2 text-xs font-medium">
                          {point.id}
                        </span>
                        <span>{point.text}</span>
                      </div>
                      <Switch
                        checked={tempSelectedPoints.includes(point.id)}
                        onCheckedChange={(checked) => handleTempKeyPointChange(point.id, checked)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setIsAllPointsDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={confirmKeyPointSelection}>确定</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
