"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PlusCircle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 发明人信息验证模式
const inventorSchema = z.object({
  name: z.string().min(1, { message: "请输入发明人姓名" }),
  unit: z.string().min(1, { message: "请输入发明人单位" }),
  contribution: z.string().min(1, { message: "请输入贡献率" }),
  order: z.number().int().positive({ message: "顺序必须是正整数" }),
})

export type InventorData = z.infer<typeof inventorSchema>

// 发明人列表验证模式
const inventorsSchema = z.array(inventorSchema).min(1, { message: "至少需要一名发明人" })

export type InventorsFormData = z.infer<typeof inventorsSchema>

interface InventorFormProps {
  initialData?: InventorsFormData
  onSubmit: (data: InventorsFormData) => void
  onBack: () => void
}

export function InventorForm({ initialData, onSubmit, onBack }: InventorFormProps) {
  const [inventors, setInventors] = useState<InventorsFormData>(initialData || [])
  const [isAddingNew, setIsAddingNew] = useState(false)

  // 单个发明人表单
  const newInventorForm = useForm<InventorData>({
    resolver: zodResolver(inventorSchema),
    defaultValues: {
      name: "",
      unit: "",
      contribution: "",
      order: inventors.length + 1,
    },
  })

  // 整体表单验证
  const form = useForm<{ inventors: InventorsFormData }>({
    resolver: zodResolver(z.object({
      inventors: inventorsSchema,
    })),
    defaultValues: {
      inventors: inventors,
    },
  })

  // 添加发明人
  const handleAddInventor = (data: InventorData) => {
    const updatedInventors = [...inventors, data]
    setInventors(updatedInventors)
    form.setValue("inventors", updatedInventors)
    setIsAddingNew(false)
    newInventorForm.reset({
      name: "",
      unit: "",
      contribution: "",
      order: updatedInventors.length + 1,
    })
  }

  // 删除发明人
  const handleRemoveInventor = (index: number) => {
    const updatedInventors = inventors.filter((_, i) => i !== index)
    // 更新顺序号
    const reorderedInventors = updatedInventors.map((inv, i) => ({
      ...inv,
      order: i + 1,
    }))
    setInventors(reorderedInventors)
    form.setValue("inventors", reorderedInventors)
  }

  // 表单提交
  const handleSubmit = (data: { inventors: InventorsFormData }) => {
    onSubmit(data.inventors)
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">发明人列表</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingNew(true)}
                disabled={isAddingNew}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                添加发明人
              </Button>
            </div>

            {inventors.length === 0 && !isAddingNew && (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">尚未添加发明人信息</p>
              </div>
            )}

            {inventors.map((inventor, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">
                      发明人 {inventor.order}：{inventor.name}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInventor(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">姓名</p>
                      <p>{inventor.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">单位</p>
                      <p>{inventor.unit}</p>
                    </div>
                    <div>
                      <p className="font-medium">贡献率</p>
                      <p>{inventor.contribution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {isAddingNew && (
              <Form {...newInventorForm}>
                <form onSubmit={newInventorForm.handleSubmit(handleAddInventor)}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">添加新发明人</CardTitle>
                      <CardDescription>
                        请填写发明人的详细信息
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={newInventorForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>姓名</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入发明人姓名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={newInventorForm.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>单位</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入发明人单位" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={newInventorForm.control}
                          name="contribution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>贡献率</FormLabel>
                              <FormControl>
                                <Input placeholder="例如: 30%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={newInventorForm.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>顺序</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  value={field.value.toString()}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
                      >
                        取消
                      </Button>
                      <Button type="submit">添加</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            )}

            {inventors.length > 0 && !isAddingNew && (
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                  上一步
                </Button>
                <Button type="submit">下一步</Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
} 