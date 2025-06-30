# 优雅款卡片选中组件

这是一个独立的卡片选中组件，采用优雅的浮动渐变设计风格，包含左上角浮动勾选框、右上角装饰角标和底部发光效果。

## 组件特性

- ✨ **浮动渐变勾选框**：左上角圆角方形设计，带浮动效果和渐变阴影
- 🎯 **角标装饰**：右上角三角形标记，增加视觉层次
- 💫 **底部发光**：选中时底部渐变发光效果，增强选中感知
- 🎨 **平滑动画**：300ms 过渡动画，提供流畅的交互体验
- 📱 **响应式设计**：支持悬停和选中状态的视觉反馈
- 🔧 **高度可定制**：支持自定义样式和装饰效果控制

## 安装使用

组件位于 `components/ui/elegant-card-selection.tsx`，可以直接导入使用：

```typescript
import { 
  ElegantCard,
  ElegantCardSelection,
  ElegantSelectionBox,
  ElegantCornerDecor,
  ElegantGlowDecor,
  useElegantCardSelection
} from "@/components/ui/elegant-card-selection"
```

## 使用方式

### 1. 简单使用（推荐）

最简单的使用方式，组件内置状态管理：

```tsx
import { ElegantCard } from "@/components/ui/elegant-card-selection"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function MyCard() {
  return (
    <ElegantCard 
      onSelectionChange={(selected) => console.log('选中状态:', selected)}
    >
      <CardHeader>
        <h3>卡片标题</h3>
      </CardHeader>
      <CardContent>
        <p>卡片内容</p>
      </CardContent>
    </ElegantCard>
  )
}
```

### 2. 受控模式

当你需要外部控制选中状态时：

```tsx
import { useState } from 'react'
import { ElegantCard } from "@/components/ui/elegant-card-selection"

function ControlledCard() {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <ElegantCard 
      isSelected={isSelected}
      onSelectionChange={setIsSelected}
      className="w-full max-w-md"
    >
      {/* 你的卡片内容 */}
    </ElegantCard>
  )
}
```

### 3. 完全自定义

当你需要完全控制交互状态时：

```tsx
import { ElegantCardSelection, useElegantCardSelection } from "@/components/ui/elegant-card-selection"

function CustomCard() {
  const { isHovered, isSelected, toggleSelection, cardProps } = useElegantCardSelection()

  return (
    <div {...cardProps}>
      <ElegantCardSelection
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={toggleSelection}
        showDecoration={true}
        className="custom-card"
      >
        {/* 你的自定义内容 */}
      </ElegantCardSelection>
    </div>
  )
}
```

### 4. 组件拆分使用

如果只需要某个特定部分：

```tsx
import { 
  ElegantSelectionBox,
  ElegantCornerDecor,
  ElegantGlowDecor 
} from "@/components/ui/elegant-card-selection"

function PartialComponents() {
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      {/* 只使用勾选框 */}
      <ElegantSelectionBox 
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={() => setIsSelected(!isSelected)}
      />
      
      {/* 只在选中时显示装饰 */}
      {isSelected && (
        <>
          <ElegantCornerDecor />
          <ElegantGlowDecor />
        </>
      )}
      
      {/* 你的内容 */}
    </div>
  )
}
```

## API 参考

### ElegantCard Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| isSelected | boolean | undefined | 受控的选中状态 |
| onSelectionChange | (selected: boolean) => void | undefined | 选中状态变化回调 |
| children | React.ReactNode | 必需 | 卡片内容 |
| className | string | "" | 自定义 CSS 类名 |
| showDecoration | boolean | true | 是否显示装饰效果 |

### ElegantCardSelection Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| isHovered | boolean | 必需 | 悬停状态 |
| isSelected | boolean | 必需 | 选中状态 |
| onToggleSelect | (selected: boolean) => void | 必需 | 切换选中状态的回调 |
| children | React.ReactNode | 必需 | 卡片内容 |
| className | string | "" | 自定义 CSS 类名 |
| showDecoration | boolean | true | 是否显示装饰效果 |

### useElegantCardSelection Hook

返回值：

```typescript
{
  isHovered: boolean,        // 当前悬停状态
  isSelected: boolean,       // 当前选中状态
  toggleSelection: (selected: boolean) => void,  // 切换选中状态的函数
  cardProps: {               // 用于绑定到容器的属性
    onMouseEnter: () => void,
    onMouseLeave: () => void
  }
}
```

## 在其他模块中的应用示例

### 实验室设备卡片

```tsx
// app/laboratory/equipment/components/equipment-card.tsx
import { ElegantCard } from "@/components/ui/elegant-card-selection"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EquipmentCardProps {
  equipment: {
    id: string
    name: string
    status: string
    location: string
  }
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
}

export function EquipmentCard({ equipment, isSelected, onSelect }: EquipmentCardProps) {
  return (
    <ElegantCard 
      isSelected={isSelected}
      onSelectionChange={onSelect}
      className="h-full"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{equipment.name}</h3>
          <Badge variant="outline">{equipment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{equipment.location}</p>
      </CardContent>
    </ElegantCard>
  )
}
```

### 项目申请卡片

```tsx
// app/applications/components/application-card.tsx
import { ElegantCard } from "@/components/ui/elegant-card-selection"

export function ApplicationCard({ application, selected, onToggle }) {
  return (
    <ElegantCard 
      isSelected={selected}
      onSelectionChange={onToggle}
      showDecoration={true}
    >
      {/* 你的申请卡片内容 */}
    </ElegantCard>
  )
}
```

## 样式定制

组件使用 Tailwind CSS 类名，可以通过 `className` 属性进行样式定制：

```tsx
<ElegantCard 
  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
  showDecoration={false}  // 关闭默认装饰
>
  {/* 内容 */}
</ElegantCard>
```

## 注意事项

1. **样式隔离**：组件使用绝对定位，确保父容器有 `relative` 定位
2. **事件冒泡**：勾选框点击事件会自动阻止冒泡，不会触发卡片的点击事件
3. **性能优化**：动画使用 CSS transition，性能优异
4. **无障碍访问**：支持键盘导航和屏幕阅读器

## 版本历史

- v1.0.0: 初始版本，包含基础的优雅款卡片选中功能
- 适用于：仪器预约、设备管理、项目申请等各类卡片场景 