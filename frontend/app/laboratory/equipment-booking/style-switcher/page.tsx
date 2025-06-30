"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS 
} from "../components/selection-variants"

// 模拟数据
const mockItems = [
  {
    id: "1",
    bookingTitle: "气相色谱分析",
    purpose: "分析水中有机物含量",
    equipmentName: "气相色谱仪",
    equipmentType: "分析仪器",
    applicant: { name: "李四" },
    department: "化学实验室",
    startTime: "2023-11-28T09:00:00",
    duration: "4小时",
    status: "待审核"
  },
  {
    id: "2", 
    bookingTitle: "力学性能测试",
    purpose: "测试复合材料的拉伸强度",
    equipmentName: "万能试验机",
    equipmentType: "物理仪器",
    applicant: { name: "张七" },
    department: "材料实验室", 
    startTime: "2023-11-29T14:00:00",
    duration: "4小时",
    status: "审核通过"
  },
  {
    id: "3",
    bookingTitle: "光谱测量实验", 
    purpose: "测量有机化合物的荧光光谱",
    equipmentName: "荧光光谱仪",
    equipmentType: "光学仪器",
    applicant: { name: "张七" },
    department: "化学实验室",
    startTime: "2023-11-26T10:00:00", 
    duration: "5小时",
    status: "待审核"
  }
]

const statusColors: Record<string, string> = {
  "待审核": "bg-amber-50 text-amber-700 border-amber-200",
  "审核通过": "bg-green-50 text-green-700 border-green-200", 
  "审核退回": "bg-red-50 text-red-700 border-red-200",
  "已取消": "bg-gray-50 text-gray-700 border-gray-200",
}

const variantNames = {
  variant1: "方案1: 圆形悬停",
  variant2: "方案2: 现代方形", 
  variant3: "方案3: 极简波纹",
  variant4: "方案4: 浮动渐变",
  variant5: "方案5: 心形收藏"
}

const decorationNames = {
  stripe: "侧边条纹",
  corner: "角标",
  glow: "底部发光", 
  border: "边框发光",
  halo: "背景光晕"
}

