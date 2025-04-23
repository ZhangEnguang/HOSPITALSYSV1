"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  applicableJournalSource: z.string().min(1, "请选择适用期刊源"),
  isIndexed: z.boolean().default(false),
  impactFactorRequired: z.boolean().default(false),
  impactFactorMin: z.string().optional(),
  quartileRequired: z.boolean().default(false),
  preferredQuartile: z.string().optional(),
  additionalRequirements: z.string().optional(),
})

export type JournalSourceFormValues = z.infer<typeof formSchema>

interface JournalSourceFormProps {
  data: any
  onUpdate: (data: JournalSourceFormValues) => void
  validationErrors?: Record<string, boolean>
}

export default function JournalSourceForm({
  data,
  onUpdate,
  validationErrors = {},
}: JournalSourceFormProps) {
  const form = useForm<JournalSourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicableJournalSource: data?.applicableJournalSource || "",
      isIndexed: data?.isIndexed || false,
      impactFactorRequired: data?.impactFactorRequired || false,
      impactFactorMin: data?.impactFactorMin || "",
      quartileRequired: data?.quartileRequired || false,
      preferredQuartile: data?.preferredQuartile || "",
      additionalRequirements: data?.additionalRequirements || "",
    },
    mode: "onChange",
  })

  const { formState, watch } = form
  const isIndexedValue = watch("isIndexed")
  const impactFactorRequiredValue = watch("impactFactorRequired")
  const quartileRequiredValue = watch("quartileRequired")
  
  useEffect(() => {
    // 当表单状态变化时，通知父组件
    if (formState.isDirty) {
      onUpdate(form.getValues())
    }
  }, [formState.isDirty, form, onUpdate])

  function handleSubmit(data: JournalSourceFormValues) {
    onUpdate(data)
  }

  // 期刊源选项
  const journalSourceOptions = [
    { value: "SCI", label: "SCI" },
    { value: "SSCI", label: "SSCI" },
    { value: "CSSCI", label: "CSSCI" },
    { value: "EI", label: "EI" },
    { value: "其他", label: "其他" },
  ]

  // 四分位选项
  const quartileOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="applicableJournalSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>适用期刊源 <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择适用期刊源" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {journalSourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isIndexed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">是否为收录期刊</FormLabel>
                  <FormDescription>
                    标记为收录期刊将有不同的评价标准
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isIndexedValue && (
            <Card className="border-muted-foreground/20">
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="impactFactorRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">影响因子要求</FormLabel>
                        <FormDescription>
                          是否要求期刊具有最低影响因子
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {impactFactorRequiredValue && (
                  <FormField
                    control={form.control}
                    name="impactFactorMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最低影响因子</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" min="0" placeholder="请输入最低影响因子要求" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="quartileRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">分区要求</FormLabel>
                        <FormDescription>
                          是否要求期刊满足特定分区条件
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {quartileRequiredValue && (
                  <FormField
                    control={form.control}
                    name="preferredQuartile"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>优选分区</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            {quartileOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label htmlFor={option.value}>{option.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          )}

          <FormField
            control={form.control}
            name="additionalRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>附加要求</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入附加要求（选填）"
                    className="resize-none h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
} 