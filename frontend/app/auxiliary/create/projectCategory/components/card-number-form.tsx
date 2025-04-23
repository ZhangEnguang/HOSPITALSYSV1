"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

// 表单校验规则
const cardNumberSchema = z.object({
  prefix: z.string().min(1, "前缀不能为空"),
  startNumber: z.string().min(1, "起始编号不能为空").regex(/^\d+$/, "请输入数字"),
  numberLength: z.string().min(1, "长度不能为空").regex(/^\d+$/, "请输入数字"),
  isEnabled: z.boolean().default(true),
  cardTypes: z.array(
    z.object({
      name: z.string().min(1, "卡类型名称不能为空"),
      code: z.string().min(1, "卡类型编码不能为空"),
    })
  ).min(1, "至少添加一种卡类型")
})

export type CardNumberFormValues = z.infer<typeof cardNumberSchema>

interface CardNumberFormProps {
  defaultValues?: Partial<CardNumberFormValues>
  onBack: () => void
  onSubmit: (values: CardNumberFormValues) => void
}

export function CardNumberForm({ defaultValues, onBack, onSubmit }: CardNumberFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CardNumberFormValues>({
    resolver: zodResolver(cardNumberSchema),
    defaultValues: {
      prefix: "",
      startNumber: "1",
      numberLength: "4",
      isEnabled: true,
      cardTypes: [{ name: "", code: "" }],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = form.control._formValues.cardTypes || []
  const cardTypesArray = form.watch("cardTypes") || []

  const addCardType = () => {
    append({ name: "", code: "" })
  }

  const removeCardType = (index: number) => {
    if (cardTypesArray.length > 1) {
      remove(index)
    }
  }

  const handleSubmit = async (values: CardNumberFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">卡号前缀</FormLabel>
                <FormControl>
                  <Input placeholder="请输入卡号前缀" {...field} />
                </FormControl>
                <FormDescription>
                  前缀将作为卡号的开头部分
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">起始编号</FormLabel>
                <FormControl>
                  <Input placeholder="请输入起始编号" {...field} />
                </FormControl>
                <FormDescription>
                  卡号将从此编号开始递增
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">编号长度</FormLabel>
                <FormControl>
                  <Input placeholder="请输入编号长度" {...field} />
                </FormControl>
                <FormDescription>
                  编号将自动补0至此长度
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base">启用状态</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">卡类型设置</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addCardType}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              添加卡类型
            </Button>
          </div>

          {form.formState.errors.cardTypes?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.cardTypes.root.message}
            </p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>序号</TableHead>
                <TableHead>卡类型名称</TableHead>
                <TableHead>卡类型编码</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardTypesArray.map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`cardTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="请输入名称" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`cardTypes.${index}.code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="请输入编码" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCardType(index)}
                      disabled={cardTypesArray.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            上一步
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "提交中..." : "下一步"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 