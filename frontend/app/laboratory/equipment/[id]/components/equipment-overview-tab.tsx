"use client"

import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, DollarSign, Wrench, User, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AISummary from "./ai-summary"
import { format } from "date-fns"

interface EquipmentOverviewTabProps {
  data: any
}

export default function EquipmentOverviewTab({ data }: EquipmentOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI摘要 */}
      <AISummary equipmentData={data} />
      
      {/* 仪器基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">仪器基本信息</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">型号</div>
              <div className="text-sm font-medium">{data.model}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">序列号</div>
              <div className="text-sm">{data.serialNumber}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">仪器类型</div>
              <div className="flex items-center">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {data.category}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="text-sm">{data.department}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">存放位置</div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{data.location}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">负责人</div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>{data.manager?.name || "未指定"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">购置日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(data.purchaseDate), "yyyy/MM/dd")}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">价格</div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>￥{data.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 仪器描述 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">仪器描述</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">功能描述</div>
              <p className="text-sm text-gray-700">{data.description}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 规格参数 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">规格参数</span>
          </div>
          {data.specifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">电源要求</div>
                <div className="text-sm">{data.specifications.powerSupply}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">尺寸</div>
                <div className="text-sm">{data.specifications.dimensions}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">重量</div>
                <div className="text-sm">{data.specifications.weight}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">工作温度</div>
                <div className="text-sm">{data.specifications.operatingTemperature}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">湿度要求</div>
                <div className="text-sm">{data.specifications.humidity}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">特殊要求</div>
                <div className="text-sm">{data.specifications.specialRequirements}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-muted-foreground text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>暂无规格参数信息</span>
            </div>
          )}
        </div>
      </Card>

      {/* 维护状态 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">维护状态</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">维护状态</div>
              <div className="flex items-center">
                <Badge className={
                  data.maintenanceStatus === "正常" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.maintenanceStatus === "待维护" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                }>
                  {data.maintenanceStatus}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">使用频率</div>
              <div className="text-sm">{data.useFrequency}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">上次维护</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.lastMaintenanceDate ? format(new Date(data.lastMaintenanceDate), "yyyy/MM/dd") : "未记录"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">下次维护</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.nextMaintenanceDate ? format(new Date(data.nextMaintenanceDate), "yyyy/MM/dd") : "未安排"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 仪器图片 */}
      {data.images && data.images.length > 0 && (
        <Card className="border border-gray-100 rounded-md bg-white mb-6">
          <div className="p-4 pb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">仪器图片</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${data.name} 图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 