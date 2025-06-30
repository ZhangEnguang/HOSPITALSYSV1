import React from 'react'
import { cn } from "@/lib/utils"

// 优雅款勾选框组件
export const ElegantSelectionBox = ({ 
  isHovered, 
  isSelected, 
  onToggleSelect,
  className = ""
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: () => void
  className?: string
}) => (
  <div className={cn(
    "absolute top-2 left-2 z-10 transition-all duration-300 ease-out",
    isHovered || isSelected ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-1",
    className
  )}>
    <div
      onClick={(e) => {
        e.stopPropagation()
        onToggleSelect()
      }}
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

// 优雅款角标装饰
export const ElegantCornerDecor = ({ 
  className = ""
}: {
  className?: string
}) => (
  <div className={cn("absolute top-0 right-0", className)}>
    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary/20" />
  </div>
)

// 优雅款底部发光装饰
export const ElegantGlowDecor = ({ 
  className = ""
}: {
  className?: string
}) => (
  <div className={cn(
    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 animate-pulse",
    className
  )} />
)

// 完整的优雅款卡片选中组件
export const ElegantCardSelection = ({
  isHovered,
  isSelected,
  onToggleSelect,
  children,
  className = "",
  showDecoration = true
}: {
  isHovered: boolean
  isSelected: boolean
  onToggleSelect: (selected: boolean) => void
  children: React.ReactNode
  className?: string
  showDecoration?: boolean
}) => {
  return (
    <div 
      className={cn(
        "relative transition-all duration-300 border cursor-pointer",
        "border-[#E9ECF2] shadow-none hover:shadow-[0px_38px_45px_0px_rgba(198,210,241,0.25)]",
        isSelected 
          ? "border-primary/50 shadow-[0_0_0_2px_rgba(59,130,246,0.1)] bg-gradient-to-br from-primary/5 to-transparent" 
          : "hover:border-primary/20",
        "overflow-hidden rounded-lg",
        className
      )}
    >
      {/* 优雅款勾选框 */}
      <ElegantSelectionBox 
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={() => onToggleSelect(!isSelected)}
      />

      {/* 选中状态的装饰性元素 */}
      {isSelected && showDecoration && (
        <>
          <ElegantCornerDecor />
          <ElegantGlowDecor />
        </>
      )}

      {/* 卡片内容 */}
      {children}
    </div>
  )
}

// 优雅款卡片 Hook，提供状态管理
export const useElegantCardSelection = (
  initialSelected: boolean = false,
  onSelectionChange?: (selected: boolean) => void
) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isSelected, setIsSelected] = React.useState(initialSelected)

  const toggleSelection = (selected: boolean) => {
    setIsSelected(selected)
    onSelectionChange?.(selected)
  }

  const cardProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return {
    isHovered,
    isSelected,
    toggleSelection,
    cardProps
  }
}

// 使用示例的类型定义
export interface ElegantCardProps {
  isSelected?: boolean
  onSelectionChange?: (selected: boolean) => void
  children: React.ReactNode
  className?: string
  showDecoration?: boolean
}

// 简化的优雅款卡片组件（带内置状态管理）
export const ElegantCard = ({
  isSelected: controlledSelected,
  onSelectionChange,
  children,
  className = "",
  showDecoration = true
}: ElegantCardProps) => {
  const { isHovered, isSelected, toggleSelection, cardProps } = useElegantCardSelection(
    controlledSelected,
    onSelectionChange
  )

  const selected = controlledSelected !== undefined ? controlledSelected : isSelected

  return (
    <div {...cardProps}>
      <ElegantCardSelection
        isHovered={isHovered}
        isSelected={selected}
        onToggleSelect={toggleSelection}
        className={className}
        showDecoration={showDecoration}
      >
        {children}
      </ElegantCardSelection>
    </div>
  )
} 