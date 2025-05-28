"use client"

import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, DollarSign, Beaker, User, Settings, Package, Download, ShieldIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import ReagentAISummary from "./reagent-ai-summary"

interface ReagentOverviewTabProps {
  data: any
}

export default function ReagentOverviewTab({ data }: ReagentOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI智能分析 */}
      <ReagentAISummary reagentData={data} />

      {/* 基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">基本信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">试剂名称</div>
              <div className="text-sm font-medium">{data.name}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">英文名称</div>
              <div className="text-sm">{data.englishName}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">试剂类型</div>
              <div className="flex items-center">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {data.category}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">规格</div>
              <div className="text-sm">{data.specification}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">CAS号</div>
              <div className="text-sm">{data.casNumber || "-"}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">目录号</div>
              <div className="text-sm">{data.catalogNumber}</div>
            </div>
          </div>
          
          {data.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">试剂描述</div>
                <p className="text-sm text-gray-700">{data.description}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 供应信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold">供应信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">生产厂商</div>
              <div className="text-sm">{data.manufacturer}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">供应商</div>
              <div className="text-sm">{data.supplier}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">购置日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(data.purchaseDate), "yyyy/MM/dd")}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">有效期至</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className={
                  new Date(data.expiryDate) < new Date() 
                    ? "text-red-600" 
                    : Math.ceil((new Date(data.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30
                      ? "text-amber-600"
                      : "text-gray-900"
                }>
                  {format(new Date(data.expiryDate), "yyyy/MM/dd")}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">价格</div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>￥{data.price.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="flex items-center gap-1 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{data.department}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 存储信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">存储信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">存放位置</div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{data.location}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">存储条件</div>
              <div className="text-sm">{data.storageCondition}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">危险等级</div>
              <div className="flex items-center">
                <Badge 
                  variant="outline" 
                  className={
                    data.dangerLevel === "高" 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : data.dangerLevel === "中"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {data.dangerLevel}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">库存状态</div>
              <div className="flex items-center">
                <Badge className={
                  data.status === "正常" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.status === "低库存" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : data.status === "已用完"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                }>
                  {data.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">初始数量</div>
              <div className="text-sm">{data.initialAmount}{data.unit}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">当前库存</div>
              <div className="flex items-center gap-1 text-sm">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{data.currentAmount}{data.unit}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">库存百分比</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      (data.currentAmount / data.initialAmount) * 100 <= 20 
                        ? "bg-red-500" 
                        : (data.currentAmount / data.initialAmount) * 100 <= 50 
                          ? "bg-amber-500" 
                          : "bg-green-500"
                    }`}
                    style={{ width: `${(data.currentAmount / data.initialAmount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {((data.currentAmount / data.initialAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">开封日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.openDate ? format(new Date(data.openDate), "yyyy/MM/dd") : "未开封"}</span>
              </div>
            </div>
          </div>
          
          {data.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">注意事项</div>
                <div className="flex items-start rounded-lg bg-amber-50 p-4 border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 leading-relaxed">{data.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 管理信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold">管理信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">负责人</div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>{data.manager?.name || "未指定"}</span>
              </div>
            </div>
          </div>
          
          {/* 相关文档 */}
          {data.msdsUrl && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="text-xs text-gray-500">相关文档</div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => window.open(data.msdsUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载 MSDS 安全数据表
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 