"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Dict from "@/components/dict/Dict"
import { Textarea } from "@/components/ui/textarea"

// 表单校验规则
const budgetItemSchema = z.object({
  name: z.string().min(1, "预算标准名称不能为空"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  note: z.string().optional(),
})

const budgetInfoSchema = z.object({
  budgetItems: z.array(budgetItemSchema).min(1, "至少添加一个预算标准"),
})

export type BudgetInfoFormValues = z.infer<typeof budgetInfoSchema>

interface BudgetInfoFormProps {
  initialData?: Partial<BudgetInfoFormValues>
  onSubmit?: (values: BudgetInfoFormValues) => void
  onUpdate?: (values: BudgetInfoFormValues) => void
  validationErrors?: Record<string, boolean>
}

export function BudgetInfoForm({ initialData, onSubmit, onUpdate, validationErrors }: BudgetInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  // 标记首次渲染
  const isFirstRender = useRef(true)
  // 添加处理状态标记
  const isProcessingChange = useRef(false)

  const form = useForm<BudgetInfoFormValues>({
    resolver: zodResolver(budgetInfoSchema),
    defaultValues: {
      budgetItems: initialData?.budgetItems || [{
        name: "",
        startDate: "",
        endDate: "",
        note: "",
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "budgetItems",
  })

  // 当表单值变化时调用onUpdate回调
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (onUpdate) {
      const currentValues = form.getValues();
      console.log("预算表单值变化，当前值:", currentValues);
      onUpdate(currentValues);
    }
  }, [form.watch(), onUpdate]);

  const handleSubmit = async (values: BudgetInfoFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit?.(values)
    } finally {
      setIsLoading(false)
    }
  }

  const addBudgetItem = () => {
    append({
      name: "",
      startDate: "",
      endDate: "",
      note: "",
    })
  }

  const removeBudgetItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  // 在表单中添加直接处理Dict选择的函数
  const handleDictChange = (index: number, value: any) => {
    if (isProcessingChange.current) return;
    
    try {
      isProcessingChange.current = true;
      // 处理函数类型的参数
      if (typeof value === 'function') {
        // 创建一个临时对象来模拟函数执行
        const fieldName = `budgetItems.${index}.name`;
        const tempObj = { [fieldName]: form.getValues(`budgetItems.${index}.name`) };
        // 执行函数获取实际值
        const result = value(tempObj);
        // 提取出字段对应的值并设置
        const updatedValue = result[fieldName];
        form.setValue(`budgetItems.${index}.name`, updatedValue);
      } else {
        // 直接设置表单值
        form.setValue(`budgetItems.${index}.name`, value);
      }
    } finally {
      // 确保处理标记被重置
      setTimeout(() => {
        isProcessingChange.current = false;
      }, 100);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">预算标准设置</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addBudgetItem}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              添加预算标准
            </Button>
          </div>

          {form.formState.errors.budgetItems?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.budgetItems.root.message}
            </p>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">预算标准名称</TableHead>
                  <TableHead>开始时间</TableHead>
                  <TableHead>结束时间</TableHead>
                  <TableHead>备注</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`budgetItems.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Dict 
                                dictCode="budget_standard"
                                displayType="select"
                                value={field.value}
                                setFormData={(value) => handleDictChange(index, value)}
                                placeholder="请选择预算标准"
                                className="w-full"
                                field={`budgetItems.${index}.name`}
                              />
                            </FormControl>
                            {form.formState.errors.budgetItems?.[index]?.name && (
                              <p className="text-sm text-destructive mt-1">
                                {form.formState.errors.budgetItems[index]?.name?.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`budgetItems.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-0">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "yyyy-MM-dd")
                                    ) : (
                                      <span>选择开始日期</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`budgetItems.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-0">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "yyyy-MM-dd")
                                    ) : (
                                      <span>选择结束日期</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`budgetItems.${index}.note`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <Textarea
                                placeholder="请输入备注"
                                className="min-h-9 resize-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBudgetItem(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </form>
    </Form>
  )
} 