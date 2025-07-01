import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS,
  DEFAULT_CARD_SELECTION_CONFIG
} from "@/components/ui/card-selection-variants"
import { cn } from "@/lib/utils"

// 演示卡片 - 仪器管理样式
const EquipmentDemoCard = ({ isSelected, onToggleSelect }: {
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // 获取当前使用的勾选组件
  const SelectionComponent = SELECTION_VARIANTS[DEFAULT_CARD_SELECTION_CONFIG.currentVariant]
  
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 border cursor-pointer",
        "border-[#E9ECF2] shadow-sm hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]",
        "flex flex-col w-full h-full",
        isSelected 
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]" 
          : "hover:border-primary/20",
        "overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 动态勾选组件 */}
      <SelectionComponent 
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={() => onToggleSelect(!isSelected)}
      />

      {/* 选中状态的装饰性元素 */}
      {isSelected && (
        <>
          {DEFAULT_CARD_SELECTION_CONFIG.currentDecorations.map((decorationKey, index) => {
            const DecorationComponent = DECORATION_VARIANTS[decorationKey]
            return <DecorationComponent key={index} />
          })}
        </>
      )}

      {/* 仪器图片区域 */}
      <div 
        className="relative w-full overflow-hidden rounded-t-lg bg-gray-50 flex-shrink-0"
        style={{ paddingBottom: '45%' }}
      >
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500">仪器图片</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 卡片内容 */}
      <div className="pt-5 px-5 pb-4 flex flex-col flex-1 min-h-0">
        {/* 标题和型号 */}
        <div className="flex-shrink-0 mb-2">
          <h3 className={cn(
            "font-medium text-sm truncate leading-tight mb-1 transition-colors duration-300",
            isSelected ? "text-primary" : "text-gray-900 group-hover:text-primary"
          )}>
            XPS (X射线光电子能谱分析)
          </h3>
          <p className={cn(
            "text-xs truncate leading-relaxed transition-colors duration-300",
            isSelected ? "text-primary/70" : "text-muted-foreground"
          )}>
            Thermo Fisher ESCALAB Xi+
          </p>
        </div>

        {/* 填充空间 */}
        <div className="flex-1 min-h-0"></div>
        
        {/* 预约次数和使用状态 */}
        <div className="flex-shrink-0 flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground leading-none">
              预约次数：203次
            </span>
            <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-200 leading-none">
              可预约
            </span>
          </div>
          <Badge variant="secondary" className="font-medium text-xs leading-none">
            正常
          </Badge>
        </div>
      </div>
    </Card>
  )
}

// 演示卡片 - 仪器预约管理样式
const EquipmentBookingDemoCard = ({ isSelected, onToggleSelect }: {
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // 获取当前使用的勾选组件
  const SelectionComponent = SELECTION_VARIANTS[DEFAULT_CARD_SELECTION_CONFIG.currentVariant]
  
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 border cursor-pointer",
        "border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]",
        isSelected 
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]" 
          : "hover:border-primary/20",
        "overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 动态勾选组件 */}
      <SelectionComponent 
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={() => onToggleSelect(!isSelected)}
      />

      {/* 选中状态的装饰性元素 */}
      {isSelected && (
        <>
          {DEFAULT_CARD_SELECTION_CONFIG.currentDecorations.map((decorationKey, index) => {
            const DecorationComponent = DECORATION_VARIANTS[decorationKey]
            return <DecorationComponent key={index} />
          })}
        </>
      )}

      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold text-base truncate flex-1 transition-colors duration-300",
                isSelected ? "text-primary" : "group-hover:text-primary"
              )}>
                相色谱分析
              </h3>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                待审核
              </Badge>
            </div>
            <p className={cn(
              "text-sm truncate mt-1 transition-colors duration-300",
              isSelected ? "text-primary/70" : "text-muted-foreground"
            )}>
              分析水样中有机物含量分析
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0">
        <div className="grid gap-2 mt-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* 预约仪器字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约仪器</span>
              <div className="truncate">
                气相色谱仪 (分析仪器)
              </div>
            </div>
            
            {/* 申请人字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">申请人</span>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="font-medium">李四</span>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <span className="text-sm text-muted-foreground">化学实验室</span>
                </div>
              </div>
            </div>
            
            {/* 预约日期字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约日期</span>
              <div className="truncate">
                2023/11/28
              </div>
            </div>
            
            {/* 预约时长字段 */}
            <div className="text-sm">
              <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约时长</span>
              <div className="truncate">
                4小时
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 主要的对比演示组件
export const CardSelectionComparison = () => {
  const [equipmentSelected, setEquipmentSelected] = useState(false)
  const [bookingSelected, setBookingSelected] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          卡片选中样式一致性对比
        </h2>
        <p className="text-gray-600">
          验证仪器管理和仪器预约管理模块使用相同的优雅款选中样式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 仪器管理卡片 */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              仪器管理卡片
            </h3>
            <p className="text-sm text-gray-600">
              使用优雅款选中样式
            </p>
          </div>
          <div className="w-80 mx-auto">
            <EquipmentDemoCard 
              isSelected={equipmentSelected}
              onToggleSelect={setEquipmentSelected}
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {equipmentSelected ? "✅ 已选中" : "⭕ 未选中"}
            </p>
          </div>
        </div>

        {/* 仪器预约管理卡片 */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              仪器预约管理卡片
            </h3>
            <p className="text-sm text-gray-600">
              使用优雅款选中样式
            </p>
          </div>
          <div className="w-80 mx-auto">
            <EquipmentBookingDemoCard 
              isSelected={bookingSelected}
              onToggleSelect={setBookingSelected}
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {bookingSelected ? "✅ 已选中" : "⭕ 未选中"}
            </p>
          </div>
        </div>
      </div>

      {/* 样式特性说明 */}
      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <h4 className="font-semibold text-blue-900 mb-3">
          优雅款选中样式特性：
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            左上角浮动渐变勾选框
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            右上角三角形角标装饰
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            底部渐变发光效果
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            300ms平滑过渡动画
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSelectionComparison 