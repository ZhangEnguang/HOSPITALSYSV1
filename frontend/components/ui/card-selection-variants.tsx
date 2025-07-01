import React from 'react'
import { cn } from "@/lib/utils"

// 通用卡片选中样式组件库
// 提供多种卡片选中效果的方案，可在各个模块中灵活使用

// 方案一：左上角圆形悬停勾选框（经典款）
export const SelectionVariant1 = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect 
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) => (
  <div className={cn(
    "absolute top-3 left-3 z-10 transition-all duration-300 ease-out",
    isHovered || isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
  )}>
    <div
      onClick={onToggleSelect}
      className={cn(
        "relative w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer",
        "flex items-center justify-center",
        isSelected
          ? "bg-primary border-primary shadow-lg transform scale-110"
          : "bg-white/90 border-gray-300 hover:border-primary hover:bg-primary/5",
        "backdrop-blur-sm"
      )}
    >
      {isSelected && (
        <svg 
          className="w-3.5 h-3.5 text-white transition-all duration-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      )}
      {!isSelected && isHovered && (
        <div className="w-2 h-2 bg-primary/30 rounded-full transition-all duration-200" />
      )}
    </div>
  </div>
)

// 方案二：右上角现代方形勾选框
export const SelectionVariant2 = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect 
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) => (
  <div className={cn(
    "absolute top-2 right-2 z-10 transition-all duration-300 ease-out",
    isHovered || isSelected ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
  )}>
    <div
      onClick={onToggleSelect}
      className={cn(
        "relative w-7 h-7 rounded-xl border transition-all duration-200 cursor-pointer",
        "flex items-center justify-center shadow-sm",
        isSelected
          ? "bg-gradient-to-br from-primary to-primary/80 border-primary text-white"
          : "bg-white/95 border-gray-200 hover:border-primary hover:shadow-md",
        "backdrop-blur-md"
      )}
    >
      {isSelected ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-3 h-3 border-2 border-gray-400 rounded-sm opacity-60" />
      )}
    </div>
  </div>
)

// 方案三：左上角极简勾选框 + 波纹效果
export const SelectionVariant3 = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect 
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) => (
  <>
    <div className={cn(
      "absolute top-3 left-3 z-10 transition-all duration-300 ease-out",
      isHovered || isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90"
    )}>
      <div
        onClick={onToggleSelect}
        className={cn(
          "relative w-5 h-5 border transition-all duration-200 cursor-pointer",
          "flex items-center justify-center",
          isSelected
            ? "bg-primary border-primary text-white rounded-md"
            : "bg-white/80 border-gray-400 rounded-sm hover:border-primary",
          "backdrop-blur-sm"
        )}
      >
        {isSelected && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
    
    {/* 选中时的波纹效果 */}
    {isSelected && (
      <div className="absolute top-1 left-1 w-7 h-7 border-2 border-primary/30 rounded-full animate-ping" />
    )}
  </>
)

// 方案四：浮动勾选框 + 渐变阴影（优雅款）
export const SelectionVariant4 = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect 
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) => (
  <div className={cn(
    "absolute top-2 left-2 z-10 transition-all duration-300 ease-out",
    isHovered || isSelected ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-1"
  )}>
    <div
      onClick={onToggleSelect}
      className={cn(
        "relative w-6 h-6 rounded-lg transition-all duration-200 cursor-pointer",
        "flex items-center justify-center shadow-xl",
        isSelected
          ? "bg-gradient-to-br from-primary to-blue-600 border border-primary/20 shadow-primary/25"
          : "bg-white/95 border border-gray-200 hover:border-primary/50 hover:shadow-lg",
        "backdrop-blur-sm"
      )}
    >
      {isSelected && (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {!isSelected && isHovered && (
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-primary/40 to-blue-500/40 rounded-sm" />
      )}
    </div>
  </div>
)

// 方案五：心形收藏风格勾选
export const SelectionVariant5 = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect 
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
}) => (
  <div className={cn(
    "absolute top-3 right-3 z-10 transition-all duration-300 ease-out",
    isHovered || isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
  )}>
    <div
      onClick={onToggleSelect}
      className={cn(
        "relative w-6 h-6 transition-all duration-200 cursor-pointer",
        "flex items-center justify-center"
      )}
    >
      <svg
        className={cn(
          "w-6 h-6 transition-all duration-200",
          isSelected 
            ? "text-red-500 fill-red-500 scale-110" 
            : "text-gray-300 hover:text-red-300 hover:scale-105"
        )}
        fill={isSelected ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
  </div>
)

// 装饰性元素组件

// 选中状态的装饰条纹
export const SelectionDecorStripe = () => (
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 animate-pulse" />
)

// 选中状态的角标
export const SelectionDecorCorner = () => (
  <div className="absolute top-0 right-0 z-20">
    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary/20" />
  </div>
)

// 选中状态的底部发光
export const SelectionDecorGlow = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 animate-pulse" />
)

// 选中状态的边框发光
export const SelectionDecorBorder = () => (
  <div className="absolute inset-0 border-2 border-primary/20 rounded-lg animate-pulse pointer-events-none" />
)

// 选中状态的背景光晕
export const SelectionDecorHalo = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-lg pointer-events-none" />
)

// 方案集合，便于切换
export const SELECTION_VARIANTS = {
  variant1: SelectionVariant1,
  variant2: SelectionVariant2,
  variant3: SelectionVariant3,
  variant4: SelectionVariant4,
  variant5: SelectionVariant5,
}

export const DECORATION_VARIANTS = {
  stripe: SelectionDecorStripe,
  corner: SelectionDecorCorner,
  glow: SelectionDecorGlow,
  border: SelectionDecorBorder,
  halo: SelectionDecorHalo,
}

// 预设配置方案
export const CARD_SELECTION_PRESETS = {
  classic: { variant: 'variant1', decorations: ['stripe', 'glow'] },
  modern: { variant: 'variant2', decorations: ['border', 'halo'] },
  minimal: { variant: 'variant3', decorations: ['stripe'] },
  elegant: { variant: 'variant4', decorations: ['corner', 'glow'] },
  playful: { variant: 'variant5', decorations: ['corner'] },
}

// 类型定义
export type SelectionVariantType = keyof typeof SELECTION_VARIANTS
export type DecorationVariantType = keyof typeof DECORATION_VARIANTS
export type PresetType = keyof typeof CARD_SELECTION_PRESETS

// 配置接口
export interface CardSelectionConfig {
  currentVariant: SelectionVariantType
  currentDecorations: DecorationVariantType[]
}

// 默认配置（优雅款）
export const DEFAULT_CARD_SELECTION_CONFIG: CardSelectionConfig = {
  currentVariant: 'variant4',
  currentDecorations: ['corner', 'glow'],
} 