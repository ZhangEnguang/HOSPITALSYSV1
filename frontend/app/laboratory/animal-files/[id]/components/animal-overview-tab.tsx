"use client"

import { Calendar, Clock, FileText, AlertCircle, Tag, Building, MapPin, DollarSign, Wrench, User, Settings, Heart, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

interface AnimalOverviewTabProps {
  data: any
}

export default function AnimalOverviewTab({ data }: AnimalOverviewTabProps) {
  // 获取动物图标
  const getAnimalIcon = (species: string) => {
    const icons: Record<string, string> = {
      "小鼠": "🐭",
      "大鼠": "🐀", 
      "兔": "🐰",
      "豚鼠": "🐹",
      "猴": "🐒",
      "犬": "🐕"
    };
    return icons[species] || "🐾";
  };

  return (
    <div className="space-y-6">
      {/* 动物基本信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">动物基本信息</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">动物编号</div>
              <div className="text-sm font-medium">{data.animalId}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">动物种类</div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getAnimalIcon(data.species)}</span>
                <span className="text-sm">{data.species}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">品系</div>
              <div className="text-sm">{data.strain}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">性别</div>
              <div className="text-sm">{data.gender}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">年龄</div>
              <div className="text-sm">{data.age}周</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">体重</div>
              <div className="text-sm">{data.weight}g</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">出生日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{data.birthDate ? format(new Date(data.birthDate), "yyyy/MM/dd") : "未记录"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">入档日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(data.entryDate), "yyyy/MM/dd")}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 动物描述 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">动物描述</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">基本描述</div>
              <p className="text-sm text-gray-700">{data.description || "暂无描述信息"}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">遗传背景</div>
                <div className="text-sm">{data.geneticBackground || "野生型"}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-500">来源信息</div>
                <div className="text-sm">{data.sourceInfo || "北京维通利华, SPF级"}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 健康状态 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">健康状态</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">当前状态</div>
              <div className="flex items-center">
                <Badge className={
                  data.status === "健康" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : data.status === "观察中" 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : data.status === "治疗中"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : data.status === "隔离"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : data.status === "死亡"
                            ? "bg-gray-50 text-gray-700 border-gray-200"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                }>
                  {data.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">最后检查日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{data.lastCheckDate ? format(new Date(data.lastCheckDate), "yyyy/MM/dd") : "未记录"}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">疫苗接种</div>
              <div className="text-sm">{data.vaccinations || "已接种常规疫苗"}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">健康评分</div>
              <div className="text-sm">{data.healthScore || "良好"}</div>
            </div>
          </div>
          
          {data.healthNotes && (
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">健康备注</div>
              <p className="text-sm text-gray-700">{data.healthNotes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* 管理信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">管理信息</span>
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
              <div className="text-xs text-gray-500">饲养位置</div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{data.location}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">责任人</div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>{data.responsible}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">使用目的</div>
              <div className="text-sm">{data.purpose || "基础研究"}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">项目关联</div>
              <div className="text-sm">{data.projectId || "未关联项目"}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500">预计结束日期</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{data.expectedEndDate ? format(new Date(data.expectedEndDate), "yyyy/MM/dd") : "未设定"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 动物图片 */}
      {data.images && data.images.length > 0 && (
        <Card className="border border-gray-100 rounded-md bg-white mb-6">
          <div className="p-4 pb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">动物图片</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {data.images.map((image: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`动物图片 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 备注信息 */}
      <Card className="border border-gray-100 rounded-md bg-white mb-6">
        <div className="p-4 pb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">其他信息</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">备注信息</div>
              <p className="text-sm text-gray-700">{data.notes || "暂无特殊备注"}</p>
            </div>
            
            <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">动物伦理提示</p>
                <p className="text-amber-700 mt-1">
                  该动物档案符合伦理委员会的审批要求，按照3R原则（替代、减少、优化）进行管理和使用。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 