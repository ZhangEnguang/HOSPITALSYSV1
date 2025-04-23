"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const subjectItemSchema = z.object({
  subjectCode: z.string().min(1, "请选择科目"),
  subjectName: z.string().min(1, "科目名称不能为空"),
  percentage: z.coerce.number().min(0, "比例不能小于0").max(100, "比例不能大于100"),
  isRequired: z.boolean().default(false),
})

const formSchema = z.object({
  subjects: z.array(subjectItemSchema).min(1, "至少添加一个科目"),
})

export type SubjectItem = z.infer<typeof subjectItemSchema>
export type SubjectInfoFormValues = z.infer<typeof formSchema>

interface SubjectInfoFormProps {
  defaultValues?: Partial<SubjectInfoFormValues>
  onSubmit: (data: SubjectInfoFormValues) => void
  onValidationChange: (isValid: boolean) => void
}

export function SubjectInfoForm({
  defaultValues,
  onSubmit,
  onValidationChange,
}: SubjectInfoFormProps) {
  const [availableSubjects, setAvailableSubjects] = useState([
    { code: "001", name: "教材费" },
    { code: "002", name: "实验费" },
    { code: "003", name: "考试费" },
    { code: "004", name: "实习费" },
    { code: "005", name: "论文费" },
    { code: "006", name: "培训费" },
    { code: "007", name: "研究费" },
  ])

  const form = useForm<SubjectInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: defaultValues?.subjects || [],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  })

  const { formState } = form
  
  useEffect(() => {
    onValidationChange(formState.isValid)
  }, [formState.isValid, onValidationChange])

  const handleSubmit = (data: SubjectInfoFormValues) => {
    onSubmit(data)
  }

  // 获取已选科目编码列表
  const selectedSubjectCodes = fields.map((field, index) => form.getValues(`subjects.${index}.subjectCode`))

  // 处理添加科目
  const handleAddSubject = () => {
    append({ 
      subjectCode: "", 
      subjectName: "", 
      percentage: 0, 
      isRequired: false 
    })
  }

  // 处理科目选择变化
  const handleSubjectChange = (index: number, code: string) => {
    const subject = availableSubjects.find(s => s.code === code)
    if (subject) {
      form.setValue(`subjects.${index}.subjectName`, subject.name)
    }
  }

  // 计算总比例
  const totalPercentage = fields.reduce((total, _, index) => {
    const value = form.getValues(`subjects.${index}.percentage`) || 0
    return total + value
  }, 0)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <CardTitle className="text-lg">经费方案科目信息</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddSubject}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加科目
            </Button>
          </CardHeader>
          <CardContent className="px-6">
            {fields.length === 0 ? (
              <div className="flex items-center justify-center h-32 border rounded-md border-dashed border-gray-300">
                <p className="text-muted-foreground">请添加科目信息</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>科目编码</TableHead>
                    <TableHead>科目名称</TableHead>
                    <TableHead>比例(%)</TableHead>
                    <TableHead>必选</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.subjectCode`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  handleSubjectChange(index, value)
                                }} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="选择科目" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableSubjects
                                    .filter(subject => 
                                      !selectedSubjectCodes.includes(subject.code) || 
                                      field.value === subject.code
                                    )
                                    .map((subject) => (
                                      <SelectItem key={subject.code} value={subject.code}>
                                        {subject.code} - {subject.name}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.subjectName`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input {...field} disabled className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.percentage`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  min={0} 
                                  max={100} 
                                  className="w-24"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.isRequired`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex items-center">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
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
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-4 text-right">
              总比例: <span className={totalPercentage > 100 ? "text-destructive font-bold" : "font-bold"}>
                {totalPercentage}%
              </span>
              {totalPercentage > 100 && (
                <p className="text-destructive text-sm">总比例不能超过100%</p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
} 