"use client"

import { Check, FileText, InfoIcon, CalendarIcon, User, BookOpen, Building, School, Download, Table, Clock, Calculator } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface CompletionPreviewStepProps {
  formData: Record<string, any>
}

export function CompletionPreviewStep({ formData }: CompletionPreviewStepProps) {
  // 格式化日期显示
  const formatDate = (dateString?: string) => {
    if (!dateString) return "未设置";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  // 获取当前申报书生成方式
  const formGenerationType = formData["申请书生成方式"] || "全流程在线生成";
  const isIntelligentGeneration = formGenerationType === "智能协同生成";
  const isOfflineTemplate = formGenerationType === "线下模板化";

  // 计算研究周期（月）
  const calculateResearchMonths = () => {
    if (!formData["研究开始日期"] || !formData["研究结束日期"]) return "未设置";
    try {
      const startDate = new Date(formData["研究开始日期"]);
      const endDate = new Date(formData["研究结束日期"]);
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      return `${months} 个月`;
    } catch (error) {
      return "计算错误";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">预览确认</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">申报信息已完善</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          您已完成所有必填信息，请核对信息无误后点击"提交申报"按钮
        </p>
        <Badge className="mb-2" variant={
          isIntelligentGeneration ? "outline" : 
          isOfflineTemplate ? "secondary" : "default"
        }>
          {formGenerationType}
        </Badge>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">基本信息</h3>

        </div>
        
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1.5 text-primary/70" />
                  项目名称
                </h4>
                <p className="font-medium text-base">{formData["项目名称"] || "未填写"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Table className="h-4 w-4 mr-1.5 text-primary/70" />
                  项目分类
                </h4>
                <p>{formData["项目分类"] || "未填写"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-primary/70" />
                  申请人
                </h4>
                <div className="flex items-center">
                  <p>{formData["申请人"] || "未填写"}</p>
                  {formData["性别"] && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {formData["性别"]}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Building className="h-4 w-4 mr-1.5 text-primary/70" />
                  所属单位
                </h4>
                <p>{formData["所属单位"] || "未填写"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5 text-primary/70" />
                  研究期限
                </h4>
                <div>
                  <p>{formatDate(formData["研究开始日期"])} 至 {formatDate(formData["研究结束日期"])}</p>
                  <p className="text-xs text-muted-foreground">研究周期: {calculateResearchMonths()}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Calculator className="h-4 w-4 mr-1.5 text-primary/70" />
                  申请经费
                </h4>
                <p className="font-medium">{formData["申请经费"] ? `${formData["申请经费"]} 万元` : "未填写"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <School className="h-4 w-4 mr-1.5 text-primary/70" />
                  一级学科
                </h4>
                <p>{formData["一级学科"] || "未填写"}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">关键词</h4>
                <p>{formData["关键词"] || "未填写"}</p>
              </div>
              {formData["预期成果"] && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">预期成果</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(formData["预期成果"]) && formData["预期成果"].map((outcome: string, idx: number) => (
                      <Badge key={idx} variant="outline">{outcome}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">项目摘要</h4>
                <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["项目摘要"] || "未填写"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">成员信息</h3>

        </div>
        
        <Card>
          <CardContent className="p-5">
            {formData["项目成员"] && Array.isArray(formData["项目成员"]) && formData["项目成员"].length > 0 ? (
              <div className="space-y-5">
                {formData["项目成员"].map((member: any, index: number) => (
                  <div key={index} className={`${index !== 0 ? "border-t pt-4" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Badge variant={index === 0 ? "default" : "secondary"} className="mr-2">
                          {index === 0 ? "负责人" : `成员 ${index}`}
                        </Badge>
                        <h4 className="font-medium">{member.name || "未填写姓名"}</h4>
                      </div>
                      {member.title && (
                        <Badge variant="outline">{member.title}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-0.5">部门</h4>
                        <p>{member.department || "未填写"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-0.5">工作职责</h4>
                        <p>{member.responsibilities || "未填写"}</p>
                      </div>
                      {member.email && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-0.5">邮箱</h4>
                          <p>{member.email}</p>
                        </div>
                      )}
                      {member.phone && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-0.5">电话</h4>
                          <p>{member.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">未添加团队成员</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">经费预算</h3>

        </div>
        
        <Card>
          <CardContent className="p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-muted-foreground">总预算</h4>
                <p className="font-medium text-base">{formData["总预算"] ? `${formData["总预算"]} 万元` : "未填写"}</p>
              </div>
              
              {formData["预算明细"] && Array.isArray(formData["预算明细"]) && formData["预算明细"].length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">预算明细</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-sm text-muted-foreground">
                        <th className="text-left py-2 font-medium">科目</th>
                        <th className="text-right py-2 font-medium">金额 (万元)</th>
                        <th className="text-right py-2 font-medium">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData["预算明细"].map((item: any, index: number) => {
                        const totalBudget = parseFloat(formData["总预算"] || "0");
                        const percentage = totalBudget > 0 
                          ? ((parseFloat(item.amount) / totalBudget) * 100).toFixed(1) 
                          : "0";
                        
                        return (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.amount}</td>
                            <td className="text-right py-2">
                              <div className="flex items-center justify-end">
                                <div className="w-16 h-2 bg-muted rounded-full mr-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{width: `${Math.min(parseFloat(percentage), 100)}%`}}
                                  ></div>
                                </div>
                                {percentage}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {formData["经费说明"] && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">经费说明</h4>
                  <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["经费说明"]}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 根据不同的申请书生成方式显示不同的内容 */}
        {!isOfflineTemplate && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">项目详情</h3>

            </div>
            
            <Card>
              <CardContent className="p-5">
                {isIntelligentGeneration ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">申报书生成方式</h4>
                      <Badge variant="outline" className="bg-blue-50">智能协同生成</Badge>
                    </div>
                    {formData["申报书正文"] && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">申报书正文</h4>
                        <div className="flex items-center p-3 border rounded-md bg-green-50/30">
                          <FileText className="h-5 w-5 mr-2 text-green-600" />
                          <div className="flex-1">
                            <p>{formData["申报书正文"].name || "申报书正文文件"}</p>
                            <p className="text-xs text-muted-foreground">
                              {formData["申报书正文"].size 
                                ? `${(formData["申报书正文"].size / (1024 * 1024)).toFixed(2)} MB` 
                                : "文件大小未知"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Download className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">申报书生成方式</h4>
                      <Badge variant="outline" className="bg-green-50">全流程在线生成</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">研究背景</h4>
                      <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["研究背景"] || "未填写"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">研究目标</h4>
                      <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["研究目标"] || "未填写"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">研究内容</h4>
                      <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["研究内容"] || "未填写"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">预期成果详情</h4>
                      <p className="whitespace-pre-line text-sm bg-muted/20 p-3 rounded-md">{formData["预期成果详情"] || "未填写"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {isOfflineTemplate && formData["附件"] && Array.isArray(formData["附件"]) && formData["附件"].length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">附件材料</h3>
            </div>
            
            <Card>
              <CardContent className="p-5">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">已上传文件</h4>
                  <div className="space-y-2">
                    {formData["附件"].map((file: File, index: number) => (
                      <div key={index} className="flex items-center p-3 border rounded-md">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <div className="flex-1">
                          <p>{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.type || "未知类型"} • 上传于 {formatDate(new Date().toISOString())}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 