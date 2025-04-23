"use client"

import { InfoIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function StepCompletion({ formData }: { formData: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
        <div className="text-green-500">
          <CheckIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">信息确认</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">基本信息</h4>
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-muted-foreground">奖励名称:</span>
                <p className="text-sm font-medium">{formData.awardName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">奖励级别:</span>
                <p className="text-sm font-medium">
                  <Badge variant="outline">
                    {formData.awardLevel === "national" ? "国家级" : 
                     formData.awardLevel === "provincial" ? "省部级" : 
                     formData.awardLevel === "municipal" ? "市级" : 
                     formData.awardLevel === "institutional" ? "校级" : formData.awardLevel}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">获奖日期:</span>
                <p className="text-sm font-medium">
                  {formData.awardDate ? formData.awardDate : "未指定"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">颁奖单位:</span>
                <p className="text-sm font-medium">{formData.awardingBody}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium">获奖人信息</h4>
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-muted-foreground">第一获奖人:</span>
                <p className="text-sm font-medium">{formData.firstAuthor}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">第二获奖人:</span>
                <p className="text-sm font-medium">{formData.secondAuthor || "无"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">其他获奖人:</span>
                <p className="text-sm font-medium">{formData.otherAuthors || "无"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">本人贡献:</span>
                <p className="text-sm font-medium">{formData.contribution}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">排名确认:</span>
                <p className="text-sm font-medium">
                  <Badge variant={formData.rankingConfirmed ? "default" : "secondary"}>
                    {formData.rankingConfirmed ? "已确认" : "未确认"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium">奖励信息</h4>
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-muted-foreground">奖励类别:</span>
                <p className="text-sm font-medium">{formData.awardCategory}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">奖励等级:</span>
                <p className="text-sm font-medium">{formData.awardRank}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">证书编号:</span>
                <p className="text-sm font-medium">{formData.certificateNumber}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">奖励描述:</span>
                <p className="text-sm font-medium">{formData.awardDescription}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium">上传文档</h4>
          <div className="bg-muted p-4 rounded-md">
            {formData.files && formData.files.length > 0 ? (
              <ul className="space-y-1">
                {formData.files.map((file: File, index: number) => (
                  <li key={index} className="text-sm">
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">未上传文档</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          请确认以上信息无误后，点击下方"更新成果获奖"按钮提交。
        </p>
      </div>
    </div>
  )
} 