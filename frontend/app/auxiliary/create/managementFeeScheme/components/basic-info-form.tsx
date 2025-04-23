"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  schemeName: z.string().min(2, "方案名称至少2个字符").max(50, "方案名称不能超过50个字符"),
  schemeCode: z.string().min(2, "方案编码至少2个字符").max(20, "方案编码不能超过20个字符"),
  schemeType: z.string().min(1, "请选择方案类型"),
  validFrom: z.date({
    required_error: "请选择生效日期",
  }),
  validTo: z.date({
    required_error: "请选择失效日期",
  }).optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
})

export type BasicInfoFormValues = z.infer<typeof formSchema>

interface BasicInfoFormProps {
  data: any
  onUpdate: (data: BasicInfoFormValues) => void
  validationErrors?: Record<string, boolean>
}

export default function BasicInfoForm({
  data,
  onUpdate,
  validationErrors = {},
}: BasicInfoFormProps) {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schemeName: data?.schemeName || "",
      schemeCode: data?.schemeCode || "",
      schemeType: data?.schemeType || "",
      validFrom: data?.validFrom || new Date(),
      validTo: data?.validTo,
      description: data?.description || "",
    },
    mode: "onChange",
  })

  const { formState } = form
  
  useEffect(() => {
    // 当表单状态变化时，通知父组件
    if (formState.isDirty) {
      onUpdate(form.getValues())
    }
  }, [formState.isDirty, form, onUpdate])

  function handleSubmit(data: BasicInfoFormValues) {
    onUpdate(data)
  }

  const schemeTypes = [
    { id: "standard", name: "标准方案" },
    { id: "special", name: "特殊方案" },
    { id: "custom", name: "自定义方案" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="schemeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>方案名称 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入方案名称" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="schemeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>方案编码 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入方案编码" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schemeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>方案类型 <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择方案类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schemeTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>生效日期 <span className="text-destructive">*</span></FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>失效日期</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="请输入方案描述（选填）"
                  className="resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 