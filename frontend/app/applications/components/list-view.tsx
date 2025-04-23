import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, Play, Edit, Trash, CheckCircle, Eye, MoreHorizontal, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ListViewProps {
  items: any[]
  batchProjects: Record<string, any[]>
  expandedBatches: Record<string, boolean>
  selectedRows: string[]
  activeTab: "application" | "review"
  onToggleBatchExpand: (batchId: string, e?: React.MouseEvent) => void
  onSelectRow: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onStartStop: (item: any) => void
  onEdit: (item: any) => void
  onDelete: (item: any) => void
  onReview: (item: any) => void
  onAssignExperts: (item: any) => void
  onOpinionSummary: (item: any) => void
  onView: (item: any) => void
  onEditProject: (item: any) => void
  onDeleteProject: (item: any) => void
}

export const ListView = ({
  items,
  batchProjects,
  expandedBatches,
  selectedRows,
  activeTab,
  onToggleBatchExpand,
  onSelectRow,
  onSelectAll,
  onStartStop,
  onEdit,
  onDelete,
  onReview,
  onAssignExperts,
  onOpinionSummary,
  onView,
  onEditProject,
  onDeleteProject
}: ListViewProps) => {
  const router = useRouter()

  const handleProjectCountClick = (item: any) => {
    if (item.batch === "评审批次") {
      router.push(`/applications/review-projects?batch=${item.batchNumber}`)
    } else {
      router.push(`/applications/projects?batch=${item.batchNumber}`)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedRows.length === items.length && items.length > 0}
                    onCheckedChange={onSelectAll}
                    aria-label="全选"
                  />
                </TableHead>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-medium">{activeTab === "review" ? "评审批次名称" : "申报批次名称"}</TableHead>
                <TableHead className="font-medium">{activeTab === "review" ? "评审类型" : "申报类型"}</TableHead>
                <TableHead className="font-medium">{activeTab === "review" ? "评审类别" : "申报类别"}</TableHead>
                <TableHead className="font-medium">{activeTab === "review" ? "评审状态" : "申报状态"}</TableHead>
                <TableHead className="font-medium">
                  {activeTab === "review" ? "评审总金额（万元）" : "申报总金额（万元）"}
                </TableHead>
                <TableHead className="font-medium">进度</TableHead>
                <TableHead className="font-medium">申报日期</TableHead>
                <TableHead className="font-medium">截止日期</TableHead>
                <TableHead className="font-medium">{activeTab === "review" ? "评审数量" : "申报数量"}</TableHead>
                <TableHead className="text-right font-medium">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((batch) => (
                <React.Fragment key={batch.id}>
                  {/* 批次行 */}
                  <TableRow
                    className={`border-b-0 hover:bg-blue-50/50 ${expandedBatches[batch.id] ? "bg-blue-50/80" : "bg-blue-50/30"}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(batch.id)}
                        onCheckedChange={(checked) => onSelectRow(batch.id, checked as boolean)}
                        aria-label={`选择批次 ${batch.id}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="p-0 pl-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => onToggleBatchExpand(batch.id, e)}
                      >
                        {expandedBatches[batch.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{batch.name}</span>
                        <span className="text-sm text-muted-foreground line-clamp-1">{batch.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>{batch.type}</TableCell>
                    <TableCell>{batch.category}</TableCell>
                    <TableCell>
                      {(() => {
                        const now = new Date()
                        const startDate = new Date(batch.date)
                        const endDate = new Date(batch.deadline)

                        let status = "未开始"
                        if (now > endDate) {
                          status = "已结束"
                        } else if (now >= startDate) {
                          status = "进行中"
                        }

                        return (
                          <Badge
                            variant={status === "未开始" ? "warning" : status === "进行中" ? "success" : "secondary"}
                          >
                            {status}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    <TableCell>{batch.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                      </div>
                    </TableCell>
                    <TableCell>{batch.date}</TableCell>
                    <TableCell>{batch.deadline}</TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProjectCountClick(batch)
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        {batch.projectCount || 0}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onStartStop(batch)}>
                            <Play className="mr-2 h-4 w-4" />
                            <span>
                              {(() => {
                                const now = new Date()
                                const startDate = new Date(batch.date)
                                const endDate = new Date(batch.deadline)

                                let status = "未开始"
                                if (now > endDate) {
                                  status = "已结束"
                                } else if (now >= startDate) {
                                  status = "进行中"
                                }

                                return status === "未开始" ? "启动" : status === "进行中" ? "停止" : "已结束"
                              })()}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/applications/forms/create?batchId=${batch.id}`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>新建申报书</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(batch)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>编辑</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(batch)} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>删除</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* 子项目表头和行 */}
                  {expandedBatches[batch.id] && batchProjects[batch.id] && batchProjects[batch.id].length > 0 && (
                    <>
                      {/* 子项目表头 */}
                      <TableRow className="bg-muted/20 border-y border-muted">
                        <TableCell colSpan={2} className="w-[80px]"></TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground">项目名称</TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground">项目类别</TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground">项目负责人</TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground"></TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground">申报金额(万元)</TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground"></TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground"></TableCell>
                        <TableCell className="py-2 font-medium text-sm text-muted-foreground"></TableCell>
                        {batch.batch === "评审批次" ? (
                          <TableCell className="py-2 font-medium text-sm text-muted-foreground">专家数量</TableCell>
                        ) : (
                          <TableCell className="py-2 font-medium text-sm text-muted-foreground">审核状态</TableCell>
                        )}
                        <TableCell className="py-2 text-right font-medium text-sm text-muted-foreground">操作</TableCell>
                      </TableRow>

                      {/* 子项目行 */}
                      {batchProjects[batch.id].map((project, index) => (
                        <TableRow
                          key={project.id}
                          className={`hover:bg-muted/10 ${index === batchProjects[batch.id].length - 1 ? "border-b" : "border-b border-dashed"}`}
                        >
                          <TableCell colSpan={2}></TableCell>
                          <TableCell>
                            <div className="flex flex-col pl-4 border-l-2 border-muted">
                              <span className="font-medium">{project.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{project.manager?.name || "-"}</span>
                              <span className="text-xs text-muted-foreground">
                                {project.manager?.department || ""} {project.manager?.title || ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>{project.amount.toFixed(2)}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            {batch.batch === "评审批次" ? (
                              <span className="text-primary font-medium">{project.expertCount || 0} 位专家</span>
                            ) : (
                              <Badge variant="secondary">{project.status}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              {batch.batch === "申报批次" ? (
                                <Button size="sm" variant="ghost" onClick={() => onReview(project)}>
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  审核
                                </Button>
                              ) : (
                                <>
                                  <Button size="sm" variant="ghost" onClick={() => onAssignExperts(project)}>
                                    <Users className="h-3.5 w-3.5 mr-1" />
                                    分派专家
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => onOpinionSummary(project)}>
                                    <FileText className="h-3.5 w-3.5 mr-1" />
                                    意见汇总
                                  </Button>
                                </>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onView(project)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>查看</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onEditProject(project)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>编辑</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDeleteProject(project)} className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>删除</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 