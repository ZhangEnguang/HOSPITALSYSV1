"use client"

import React, { useState } from 'react'
import { 
  ElegantCard,
  ElegantCardSelection,
  ElegantSelectionBox,
  ElegantCornerDecor,
  ElegantGlowDecor,
  useElegantCardSelection
} from "./elegant-card-selection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 模拟数据
const mockEquipment = [
  {
    id: "1",
    name: "高效液相色谱仪",
    model: "Agilent 1260",
    status: "可用",
    location: "A栋301室",
    category: "分析仪器"
  },
  {
    id: "2", 
    name: "扫描电子显微镜",
    model: "JEOL JSM-7100F",
    status: "维护中",
    location: "B栋202室",
    category: "观察仪器"
  },
  {
    id: "3",
    name: "X射线衍射仪",
    model: "Bruker D8",
    status: "可用",
    location: "C栋105室", 
    category: "结构分析"
  }
]

const mockProjects = [
  {
    id: "1",
    title: "纳米材料合成研究",
    description: "研究新型纳米材料的合成方法及其应用",
    status: "进行中",
    leader: "张教授",
    department: "材料科学系"
  },
  {
    id: "2",
    title: "环境污染检测技术",
    description: "开发高精度环境污染物检测技术",
    status: "待审核",
    leader: "李博士",
    department: "环境工程系"
  }
]

// 设备卡片示例
const EquipmentCard = ({ 
  equipment, 
  isSelected, 
  onSelect 
}: { 
  equipment: any
  isSelected?: boolean
  onSelect?: (selected: boolean) => void 
}) => {
  return (
    <ElegantCard 
      isSelected={isSelected}
      onSelectionChange={onSelect}
      className="h-full"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{equipment.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{equipment.model}</p>
          </div>
          <Badge 
            variant={equipment.status === "可用" ? "default" : "secondary"}
            className={equipment.status === "可用" ? "bg-green-100 text-green-700" : ""}
          >
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">类别:</span>
            <span>{equipment.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">位置:</span>
            <span>{equipment.location}</span>
          </div>
        </div>
      </CardContent>
    </ElegantCard>
  )
}

// 项目卡片示例
const ProjectCard = ({ 
  project, 
  isSelected, 
  onSelect 
}: { 
  project: any
  isSelected?: boolean
  onSelect?: (selected: boolean) => void 
}) => {
  return (
    <ElegantCard 
      isSelected={isSelected}
      onSelectionChange={onSelect}
      showDecoration={true}
    >
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base leading-tight">{project.title}</CardTitle>
            <Badge variant="outline">{project.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">负责人:</span>
            <span>{project.leader}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">部门:</span>
            <span>{project.department}</span>
          </div>
        </div>
      </CardContent>
    </ElegantCard>
  )
}

// 自定义卡片示例（使用 Hook）
const CustomCard = () => {
  const { isHovered, isSelected, toggleSelection, cardProps } = useElegantCardSelection()

  return (
    <div {...cardProps}>
      <ElegantCardSelection
        isHovered={isHovered}
        isSelected={isSelected}
        onToggleSelect={toggleSelection}
        className="border-2 border-dashed border-gray-300"
      >
        <CardHeader>
          <CardTitle className="text-center">自定义卡片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              这是使用 Hook 的自定义卡片
            </p>
            <p className="text-xs">
              悬停: {isHovered ? '是' : '否'} | 
              选中: {isSelected ? '是' : '否'}
            </p>
          </div>
        </CardContent>
      </ElegantCardSelection>
    </div>
  )
}

// 组件拆分使用示例
const PartialComponentCard = () => {
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
      
      <div className="pt-2">
        <h3 className="font-semibold">组件拆分使用</h3>
        <p className="text-sm text-muted-foreground mt-1">
          只使用勾选框和装饰组件的示例
        </p>
      </div>
    </div>
  )
}

export default function ElegantCardSelectionDemo() {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['1'])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const toggleEquipmentSelection = (id: string, selected: boolean) => {
    setSelectedEquipment(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(itemId => itemId !== id)
    )
  }

  const toggleProjectSelection = (id: string, selected: boolean) => {
    setSelectedProjects(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(itemId => itemId !== id)
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">优雅款卡片选中组件演示</h1>
        <p className="text-gray-600">展示如何在不同模块中使用优雅款卡片选中组件</p>
      </div>

      {/* 设备管理模块示例 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">实验室设备管理</h2>
          <p className="text-sm text-gray-600">
            已选择: {selectedEquipment.length} 台设备
            {selectedEquipment.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => setSelectedEquipment([])}
              >
                清除选择
              </Button>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEquipment.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              isSelected={selectedEquipment.includes(equipment.id)}
              onSelect={(selected) => toggleEquipmentSelection(equipment.id, selected)}
            />
          ))}
        </div>
      </section>

      {/* 项目管理模块示例 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">项目申请管理</h2>
          <p className="text-sm text-gray-600">
            已选择: {selectedProjects.length} 个项目
            {selectedProjects.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => setSelectedProjects([])}
              >
                清除选择
              </Button>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selectedProjects.includes(project.id)}
              onSelect={(selected) => toggleProjectSelection(project.id, selected)}
            />
          ))}
        </div>
      </section>

      {/* 自定义使用示例 */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">自定义使用方式</h2>
          <p className="text-sm text-gray-600">展示不同的组件使用方法</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hook 使用示例 */}
          <CustomCard />
          
          {/* 组件拆分使用 */}
          <PartialComponentCard />
          
          {/* 简单使用示例 */}
          <ElegantCard onSelectionChange={(selected) => console.log('简单卡片:', selected)}>
            <CardHeader>
              <CardTitle>简单使用</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                最简单的使用方式，内置状态管理
              </p>
            </CardContent>
          </ElegantCard>
        </div>
      </section>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>组件特点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">✨ 优雅设计</h4>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                <li>左上角浮动渐变勾选框</li>
                <li>选中时右上角装饰角标</li>
                <li>底部渐变发光效果</li>
                <li>300ms 平滑过渡动画</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔧 高度可定制</h4>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                <li>支持受控和非受控模式</li>
                <li>可以组件拆分使用</li>
                <li>支持自定义样式</li>
                <li>可控制装饰效果显示</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>使用建议:</strong> 
              这个组件特别适合需要批量操作的卡片场景，如设备管理、项目申请、文档管理等。
              组件已经过优化，支持大量卡片的流畅交互。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 