export default function StyleSwitcher() {
  const [currentVariant, setCurrentVariant] = useState<keyof typeof SELECTION_VARIANTS>('variant1')
  const [currentDecorations, setCurrentDecorations] = useState<Array<keyof typeof DECORATION_VARIANTS>>(['stripe', 'corner', 'glow'])
  const [selectedCards, setSelectedCards] = useState<string[]>(['1'])

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const renderCard = (item: any, isHovered: boolean = false) => {
    const isSelected = selectedCards.includes(item.id)
    const SelectionComponent = SELECTION_VARIANTS[currentVariant]
    const decorationComponents = currentDecorations.map(key => DECORATION_VARIANTS[key])

    return (
      <Card
        key={item.id}
        className={`relative transition-all duration-300 border cursor-pointer
          border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]
          ${isSelected 
            ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)] bg-gradient-to-br from-primary/5 to-transparent" 
            : "hover:border-primary/20"}
          overflow-hidden`}
        onClick={() => toggleCardSelection(item.id)}
      >
        {/* 动态勾选组件 */}
        <SelectionComponent 
          isHovered={isHovered || isSelected}
          isSelected={isSelected}
          onToggleSelect={() => toggleCardSelection(item.id)}
        />

        {/* 选中状态的装饰性元素 */}
        {isSelected && (
          <>
            {decorationComponents.map((DecorationComponent, index) => (
              <DecorationComponent key={index} />
            ))}
          </>
        )}

        <CardHeader className="p-5 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold text-base truncate flex-1 transition-colors duration-300 ${
                  isSelected ? "text-primary" : "group-hover:text-primary"
                }`}>
                  {item.bookingTitle}
                </h3>
                <Badge 
                  variant="outline" 
                  className={statusColors[item.status]}
                >
                  {item.status}
                </Badge>
              </div>
              <p className={`text-sm truncate mt-1 transition-colors duration-300 ${
                isSelected ? "text-primary/70" : "text-muted-foreground"
              }`}>
                {item.purpose}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-0">
          <div className="grid gap-2 mt-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约仪器</span>
                <div className="truncate">
                  {`${item.equipmentName} (${item.equipmentType})`}
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-0.5">申请人</span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.applicant.name}</span>
                    <div className="w-px h-3 bg-gray-300"></div>
                    <span className="text-sm text-muted-foreground">{item.department}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约日期</span>
                <div className="truncate">
                  {format(new Date(item.startTime), "yyyy/MM/dd")}
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约时长</span>
                <div className="truncate">
                  {item.duration}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">仪器预约卡片勾选样式演示</h1>
        <p className="text-gray-600">实时预览和切换不同的卡片勾选设计方案</p>
      </div>

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle>样式控制面板</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 勾选方案选择 */}
          <div>
            <h3 className="font-medium mb-3">勾选方案选择</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(variantNames).map(([variant, name]) => (
                <Button
                  key={variant}
                  variant={currentVariant === variant ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentVariant(variant as keyof typeof SELECTION_VARIANTS)}
                  className="text-xs"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>

          {/* 装饰效果选择 */}
          <div>
            <h3 className="font-medium mb-3">装饰效果（可多选）</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(decorationNames).map(([decoration, name]) => (
                <Button
                  key={decoration}
                  variant={currentDecorations.includes(decoration as keyof typeof DECORATION_VARIANTS) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const decorationKey = decoration as keyof typeof DECORATION_VARIANTS
                    if (currentDecorations.includes(decorationKey)) {
                      setCurrentDecorations(currentDecorations.filter(d => d !== decorationKey))
                    } else {
                      setCurrentDecorations([...currentDecorations, decorationKey])
                    }
                  }}
                  className="text-xs"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>

          {/* 快捷预设 */}
          <div>
            <h3 className="font-medium mb-3">快捷预设组合</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVariant('variant1')
                  setCurrentDecorations(['stripe', 'glow'])
                }}
              >
                🎨 经典款
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVariant('variant2')
                  setCurrentDecorations(['border', 'halo'])
                }}
              >
                ✨ 现代款
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVariant('variant3')
                  setCurrentDecorations(['stripe'])
                }}
              >
                🎯 极简款
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVariant('variant4')
                  setCurrentDecorations(['corner', 'glow'])
                }}
              >
                💎 优雅款
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentVariant('variant5')
                  setCurrentDecorations(['corner'])
                }}
              >
                ❤️ 趣味款
              </Button>
            </div>
          </div>

          {/* 选中状态显示 */}
          <div>
            <h3 className="font-medium mb-3">当前选中: {selectedCards.length} 项</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCards(mockItems.map(item => item.id))}
              >
                全选
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCards([])}
              >
                清空
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预览区域 */}
      <div>
        <h3 className="font-medium mb-4">实时预览效果</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockItems.map((item) => renderCard(item))}
        </div>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">如何应用到正式环境：</h4>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>在上方控制面板选择你喜欢的勾选方案和装饰效果</li>
                <li>记住你选择的方案名称（如 variant2 + border + halo）</li>
                <li>修改 <code>app/laboratory/equipment-booking/config/equipment-booking-config.tsx</code> 文件</li>
                <li>更新 <code>CARD_SELECTION_CONFIG</code> 中的 <code>currentVariant</code> 和 <code>currentDecorations</code></li>
                <li>保存文件即可在仪器预约管理页面看到新样式</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">各方案特点：</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>方案1 圆形悬停:</strong> 左上角圆形，经典设计，适合正式场景</li>
                <li><strong>方案2 现代方形:</strong> 右上角方形，现代感强，有渐变效果</li>
                <li><strong>方案3 极简波纹:</strong> 简洁设计，选中时有波纹动画</li>
                <li><strong>方案4 浮动渐变:</strong> 立体浮动效果，视觉冲击力强</li>
                <li><strong>方案5 心形收藏:</strong> 创新设计，适合特殊用途</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 