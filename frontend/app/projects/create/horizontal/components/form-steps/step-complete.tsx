"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Dict } from "@/components/dict"

interface StepCompleteProps {
  formData: any
  onSubmit?: () => void
  isSubmitted?: boolean
}

export function StepComplete({ formData, onSubmit, isSubmitted }: StepCompleteProps) {
  const router = useRouter()
  const [localIsSubmitted, setLocalIsSubmitted] = useState(isSubmitted || false)

  const handleSubmit = () => {
    setLocalIsSubmitted(true)
    if (onSubmit) {
      onSubmit()
    }
  }

  useEffect(() => {
    if (isSubmitted !== undefined) {
      setLocalIsSubmitted(isSubmitted)
    }
  }, [isSubmitted])

  // 格式化预算金额为人民币格式
  const formatCurrency = (amount: string | number) => {
    if (!amount) return "¥ 0"
    const number = typeof amount === 'string' ? parseFloat(amount) : amount
    return `¥ ${number.toLocaleString()}`
  }

  if (localIsSubmitted) {
    return (
      <div className="w-full bg-white shadow-sm rounded-lg p-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        
        <h2 className="text-xl font-medium mb-3">提交成功</h2>
        
        <p className="text-gray-500 text-sm text-center mb-4 max-w-md">
          您的横向项目信息已经成功提交，我们将尽快处理您的申请。
        </p>
        
        <div className="w-full bg-gray-50 p-4 rounded-md mb-6 text-center max-w-md">
          <p className="text-gray-600 text-sm">已提交申请，敬请等待审核。</p>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            className="bg-blue-500 hover:bg-blue-600" 
            onClick={() => router.push("/projects")}
          >
            返回项目列表
          </Button>
          <Button variant="outline">
            继续创建项目
          </Button>
          <Button variant="outline">
            查看详情
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {/* 项目基本信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">项目基本信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目名称</p>
              <p className="font-medium">{formData.项目名称 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">所属单位</p>
              <p className="font-medium"><Dict dictCode="unit" displayType="text" value={formData.所属单位 || "未填写"}/></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目分类</p>
              <p className="font-medium"><Dict dictCode="project_type_yf" displayType="text" value={formData.项目分类 || "未填写"}/></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目级别</p>
              <p className="font-medium"><Dict dictCode="project_level" displayType="text" value={formData.项目级别 || "未填写"}/></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">批准号</p>
              <p className="font-medium">{formData.批准号 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">经费来源</p>
              <p className="font-medium">{formData.经费来源 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目状态</p>
              <p className="font-medium"><Dict dictCode="project_status" displayType="text" value={formData.项目状态 || "未填写"}/></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">项目周期</p>
              <p className="font-medium">
                {formData.开始日期 && formData.结束日期 
                  ? `${formData.开始日期} 至 ${formData.结束日期}` 
                  : "未填写"}
              </p>
            </div>
          </div>
        </div>
        
        {/* 负责人信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">负责人信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">负责人姓名</p>
              <p className="font-medium">{formData.项目负责人 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">职称</p>
              <p className="font-medium"><Dict dictCode="title" displayType="text" value={formData.职称 || "未填写"}/></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">联系电话</p>
              <p className="font-medium">{formData.联系电话 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">联系邮箱</p>
              <p className="font-medium">{formData.电子邮箱 || "未填写"}</p>
            </div>
          </div>
        </div>

        {/* 预算信息 - 表格形式 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">预算信息</h4>
          
          {/* 预算明细表格 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">类别</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">金额</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">说明</th>
                </tr>
              </thead>
              <tbody>
                {formData.budgets && formData.budgets.length > 0 ? (
                  formData.budgets.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-3 py-2 text-sm">{item.category || "未填写"}</td>
                      <td className="px-3 py-2 text-sm">{formatCurrency(item.amount)}</td>
                      <td className="px-3 py-2 text-sm">{item.description || "无"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-border">
                    <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground text-sm">
                      未设置预算明细
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-muted/30">
                  <td className="px-3 py-2 text-sm font-medium">总计</td>
                  <td className="px-3 py-2 text-sm font-medium">
                    {formatCurrency(
                      formData.budgets && formData.budgets.length > 0
                        ? formData.budgets.reduce((sum: number, item: any) => {
                            const amount = parseFloat(item.amount) || 0;
                            return sum + amount;
                          }, 0)
                        : formData.预算金额 || 0
                    )}
                  </td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 团队成员 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">团队成员</h4>

          {/* 团队成员表格 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">姓名</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">角色</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">职称</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">所属单位</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">联系电话</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-muted-foreground">电子邮箱</th>
                </tr>
              </thead>
              <tbody>
                {formData.团队成员 && formData.团队成员.length > 0 && formData.团队成员.some((member: any) => {
                  // 检查成员是否有效 - 处理字符串或对象
                  if (typeof member === 'string') {
                    return member.trim() !== "";
                  }
                  // 如果是对象，检查name属性
                  return member && member.name && typeof member.name === 'string' && member.name.trim() !== "";
                }) ? (
                  formData.团队成员
                    .filter((member: any) => {
                      // 过滤有效成员 - 处理字符串或对象
                      if (typeof member === 'string') {
                        return member.trim() !== "";
                      }
                      return member && member.name && typeof member.name === 'string' && member.name.trim() !== "";
                    })
                    .map((member: any, index: number) => {
                      // 处理成员数据 - 兼容字符串和对象
                      const memberName = typeof member === 'string' ? member : member.name;
                      const memberRole = typeof member === 'object' ? member.role || '' : '';
                      const memberTitle = typeof member === 'object' ? member.title || '' : '';
                      const memberUnit = typeof member === 'object' ? member.unit || '' : '';
                      const memberPhone = typeof member === 'object' ? member.phone || '' : '';
                      const memberEmail = typeof member === 'object' ? member.email || '' : '';
                      const isLeader = typeof member === 'object' ? member.isLeader === 1 : index === 0;

                      return (
                        <tr key={index} className="border-b border-border">
                          <td className="px-3 py-2 text-sm font-medium">
                            {memberName}
                            {isLeader && <span className="ml-2 text-xs text-blue-500 font-medium">(负责人)</span>}
                          </td>
                          <td className="px-3 py-2 text-sm">{memberRole || "未设置"}</td>
                          <td className="px-3 py-2 text-sm">{memberTitle || "未设置"}</td>
                          <td className="px-3 py-2 text-sm">{memberUnit || "未设置"}</td>
                          <td className="px-3 py-2 text-sm">{memberPhone || "未设置"}</td>
                          <td className="px-3 py-2 text-sm">{memberEmail || "未设置"}</td>
                        </tr>
                      );
                    })
                ) : (
                  <tr className="border-b border-border">
                    <td colSpan={6} className="px-3 py-4 text-center text-muted-foreground text-sm">
                      未添加团队成员
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 横向项目特有信息 */}
        <div className="bg-card rounded-lg p-5 space-y-4 shadow-sm border border-border/50">
          <h4 className="font-medium text-primary">合作信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">合作企业</p>
              <p className="font-medium">{formData.合作企业 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">合同编号</p>
              <p className="font-medium">{formData.合同编号 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">知识产权归属</p>
              <p className="font-medium">{formData.知识产权归属 || "未填写"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">保密等级</p>
              <p className="font-medium"><Dict dictCode="security_level" displayType="text" value={formData.保密等级 || "未填写"}/></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 