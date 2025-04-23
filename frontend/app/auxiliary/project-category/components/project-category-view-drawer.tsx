"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface ProjectCategoryDetailProps {
  id: string
  categoryCode: string
  name: string
  code: string
  level: string
  projectCount?: number
  fundingStandard?: string
  accountingType?: string
  fundingForm?: string
  managementMethod?: string
  projectManagementMethod?: string
  undergradCardRequirement?: string
  masterCardRequirement?: string
  phdCardRequirement?: string
  description?: string
  status?: string
  enabled?: boolean
  createdAt?: string
}

interface ProjectCategoryViewDrawerProps {
  isOpen: boolean
  onClose: () => void
  category: ProjectCategoryDetailProps | null
}

export function ProjectCategoryViewDrawer({
  isOpen,
  onClose,
  category,
}: ProjectCategoryViewDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  // 控制抽屉显示/隐藏的动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 处理关闭抽屉
  const handleClose = () => {
    setIsVisible(false)
    // 动画结束后再关闭
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!category) return null

  // 字段定义
  const fieldGroups = [
    {
      title: "基本信息",
      fields: [
        { label: "项目分类编号", value: category.categoryCode },
        { label: "名称", value: category.name },
        { label: "编码", value: category.code },
        { label: "级别", value: category.level },
        { label: "项目数", value: category.projectCount },
        { label: "描述", value: category.description },
        { label: "状态", value: category.status },
        { label: "创建时间", value: category.createdAt },
      ],
    },
    {
      title: "预算与管理",
      fields: [
        { label: "预算标准", value: category.fundingStandard },
        { label: "账卡形式", value: category.accountingType },
        { label: "预算分方式", value: category.fundingForm },
        { label: "管理规程方案", value: category.managementMethod },
        { label: "项目管理方案", value: category.projectManagementMethod },
      ],
    },
    {
      title: "卡号规则",
      fields: [
        { label: "本科卡号规则", value: category.undergradCardRequirement },
        { label: "硕士卡号规则", value: category.masterCardRequirement },
        { label: "博士卡号规则", value: category.phdCardRequirement },
      ],
    },
  ]

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 抽屉内容 */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-2/3 bg-background shadow-lg overflow-hidden transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-semibold">查看项目分类</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>

          {/* 抽屉内容区域 - 使用滚动区域 */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {fieldGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <h3 className="text-lg font-medium">{group.title}</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {group.fields.map((field, fieldIndex) => (
                      field.value ? (
                        <div key={fieldIndex} className="space-y-1">
                          <p className="text-sm text-muted-foreground">{field.label}</p>
                          <p className="font-medium">{field.value}</p>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* 抽屉底部按钮 */}
          <div className="border-t p-4 flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              关闭
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 