import React from 'react';
import { cn } from '@/lib/utils';

// 选择方案类型（保持兼容性）
export type SelectionVariant = 'elegant' | 'classic' | 'minimal' | 'floating' | 'heart';

// 装饰效果类型
export type DecorationEffect = 'corner-badge' | 'side-stripe' | 'bottom-glow' | 'border-glow' | 'background-aura';

interface UnifiedCardSelectionProps {
  children: React.ReactNode;
  isSelected: boolean;
  onToggle: () => void;
  variant?: SelectionVariant;
  decorations?: DecorationEffect[];
  className?: string;
  disabled?: boolean;
}

// 选择方案样式定义
const SELECTION_STYLES = {
  elegant: {
    checkbox: "absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl z-10",
    selectedOverlay: "absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border-2 border-gradient-to-r from-blue-400 to-purple-400 shadow-lg",
  },
  classic: {
    checkbox: "absolute top-2 left-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-lg z-10",
    selectedOverlay: "absolute inset-0 bg-blue-50/30 rounded-lg border-2 border-blue-400 shadow-md",
  },
  minimal: {
    checkbox: "absolute top-2 left-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-md z-10",
    selectedOverlay: "absolute inset-0 bg-blue-50/20 rounded-lg border border-blue-300 shadow-sm",
  },
  floating: {
    checkbox: "absolute -top-3 -left-3 w-10 h-10 bg-white border-2 border-blue-400 rounded-xl shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl z-10",
    selectedOverlay: "absolute inset-0 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 rounded-lg border-2 border-blue-400 shadow-xl",
  },
  heart: {
    checkbox: "absolute top-2 right-2 w-7 h-7 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-red-400 hover:shadow-lg z-10",
    selectedOverlay: "absolute inset-0 bg-red-50/30 rounded-lg border border-red-300 shadow-md",
  }
};

// 装饰效果样式
const DECORATION_STYLES = {
  'corner-badge': "absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full z-10",
  'side-stripe': "absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-l-lg",
  'bottom-glow': "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full blur-sm",
  'border-glow': "absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-sm",
  'background-aura': "absolute inset-0 bg-gradient-radial from-blue-100/30 via-transparent to-transparent rounded-lg"
};

export const UnifiedCardSelection: React.FC<UnifiedCardSelectionProps> = ({
  children,
  isSelected,
  onToggle,
  variant = 'elegant',
  decorations = ['corner-badge', 'bottom-glow'],
  className,
  disabled = false
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const styles = SELECTION_STYLES[variant];
  const showSelection = isHovered && !disabled;

  return (
    <div 
      className={cn(
        "relative transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 选中状态覆盖层 */}
      {isSelected && (
        <>
          <div className={styles.selectedOverlay} />
          {/* 装饰效果 */}
          {decorations.map((decoration) => (
            <div 
              key={decoration}
              className={DECORATION_STYLES[decoration]}
            />
          ))}
        </>
      )}
      
      {/* 勾选框 */}
      {showSelection && (
        <div 
          className={styles.checkbox}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onToggle();
          }}
        >
          {isSelected && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {!isSelected && variant === 'heart' && (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
      
      {/* 原始卡片内容 */}
      {children}
    </div>
  );
};

// 导出便捷的预设组件
export const ElegantCardSelection: React.FC<Omit<UnifiedCardSelectionProps, 'variant' | 'decorations'>> = (props) => (
  <UnifiedCardSelection {...props} variant="elegant" decorations={['corner-badge', 'bottom-glow']} />
);

export const ClassicCardSelection: React.FC<Omit<UnifiedCardSelectionProps, 'variant'>> = (props) => (
  <UnifiedCardSelection {...props} variant="classic" />
);

// 兼容性导出（保持现有API）
export const SELECTION_VARIANTS = {
  elegant: { variant: 'elegant' as const, decorations: ['corner-badge', 'bottom-glow'] as const },
  classic: { variant: 'classic' as const, decorations: [] as const },
  minimal: { variant: 'minimal' as const, decorations: [] as const },
  floating: { variant: 'floating' as const, decorations: ['border-glow'] as const },
  heart: { variant: 'heart' as const, decorations: [] as const }
}; 