"use client"

import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, DollarSign, HomeIcon, User, Settings, Package, Download, ShieldIcon, Thermometer, Droplets, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import AnimalRoomAISummary from "./animal-room-ai-summary"

interface AnimalRoomOverviewTabProps {
  data: any
}

export default function AnimalRoomOverviewTab({ data }: AnimalRoomOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI智能分析 */}
      <AnimalRoomAISummary roomData={data} />

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
              <div className="text-xs text-gray-500">房间编号</div>
              <div className="text-sm font-medium">{data.roomId}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">房间名称</div>
              <div className="text-sm">{data.name}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">房间类型</div>
              <div className="flex items-center">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {data.type}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">房间状态</div>
              <div className="flex items-center">
                <Badge className={
                  data.status === "使用中" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.status === "维修中" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : data.status === "清洁中"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : data.status === "空闲"
                          ? "bg-slate-50 text-slate-700 border-slate-200"
                          : "bg-red-50 text-red-700 border-red-200"
                }>
                  {data.status}
                </Badge>
              </div>
            </div>
          </div>
          
          {data.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">房间描述</div>
                <p className="text-sm text-gray-700">{data.description}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 容量信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">容量信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">设计容量</div>
              <div className="text-sm">{data.capacity}只</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">当前入住</div>
              <div className="text-sm">{data.currentOccupancy}只</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">使用率</div>
              <div className="flex items-center gap-1 text-sm">
                <span className={
                  (data.currentOccupancy / data.capacity) >= 0.9
                    ? "text-red-600 font-medium"
                    : (data.currentOccupancy / data.capacity) >= 0.7
                      ? "text-amber-600 font-medium"
                      : "text-green-600 font-medium"
                }>
                  {((data.currentOccupancy / data.capacity) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">剩余容量</div>
              <div className="text-sm">{data.capacity - data.currentOccupancy}只</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 位置信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold">位置信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">所属部门</div>
              <div className="flex items-center gap-1 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{data.department}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">具体位置</div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{data.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 环境信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold">环境信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">温度</div>
              <div className="flex items-center gap-1 text-sm">
                <Thermometer className="h-4 w-4 text-gray-500" />
                <span>{data.temperature}°C</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">湿度</div>
              <div className="flex items-center gap-1 text-sm">
                <Droplets className="h-4 w-4 text-gray-500" />
                <span>{data.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 管理信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-semibold">管理信息</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">管理员</div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>{data.manager}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">建立日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{data.establishedDate}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">最后清洁日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.lastCleaningDate}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">最后维护日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Settings className="h-4 w-4 text-gray-500" />
                <span>{data.lastMaintenanceDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 设备信息 */}
      {data.equipments && data.equipments.length > 0 && (
        <Card className="border border-gray-100 rounded-md bg-white mb-6">
          <div className="p-4 pb-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-cyan-600" />
                <span className="text-lg font-semibold">设备信息</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.equipments.map((equipment: string, index: number) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-gray-50 text-gray-700 border-gray-200"
                >
                  {equipment}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 备注信息 */}
      {data.notes && (
        <Card className="border border-gray-100 rounded-md bg-white mb-6">
          <div className="p-4 pb-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-semibold">备注信息</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">{data.notes}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 