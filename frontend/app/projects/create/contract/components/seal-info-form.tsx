"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, X, Stamp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { nanoid } from "nanoid"

interface SealInfoFormProps {
  data: {
    sealDocuments?: SealDocument[]
  }
  onUpdate: (data: { sealDocuments: SealDocument[] }) => void
  validationErrors: Record<string, boolean>
}

interface SealDocument {
  id: string
  file: string
  count: string
  school: string
  type: string
}

export default function SealInfoForm({ data, onUpdate, validationErrors }: SealInfoFormProps) {
  const [formValues, setFormValues] = useState({
    sealDocuments: data?.sealDocuments || [],
  })

  // 新文档表单状态
  const [newDocument, setNewDocument] = useState<Partial<SealDocument>>({
    file: "",
    count: "1",
    school: "",
    type: "",
  })

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Only update parent when form values actually change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    onUpdate(formValues)
  }, [formValues, onUpdate])

  const handleFileUpload = () => {
    // 调用隐藏的文件输入元素
    document.getElementById('file-upload-input')?.click();
  }

  // 添加实际处理文件选择的函数
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const mockFileName = file.name;
      
      setNewDocument({
        ...newDocument,
        file: mockFileName
      });
      
      toast({
        title: "文件上传成功",
        description: `已上传文件: ${mockFileName}`,
      });
      
      // 重置输入，允许选择相同文件
      e.target.value = '';
    }
  }

  const handleAddDocument = () => {
    // 验证表单字段
    if (!newDocument.file || !newDocument.count || !newDocument.school || !newDocument.type) {
      toast({
        title: "表单验证失败",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    // 验证数量为正整数
    const count = parseInt(newDocument.count, 10)
    if (isNaN(count) || count <= 0) {
      toast({
        title: "数量无效",
        description: "用章数量必须是正整数",
        variant: "destructive",
      })
      return
    }

    // 添加文档，确保所有必需字段都有值
    const newDocumentWithId: SealDocument = {
      id: nanoid(),
      file: newDocument.file || "",
      count: newDocument.count || "1",
      school: newDocument.school || "",
      type: newDocument.type || ""
    }
    
    const updatedDocuments = [
      ...formValues.sealDocuments,
      newDocumentWithId
    ]
    
    // 更新表单状态
    setFormValues({
      ...formValues,
      sealDocuments: updatedDocuments
    })
    
    // 更新父组件
    onUpdate({ sealDocuments: updatedDocuments })
    
    // 重置表单
    setNewDocument({
      file: "",
      count: "1",
      school: "",
      type: ""
    })
  }

  const handleRemoveDocument = (id: string) => {
    setFormValues({
      ...formValues,
      sealDocuments: formValues.sealDocuments.filter(doc => doc.id !== id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <Stamp className="h-5 w-5" />
        </div>
        <h3 className="text-base font-medium">用章信息(单位: 个数)</h3>
      </div>

      {/* 添加新记录表单 */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <h4 className="font-medium text-gray-700 mb-4">添加用章文档</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sealDocument" className="flex items-center">
              用章文档 <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="sealDocument"
                value={newDocument.file}
                readOnly
                placeholder="请上传用章文档"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleFileUpload}
                size="sm"
                className="whitespace-nowrap"
              >
                上传
              </Button>
              {/* 添加隐藏的文件输入元素 */}
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleFileSelected}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sealCount" className="flex items-center">
              用章数量 <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="sealCount"
              type="number"
              min="1"
              value={newDocument.count}
              onChange={(e) => setNewDocument({ ...newDocument, count: e.target.value })}
              placeholder="请输入数量"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sealSchool" className="flex items-center">
              所属单位 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={newDocument.school} 
              onValueChange={(value) => setNewDocument({ ...newDocument, school: value })}
            >
              <SelectTrigger id="sealSchool">
                <SelectValue placeholder="请选择所属单位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="天文系">天文系</SelectItem>
                <SelectItem value="物理系">物理系</SelectItem>
                <SelectItem value="化学系">化学系</SelectItem>
                <SelectItem value="生物系">生物系</SelectItem>
                <SelectItem value="计算机系">计算机系</SelectItem>
                <SelectItem value="地球科学系">地球科学系</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sealType" className="flex items-center">
              用章类型 <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={newDocument.type} 
              onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
            >
              <SelectTrigger id="sealType">
                <SelectValue placeholder="请选择用章类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="校章">校章</SelectItem>
                <SelectItem value="科研合同章">科研合同章</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            type="button"
            onClick={handleAddDocument}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> 添加文档
          </Button>
        </div>
      </div>

      {/* 用章文档列表 */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-16 text-center">序号</TableHead>
              <TableHead>用章文档</TableHead>
              <TableHead className="w-20 text-center">合计</TableHead>
              <TableHead className="w-24 text-center">校章</TableHead>
              <TableHead className="w-32 text-center">科研合同章</TableHead>
              <TableHead className="w-20 text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formValues.sealDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  暂无用章文档，请添加
                </TableCell>
              </TableRow>
            ) : (
              formValues.sealDocuments.map((doc: SealDocument, index: number) => (
                <TableRow key={doc.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{doc.file}</div>
                    <div className="text-sm text-muted-foreground">{doc.school}</div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{doc.count}</TableCell>
                  <TableCell className="text-center">
                    {doc.type === "校章" && (
                      <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700">✓</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {doc.type === "科研合同章" && (
                      <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700">✓</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 