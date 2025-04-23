"use client"

import { InfoIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface StepAuthorInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorInfo({ formData, updateFormData, validationErrors }: StepAuthorInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    updateFormData(id, value)
  }

  const handleSwitchChange = (checked: boolean) => {
    updateFormData("rankingConfirmed", checked)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">获奖人信息</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstAuthor" className="text-sm font-medium flex items-center">
            第一获奖人 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="firstAuthor"
            placeholder="请输入第一获奖人姓名"
            value={formData.firstAuthor || ""}
            onChange={handleInputChange}
            className={cn(
              validationErrors["第一获奖人"] && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {validationErrors["第一获奖人"] && (
            <p className="text-sm text-destructive">请输入第一获奖人</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondAuthor" className="text-sm font-medium">
            第二获奖人
          </Label>
          <Input
            id="secondAuthor"
            placeholder="请输入第二获奖人姓名（如有）"
            value={formData.secondAuthor || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="otherAuthors" className="text-sm font-medium">
            其他获奖人
          </Label>
          <Input
            id="otherAuthors"
            placeholder="请输入其他获奖人姓名，多个用逗号分隔"
            value={formData.otherAuthors || ""}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">多个获奖人请用逗号分隔</p>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="contribution" className="text-sm font-medium flex items-center">
            本人贡献 <span className="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="contribution"
            placeholder="请描述本人在获奖成果中的贡献"
            className={cn(
              "min-h-[100px]",
              validationErrors["本人贡献"] && "border-destructive focus-visible:ring-destructive"
            )}
            value={formData.contribution || ""}
            onChange={handleInputChange}
          />
          {validationErrors["本人贡献"] && (
            <p className="text-sm text-destructive">请填写本人贡献</p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="rankingConfirmed" className="text-sm font-medium">
                排名确认
              </Label>
              <p className="text-xs text-muted-foreground">
                本人已确认获奖人员排名的真实性和准确性
              </p>
            </div>
            <Switch
              id="rankingConfirmed"
              checked={formData.rankingConfirmed}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 