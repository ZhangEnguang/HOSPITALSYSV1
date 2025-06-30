import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  SELECTION_VARIANTS, 
  DECORATION_VARIANTS 
} from "@/components/ui/card-selection-variants"
import { CARD_SELECTION_CONFIG } from '../config/equipment-booking-config'

// 模拟数据
const mockItem = {
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
}

export default function SelectionDemo() {
  const [currentVariant, setCurrentVariant] = useState<keyof typeof SELECTION_VARIANTS>('variant1')
  const [currentDecorations, setCurrentDecorations] = useState<Array<keyof typeof DECORATION_VARIANTS>>(['stripe', 'corner', 'glow'])
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const SelectionComponent = SELECTION_VARIANTS[currentVariant]
  const decorationComponents = currentDecorations.map(key => DECORATION_VARIANTS[key])

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">卡片勾选方案演示</h1>
        <p className="text-gray-600">展示不同的卡片勾选设计方案，用于仪器预约管理</p>
      </div>

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle>控制面板</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 勾选方案选择 */}
          <div>
            <h3 className="font-medium mb-3">勾选方案</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(SELECTION_VARIANTS).map((variant) => (
                <Button
                  key={variant}
                  variant={currentVariant === variant ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentVariant(variant as keyof typeof SELECTION_VARIANTS)}
                >
                  {variant === 'variant1' && '圆形悬停'}
                  {variant === 'variant2' && '现代方形'}
                  {variant === 'variant3' && '极简波纹'}
                  {variant === 'variant4' && '浮动渐变'}
                  {variant === 'variant5' && '心形收藏'}
                </Button>
              ))}
            </div>
          </div>

          {/* 装饰效果选择 */}
          <div>
            <h3 className="font-medium mb-3">装饰效果</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(DECORATION_VARIANTS).map((decoration) => (
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
                >
                  {decoration === 'stripe' && '侧边条纹'}
                  {decoration === 'corner' && '角标'}
                  {decoration === 'glow' && '底部发光'}
                  {decoration === 'border' && '边框发光'}
                  {decoration === 'halo' && '背景光晕'}
                </Button>
              ))}
            </div>
          </div>

          {/* 状态控制 */}
          <div>
            <h3 className="font-medium mb-3">状态控制</h3>
            <div className="flex gap-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSelected(!isSelected)}
              >
                {isSelected ? '已选中' : '未选中'}
              </Button>
              <Button
                variant={isHovered ? "default" : "outline"}
                size="sm"
                onClick={() => setIsHovered(!isHovered)}
              >
                {isHovered ? '鼠标悬停' : '正常状态'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预览卡片 */}
      <div className="max-w-md mx-auto">
        <h3 className="font-medium mb-4 text-center">预览效果</h3>
        <Card
          className={`relative transition-all duration-300 border cursor-pointer
            border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]
            ${isSelected 
              ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)] bg-gradient-to-br from-primary/5 to-transparent" 
              : "hover:border-primary/20"}
            overflow-hidden`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 动态勾选组件 */}
          <SelectionComponent 
            isHovered={isHovered}
            isSelected={isSelected}
            onToggleSelect={() => setIsSelected(!isSelected)}
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
                    {mockItem.bookingTitle}
                  </h3>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {mockItem.status}
                  </Badge>
                </div>
                <p className={`text-sm truncate mt-1 transition-colors duration-300 ${
                  isSelected ? "text-primary/70" : "text-muted-foreground"
                }`}>
                  {mockItem.purpose}
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
                    {`${mockItem.equipmentName} (${mockItem.equipmentType})`}
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-xs text-muted-foreground block mb-0.5">申请人</span>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{mockItem.applicant.name}</span>
                      <div className="w-px h-3 bg-gray-300"></div>
                      <span className="text-sm text-muted-foreground">{mockItem.department}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约日期</span>
                  <div className="truncate">
                    2023/11/28
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-xs text-muted-foreground block mb-0.5">预约时长</span>
                  <div className="truncate">
                    {mockItem.duration}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 方案说明 */}
      <Card>
        <CardHeader>
          <CardTitle>方案说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">勾选方案特点</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>圆形悬停：</strong>经典设计，左上角圆形勾选框，悬停时显示</li>
                <li><strong>现代方形：</strong>右上角方形设计，带渐变背景和阴影</li>
                <li><strong>极简波纹：</strong>简洁方形勾选框，选中时有波纹动画</li>
                <li><strong>浮动渐变：</strong>圆角方形，带浮动效果和渐变阴影</li>
                <li><strong>心形收藏：</strong>创新的心形收藏风格，适合特殊场景</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">装饰效果说明</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>侧边条纹：</strong>左侧彩色条纹，提供清晰的选中标识</li>
                <li><strong>角标：</strong>右上角三角形标记，增加视觉层次</li>
                <li><strong>底部发光：</strong>底部渐变发光效果，增强选中感知</li>
                <li><strong>边框发光：</strong>整体边框发光动画，强化选中状态</li>
                <li><strong>背景光晕：</strong>柔和的背景渐变，提供微妙的视觉反馈</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 