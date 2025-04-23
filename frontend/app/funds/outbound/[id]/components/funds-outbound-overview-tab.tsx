"use client"

import { useState } from "react"
import { 
  Calendar, 
  FileText, 
  User, 
  CreditCard, 
  Building, 
  BanknoteIcon, 
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AnimatePresence, motion } from "framer-motion"
import AISummary from "./ai-summary"

interface FundsOutboundOverviewTabProps {
  data: any
}

export default function FundsOutboundOverviewTab({ data }: FundsOutboundOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 摘要 */}
      <AISummary data={data} />
      
      {/* 基本信息 */}
      <BasicInfo data={data} />
      
      {/* 外拨详情 */}
      <OutboundDetails data={data} />
    </div>
  )
}

// 基本信息组件
function BasicInfo({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">基本信息</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">申请人</p>
                    <p className="font-medium">{data.applicant.name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">申请日期</p>
                    <p className="font-medium">{data.date}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">金额</p>
                    <p className="font-medium">¥ {data.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">经费类别</p>
                    <p className="font-medium">{data.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// 外拨详情组件
function OutboundDetails({ data }: { data: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">外拨详情</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">接收单位</p>
                    <p className="font-medium">{data.recipient}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <BanknoteIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">开户银行</p>
                    <p className="font-medium">{data.recipientBank}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">账号</p>
                    <p className="font-medium">{data.recipientAccount}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">附件数量</p>
                    <p className="font-medium">{data.attachments || 0} 个附件</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="text-sm font-medium mb-3">外拨说明</h4>
                <p className="text-sm text-slate-600">{data.description || "无外拨说明"}</p>
              </div>
              
              {data.approver && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="text-sm font-medium mb-3">审批信息</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">审批人</p>
                          <p className="font-medium">{data.approver.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-slate-100 p-1.5 rounded-md text-slate-500">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">审批日期</p>
                          <p className="font-medium">{data.approveDate || "未审批"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
