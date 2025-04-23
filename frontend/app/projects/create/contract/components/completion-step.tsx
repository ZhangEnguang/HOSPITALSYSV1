"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { CheckCircle2, Info as InfoIcon, Stamp, Building2 } from "lucide-react"

interface CompletionStepProps {
  formData: {
    basicInfo: any
    sealInfo: any
    supplierInfo: any
  }
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const { basicInfo, sealInfo, supplierInfo } = formData

  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : "未设置"
  }

  // 合同类型的中文映射
  const contractTypeMap = {
    service: "服务合同",
    purchase: "采购合同",
    consulting: "咨询合同",
    construction: "建设合同",
    other: "其他类型",
  }

  // 用章类型的中文映射
  const sealTypeMap = {
    company: "公司公章",
    finance: "财务专用章",
    contract: "合同专用章",
    legal: "法人章",
    hr: "人事专用章",
  }

  // 供应商类型的中文映射
  const supplierTypeMap = {
    manufacturer: "生产厂商",
    distributor: "经销商",
    service: "服务提供商",
    agent: "代理商",
    other: "其他类型",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">信息确认</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">请确认合同信息</h2>
        <p className="text-muted-foreground text-center max-w-md">
          请仔细确认以下合同信息无误，确认后点击"提交"按钮完成合同创建
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-lg">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">项目名称</div>
              <div className="col-span-2">{basicInfo.projectName || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">合同类型</div>
              <div className="col-span-2">{contractTypeMap[basicInfo.contractType as keyof typeof contractTypeMap] || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">合同标题</div>
              <div className="col-span-2">{basicInfo.contractTitle || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">合同金额</div>
              <div className="col-span-2">{basicInfo.contractAmount ? `¥${basicInfo.contractAmount}` : "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">开始日期</div>
              <div className="col-span-2">{formatDate(basicInfo.startDate)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">结束日期</div>
              <div className="col-span-2">{formatDate(basicInfo.endDate)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">所属部门</div>
              <div className="col-span-2">{basicInfo.department || "未设置"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Stamp className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-lg">用章信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">用章类型</div>
              <div className="col-span-2">{sealTypeMap[sealInfo.sealType as keyof typeof sealTypeMap] || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">用章用途</div>
              <div className="col-span-2">{sealInfo.sealPurpose === "contract" ? "合同盖章" : sealInfo.sealPurpose || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">用章数量</div>
              <div className="col-span-2">{sealInfo.sealCount || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">申请人</div>
              <div className="col-span-2">{sealInfo.sealApplicant || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">申请日期</div>
              <div className="col-span-2">{formatDate(sealInfo.sealApplyDate)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">紧急程度</div>
              <div className="col-span-2">
                {sealInfo.urgentLevel === "high" ? "紧急" : 
                 sealInfo.urgentLevel === "normal" ? "普通" : 
                 sealInfo.urgentLevel === "low" ? "一般" : "未设置"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-lg">供方信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">供应商名称</div>
              <div className="col-span-2">{supplierInfo.supplierName || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">供应商类型</div>
              <div className="col-span-2">{supplierTypeMap[supplierInfo.supplierType as keyof typeof supplierTypeMap] || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">联系人</div>
              <div className="col-span-2">{supplierInfo.supplierContact || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">联系电话</div>
              <div className="col-span-2">{supplierInfo.supplierPhone || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">电子邮箱</div>
              <div className="col-span-2">{supplierInfo.supplierEmail || "未设置"}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">营业执照</div>
              <div className="col-span-2">{supplierInfo.businessLicense || "未上传"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 