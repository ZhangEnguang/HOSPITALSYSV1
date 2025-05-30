"use client"

import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, DollarSign, TestTube, User, Settings, Package, Download, ShieldIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import ConsumableAISummary from "./consumable-ai-summary"

interface ConsumableOverviewTabProps {
  data: any
}

export default function ConsumableOverviewTab({ data }: ConsumableOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI智能分析 */}
      <ConsumableAISummary consumableData={data} />

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
              <div className="text-xs text-gray-500">耗材名称</div>
              <div className="text-sm font-medium">{data.name}</div>
            </div>
            
            {data.alias && data.alias.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">别名</div>
                <div className="text-sm">{data.alias.join(", ")}</div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">耗材类型</div>
              <div className="flex items-center">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {data.category}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">型号规格</div>
              <div className="text-sm">{data.model}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">目录号</div>
              <div className="text-sm">{data.catalogNumber}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">单位</div>
              <div className="text-sm">{data.unit}</div>
            </div>
          </div>
          
          {data.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">耗材描述</div>
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
              <div className="text-xs text-gray-500">有效期</div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">有效期:</span>
                <span>{data.expiryDate}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="flex items-center gap-1 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{data.department}</span>
              </div>
            </div>
            
            {data.unitPrice && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">单价</div>
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>￥{data.unitPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            {data.totalValue && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">总价值</div>
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>￥{data.totalValue.toLocaleString()}</span>
                </div>
              </div>
            )}
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
              <div className="text-xs text-gray-500">库存状态</div>
              <div className="flex items-center">
                <Badge className={
                  data.status === "充足" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.status === "低库存" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : data.status === "缺货"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                }>
                  {data.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">当前库存</div>
              <div className="text-sm">{data.currentStock}{data.unit}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">最小库存</div>
              <div className="text-sm">{data.minStock}{data.unit}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">最大库存</div>
              <div className="text-sm">{data.maxStock}{data.unit}</div>
            </div>
            
            {data.lastUsedDate && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">最后使用日期</div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{data.lastUsedDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 管理信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
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
            
            {data.notes && (
              <div className="space-y-1 md:col-span-2">
                <div className="text-xs text-gray-500">备注信息</div>
                <p className="text-sm text-gray-700">{data.notes}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
} 