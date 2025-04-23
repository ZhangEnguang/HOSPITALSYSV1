"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InfoIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Author {
  id?: string
  name: string
  order: number
  contribution: number
  isFirstAuthor: boolean
  isCorrespondingAuthor: boolean
}

interface StepAuthorsInfoProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  validationErrors: Record<string, boolean>
}

export function StepAuthorsInfo({ formData, updateFormData, validationErrors }: StepAuthorsInfoProps) {
  const [authors, setAuthors] = useState<Author[]>(formData.authors || [])
  const [currentAuthor, setCurrentAuthor] = useState<Author>({
    name: "",
    order: authors.length + 1,
    contribution: 0,
    isFirstAuthor: authors.length === 0,
    isCorrespondingAuthor: authors.length === 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState<number>(-1)
  const [dialogOpen, setDialogOpen] = useState(false)

  // 处理作者更新
  const handleUpdateAuthors = (newAuthors: Author[]) => {
    setAuthors(newAuthors)
    updateFormData("authors", newAuthors)
    
    // 清除作者验证错误
    if (newAuthors.length > 0 && validationErrors["作者信息"]) {
      const newErrors = { ...validationErrors }
      delete newErrors["作者信息"]
      updateFormData("validationErrors", newErrors)
    }
  }

  // 添加作者
  const handleAddAuthor = () => {
    if (!currentAuthor.name.trim()) return
    
    const newAuthors = [...authors]
    
    if (isEditing && editIndex > -1) {
      // 更新已有作者
      newAuthors[editIndex] = { ...currentAuthor }
    } else {
      // 添加新作者
      newAuthors.push({ ...currentAuthor })
    }
    
    // 更新作者顺序
    const sortedAuthors = newAuthors.sort((a, b) => a.order - b.order)
    
    // 重置当前作者表单
    setCurrentAuthor({
      name: "",
      order: authors.length + (isEditing ? 0 : 1),
      contribution: 0,
      isFirstAuthor: false,
      isCorrespondingAuthor: false
    })
    
    setIsEditing(false)
    setEditIndex(-1)
    setDialogOpen(false)
    
    // 更新状态
    handleUpdateAuthors(sortedAuthors)
  }

  // 编辑作者
  const handleEditAuthor = (index: number) => {
    setIsEditing(true)
    setEditIndex(index)
    setCurrentAuthor({ ...authors[index] })
    setDialogOpen(true)
  }

  // 删除作者
  const handleDeleteAuthor = (index: number) => {
    const newAuthors = [...authors]
    newAuthors.splice(index, 1)
    
    // 重新计算顺序
    const updatedAuthors = newAuthors.map((author, idx) => ({
      ...author,
      order: idx + 1
    }))
    
    handleUpdateAuthors(updatedAuthors)
  }

  // 处理作者信息字段变更
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    setCurrentAuthor(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // 移动作者顺序
  const moveAuthor = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === authors.length - 1)) {
      return
    }
    
    const newAuthors = [...authors]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // 交换位置
    const temp = newAuthors[index];
    newAuthors[index] = newAuthors[targetIndex];
    newAuthors[targetIndex] = temp;
    
    // 更新顺序号
    const updatedAuthors = newAuthors.map((author, idx) => ({
      ...author,
      order: idx + 1
    }))
    
    handleUpdateAuthors(updatedAuthors)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <InfoIcon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">著作作者信息</h3>
      </div>

      <Card className={cn(
        "border",
        validationErrors["作者信息"] && "border-red-500"
      )}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">作者列表</h4>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false)
                    setCurrentAuthor({
                      name: "",
                      order: authors.length + 1,
                      contribution: 0,
                      isFirstAuthor: authors.length === 0,
                      isCorrespondingAuthor: authors.length === 0
                    })
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> 添加作者
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? "编辑作者" : "添加作者"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      name="name"
                      value={currentAuthor.name}
                      onChange={handleAuthorChange}
                      placeholder="请输入作者姓名"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order">排序</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        min="1"
                        value={currentAuthor.order}
                        onChange={handleAuthorChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contribution">贡献度(%)</Label>
                      <Input
                        id="contribution"
                        name="contribution"
                        type="number"
                        min="0"
                        max="100"
                        value={currentAuthor.contribution}
                        onChange={handleAuthorChange}
                        placeholder="请输入贡献度百分比"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFirstAuthor"
                        name="isFirstAuthor"
                        checked={currentAuthor.isFirstAuthor}
                        onChange={handleAuthorChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isFirstAuthor" className="text-sm">第一作者</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isCorrespondingAuthor"
                        name="isCorrespondingAuthor"
                        checked={currentAuthor.isCorrespondingAuthor}
                        onChange={handleAuthorChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isCorrespondingAuthor" className="text-sm">通讯作者</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={handleAddAuthor}>
                    {isEditing ? "更新" : "添加"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {authors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>序号</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>贡献度</TableHead>
                  <TableHead>第一作者</TableHead>
                  <TableHead>通讯作者</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.map((author, index) => (
                  <TableRow key={index}>
                    <TableCell>{author.order}</TableCell>
                    <TableCell>{author.name}</TableCell>
                    <TableCell>{author.contribution}%</TableCell>
                    <TableCell>{author.isFirstAuthor ? "是" : "否"}</TableCell>
                    <TableCell>{author.isCorrespondingAuthor ? "是" : "否"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveAuthor(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveAuthor(index, 'down')}
                          disabled={index === authors.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAuthor(index)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAuthor(index)}
                        >
                          <Trash2Icon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              暂无作者信息，请点击"添加作者"按钮添加
            </div>
          )}
          
          {validationErrors["作者信息"] && (
            <p className="text-sm text-red-500 mt-2">请至少添加一位作者</p>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstAuthorUnit" className="text-sm font-medium">
            第一作者单位
          </Label>
          <Input 
            id="firstAuthorUnit" 
            name="firstAuthorUnit" 
            placeholder="请输入第一作者单位" 
            value={formData.firstAuthorUnit || ""}
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="correspondingAuthorUnit" className="text-sm font-medium">
            通讯作者单位
          </Label>
          <Input 
            id="correspondingAuthorUnit" 
            name="correspondingAuthorUnit" 
            placeholder="请输入通讯作者单位" 
            value={formData.correspondingAuthorUnit || ""}
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
          />
        </div>
      </div>
    </div>
  )
} 