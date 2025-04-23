"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, FileText, User, Building, Calendar, InfoIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface StepCompleteProps {
  formData: any
}

// 定义预算分配项的类型
interface BudgetAllocation {
  cardHolderId: string
  cardHolder: string
  department: string
  budgetNumber: string
  schoolFunding: string
  externalFunding: string
  receivedAmount: string
  originalBudget: string
}

// 定义费用类型
interface FeeItem {
  current: string
  total: string
}

// 定义管理费项的类型
interface ManagementFee {
  performanceFee?: FeeItem
  bonusFee?: FeeItem
  institutionFee?: FeeItem
}

// 定义管理费映射类型
interface ManagementFeeMap {
  [cardHolderId: string]: ManagementFee
}

export function StepComplete({ formData }: StepCompleteProps) {
  // 解析预算分配信息
  const parseBudgetAllocations = (): BudgetAllocation[] => {
    try {
      if (formData.budgetAllocation && typeof formData.budgetAllocation === 'string') {
        return JSON.parse(formData.budgetAllocation);
      }
    } catch (e) {
      console.error("解析预算分配数据出错", e);
    }
    return [];
  };

  // 解析管理费信息
  const parseManagementFees = (): ManagementFeeMap => {
    try {
      if (formData.managementFees && typeof formData.managementFees === 'string') {
        return JSON.parse(formData.managementFees);
      }
    } catch (e) {
      console.error("解析管理费数据出错", e);
    }
    return {};
  };

  const budgetAllocations = parseBudgetAllocations();
  const managementFees = parseManagementFees();

  // 计算总额
  const calculateTotals = () => {
    let schoolFundingTotal = 0;
    let externalFundingTotal = 0;
    let receivedAmountTotal = 0;
    let originalBudgetTotal = 0;

    budgetAllocations.forEach((item: BudgetAllocation) => {
      schoolFundingTotal += parseFloat(item.schoolFunding) || 0;
      externalFundingTotal += parseFloat(item.externalFunding) || 0;
      receivedAmountTotal += parseFloat(item.receivedAmount) || 0;
      originalBudgetTotal += parseFloat(item.originalBudget) || 0;
    });

    return {
      schoolFundingTotal: schoolFundingTotal.toFixed(1),
      externalFundingTotal: externalFundingTotal.toFixed(1),
      receivedAmountTotal: receivedAmountTotal.toFixed(1),
      originalBudgetTotal: originalBudgetTotal.toFixed(1)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-6">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h2 className="text-base font-medium">确认信息</h2>
      </div>
      
      <div className="space-y-6">
        {/* 银行来款信息部分 */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-medium">银行来款信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-sm text-muted-foreground">来款名称：</span>
                <span className="text-sm font-medium">{formData.incomeName || '未填写'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">入账日期：</span>
                <span className="text-sm font-medium">
                  {formData.incomeDate || '未选择'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">来款金额：</span>
                <span className="text-sm font-medium">
                  {formData.amount ? `¥${parseInt(formData.amount).toLocaleString()}` : '未填写'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">银行账号：</span>
                <span className="text-sm font-medium">{formData.bankAccount || '未填写'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">对冲号：</span>
                <span className="text-sm font-medium">{formData.reference || '未填写'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">银行备注：</span>
                <span className="text-sm font-medium">{formData.bankRemark || '未填写'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 经费认领基本信息 */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2 mb-2">
              <CircleDollarSign className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-medium">经费认领基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-sm text-muted-foreground">关联项目：</span>
                <span className="text-sm font-medium">
                  {formData.projectName || formData.projectId || '未选择'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">认领金额：</span>
                <span className="text-sm font-medium">
                  {formData.claimAmount ? `${formData.claimAmount} 万元` : '未填写'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">来款类型：</span>
                <span className="text-sm font-medium">
                  {formData.fundSource === 'directFund' ? '直接经费' : 
                   formData.fundSource === 'indirectFund' ? '间接经费' : 
                   formData.fundSource === 'activityFund' ? '活动经费' : '未选择'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">是否有外拨：</span>
                <span className="text-sm font-medium">
                  {formData.hasExternalFunding === 'yes' ? '是' : 
                   formData.hasExternalFunding === 'no' ? '否' : '未选择'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">是否需要建新卡：</span>
                <span className="text-sm font-medium">
                  {formData.needBankCard === 'yes' ? '是' : 
                   formData.needBankCard === 'no' ? '否' : '未选择'}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">经办人：</span>
                <span className="text-sm font-medium">{formData.claimer || '未填写'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">经办人手机号：</span>
                <span className="text-sm font-medium">{formData.claimerPhone || '未填写'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">管理费提取方案：</span>
                <span className="text-sm font-medium">{formData.managementFeeMethod || '未选择'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 额度拆分信息 */}
        {budgetAllocations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">额度拆分信息</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">经费卡负责人</th>
                    <th className="px-4 py-2 text-left">所属单位</th>
                    <th className="px-4 py-2 text-left">经费卡号</th>
                    <th className="px-4 py-2 text-right">留校金额(万元)</th>
                    <th className="px-4 py-2 text-right">外拨金额(万元)</th>
                    <th className="px-4 py-2 text-right">已到账金额(万元)</th>
                    <th className="px-4 py-2 text-right">原校预算(万元)</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetAllocations.map((allocation: BudgetAllocation, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{allocation.cardHolder || '未填写'}</td>
                      <td className="px-4 py-2">{allocation.department || '未填写'}</td>
                      <td className="px-4 py-2">{allocation.budgetNumber || '未填写'}</td>
                      <td className="px-4 py-2 text-right">{allocation.schoolFunding || '0.0'}</td>
                      <td className="px-4 py-2 text-right">{allocation.externalFunding || '0.0'}</td>
                      <td className="px-4 py-2 text-right">{allocation.receivedAmount || '0.0'}</td>
                      <td className="px-4 py-2 text-right">{allocation.originalBudget || '0.0'}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 font-medium">
                    <td colSpan={3} className="px-4 py-2 text-right">合计:</td>
                    <td className="px-4 py-2 text-right">{totals.schoolFundingTotal}</td>
                    <td className="px-4 py-2 text-right">{totals.externalFundingTotal}</td>
                    <td className="px-4 py-2 text-right">{totals.receivedAmountTotal}</td>
                    <td className="px-4 py-2 text-right">{totals.originalBudgetTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 管理费信息 */}
        {Object.keys(managementFees).length > 0 && (
          <div>
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
              <div className="text-blue-500">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">管理费信息</h3>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {Object.entries(managementFees).map(([cardHolderId, feeData], index) => {
                const cardHolder = budgetAllocations.find((item: BudgetAllocation) => item.cardHolderId === cardHolderId);
                if (!cardHolder) return null;
                
                const totalCurrent = 
                  parseFloat((feeData as ManagementFee).performanceFee?.current || "0") + 
                  parseFloat((feeData as ManagementFee).bonusFee?.current || "0") + 
                  parseFloat((feeData as ManagementFee).institutionFee?.current || "0");
                
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-4 py-2 hover:bg-muted/20">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{cardHolder.cardHolder}</span>
                        </div>
                        <Badge variant="outline" className="ml-auto mr-4">
                          本次扣除: {totalCurrent.toFixed(1)} 万元
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">绩效</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">累计:</span>
                            <span className="text-sm">{feeData.performanceFee?.total || "0"} 万元</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">本次:</span>
                            <span className="text-sm">{feeData.performanceFee?.current || "0"} 万元</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">奖金</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">累计:</span>
                            <span className="text-sm">{feeData.bonusFee?.total || "0"} 万元</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">本次:</span>
                            <span className="text-sm">{feeData.bonusFee?.current || "0"} 万元</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">院管理费</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">累计:</span>
                            <span className="text-sm">{feeData.institutionFee?.total || "0"} 万元</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-muted-foreground">本次:</span>
                            <span className="text-sm">{feeData.institutionFee?.current || "0"} 万元</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}

        {/* 认领说明 */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2 mb-2">
              <InfoIcon className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-medium">认领说明</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/20 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{formData.claimRemark || '未填写'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
