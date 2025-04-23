"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StandardsForm({ data, workSheetType, onUpdate, validationErrors }) {
  const [standardItems, setStandardItems] = useState(data?.standardItems || [])
  const [currentItem, setCurrentItem] = useState({
    id: "",
    name: "",
    description: "",
    maxScore: 10,
    weight: 1,
    required: true
  })

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Only update parent when form values actually change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate({ standardItems })
  }, [standardItems, onUpdate])

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }))
  }
  
  const addStandardItem = () => {
    if (!currentItem.name.trim()) {
      return
    }
    
    const newItem = {
      ...currentItem,
      id: Date.now().toString()
    }
    
    setStandardItems(prev => [...prev, newItem])
    setCurrentItem({
      id: "",
      name: "",
      description: "",
      maxScore: 10,
      weight: 1,
      required: true
    })
  }
  
  const removeStandardItem = (id) => {
    setStandardItems(prev => prev.filter(item => item.id !== id))
  }

  // 根据评审表类型渲染不同的标准项表单
  const renderStandardItemForm = () => {
    switch (workSheetType) {
      case "scoring": // 打分制
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name" className="flex items-center">
                  标准项名称 <span className="text-destructive ml-1">*</span>
                </Label>
                <Input 
                  id="item-name" 
                  placeholder="请输入标准项名称" 
                  value={currentItem.name}
                  onChange={(e) => handleItemChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-max-score">满分值</Label>
                <Input 
                  id="item-max-score" 
                  type="number" 
                  min="1"
                  max="100"
                  placeholder="请输入满分值" 
                  value={currentItem.maxScore}
                  onChange={(e) => handleItemChange("maxScore", parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">标准项描述</Label>
              <Textarea 
                id="item-description" 
                placeholder="请输入标准项描述" 
                rows={2}
                value={currentItem.description}
                onChange={(e) => handleItemChange("description", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-required"
                checked={currentItem.required}
                onCheckedChange={(checked) => handleItemChange("required", checked)}
              />
              <Label htmlFor="item-required">必填项</Label>
            </div>
          </div>
        );
        
      case "voting": // 投票制
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name" className="flex items-center">
                投票项名称 <span className="text-destructive ml-1">*</span>
              </Label>
              <Input 
                id="item-name" 
                placeholder="请输入投票项名称" 
                value={currentItem.name}
                onChange={(e) => handleItemChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">投票项描述</Label>
              <Textarea 
                id="item-description" 
                placeholder="请输入投票项描述" 
                rows={2}
                value={currentItem.description}
                onChange={(e) => handleItemChange("description", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-required"
                checked={currentItem.required}
                onCheckedChange={(checked) => handleItemChange("required", checked)}
              />
              <Label htmlFor="item-required">必填项</Label>
            </div>
          </div>
        );
        
      case "grading": // 等级制
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name" className="flex items-center">
                等级评估项名称 <span className="text-destructive ml-1">*</span>
              </Label>
              <Input 
                id="item-name" 
                placeholder="请输入等级评估项名称" 
                value={currentItem.name}
                onChange={(e) => handleItemChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">等级评估项描述</Label>
              <Textarea 
                id="item-description" 
                placeholder="请输入等级评估项描述" 
                rows={2}
                value={currentItem.description}
                onChange={(e) => handleItemChange("description", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-required"
                checked={currentItem.required}
                onCheckedChange={(checked) => handleItemChange("required", checked)}
              />
              <Label htmlFor="item-required">必填项</Label>
            </div>
          </div>
        );
        
      case "weighted": // 权重打分制
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name" className="flex items-center">
                  评分项名称 <span className="text-destructive ml-1">*</span>
                </Label>
                <Input 
                  id="item-name" 
                  placeholder="请输入评分项名称" 
                  value={currentItem.name}
                  onChange={(e) => handleItemChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-max-score">满分值</Label>
                <Input 
                  id="item-max-score" 
                  type="number" 
                  min="1"
                  max="100"
                  placeholder="请输入满分值" 
                  value={currentItem.maxScore}
                  onChange={(e) => handleItemChange("maxScore", parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-weight">权重设置 ({currentItem.weight})</Label>
              <Slider
                id="item-weight"
                min={0.1}
                max={5}
                step={0.1}
                value={[currentItem.weight]}
                onValueChange={(value) => handleItemChange("weight", value[0])}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">评分项描述</Label>
              <Textarea 
                id="item-description" 
                placeholder="请输入评分项描述" 
                rows={2}
                value={currentItem.description}
                onChange={(e) => handleItemChange("description", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-required"
                checked={currentItem.required}
                onCheckedChange={(checked) => handleItemChange("required", checked)}
              />
              <Label htmlFor="item-required">必填项</Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  }
  
  // 标准项列表
  const renderStandardItems = () => {
    if (standardItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          尚未添加评审标准，请添加至少一项评审标准
        </div>
      )
    }
    
    // 根据不同类型展示不同的标准项内容
    return (
      <div className="space-y-2">
        {standardItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between border rounded-md p-3">
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              {(workSheetType === "scoring" || workSheetType === "weighted") && (
                <div className="text-sm text-gray-500">
                  满分值：{item.maxScore}分
                  {workSheetType === "weighted" && ` | 权重：${item.weight}`}
                </div>
              )}
              {item.description && (
                <div className="text-sm text-gray-500 mt-1">{item.description}</div>
              )}
              {item.required && (
                <div className="mt-1"><span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">必填</span></div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700"
              onClick={() => removeStandardItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">新增评审标准</CardTitle>
          <CardDescription>
            根据{workSheetType === "scoring" ? "打分制" : 
                 workSheetType === "voting" ? "投票制" : 
                 workSheetType === "grading" ? "等级制" : "权重打分制"}评审类型添加评审标准
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          {renderStandardItemForm()}
        </CardContent>
        <CardFooter>
          <Button 
            type="button" 
            className="w-full"
            onClick={addStandardItem}
            disabled={!currentItem.name.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加评审标准
          </Button>
        </CardFooter>
      </Card>
      
      <div className="space-y-2">
        <h3 className="font-medium">已添加的评审标准</h3>
        {renderStandardItems()}
        {validationErrors?.["标准项"] && (
          <p className="text-xs text-destructive mt-1">请至少添加一项评审标准</p>
        )}
      </div>
    </div>
  )
} 