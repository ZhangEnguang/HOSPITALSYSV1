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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// 表单校验架构
export const detailInfoSchema = z.object({
  applicableScenarios: z.array(z.string()).min(1, { message: "请至少选择一个适用场景" }),
  approvalRequired: z.boolean().default(true),
  approvalLevel: z.string().min(1, { message: "请选择审批级别" }).optional(),
  validityPeriod: z.number().int().min(1, { message: "有效期必须大于0" }).optional(),
  maxUsageCount: z.number().int().min(1, { message: "最大使用次数必须大于0" }).optional(),
  restrictDepartments: z.boolean().default(false),
  allowedDepartments: z.array(z.string()).optional(),
  usageNotes: z.string().optional(),
})

// 导出表单值类型
export type DetailInfoFormValues = z.infer<typeof detailInfoSchema>

// 表单属性类型
interface DetailInfoFormProps {
  data?: Partial<DetailInfoFormValues>
  onUpdate?: (data: DetailInfoFormValues) => void
}

export default function DetailInfoForm({
  data = {},
  onUpdate,
}: DetailInfoFormProps) {
  // 适用场景选项
  const scenarioOptions = [
    { id: "contract", label: "合同签订" },
    { id: "financial", label: "财务报销" },
    { id: "certificate", label: "证明文件" },
    { id: "official", label: "公文处理" },
    { id: "invitation", label: "邀请函件" },
    { id: "application", label: "申请材料" },
    { id: "other", label: "其他场景" },
  ]

  // 审批级别选项
  const approvalLevelOptions = [
    { value: "department", label: "部门审批" },
    { value: "school", label: "学院审批" },
    { value: "university", label: "学校审批" },
  ]

  // 部门选项
  const departmentOptions = [
    { id: "hr", label: "人事处" },
    { id: "finance", label: "财务处" },
    { id: "academic", label: "教务处" },
    { id: "student", label: "学生处" },
    { id: "international", label: "国际交流处" },
    { id: "research", label: "科研处" },
  ]

  // 表单默认值
  const defaultValues: Partial<DetailInfoFormValues> = {
    applicableScenarios: [],
    approvalRequired: true,
    approvalLevel: "",
    validityPeriod: 30,
    maxUsageCount: 1,
    restrictDepartments: false,
    allowedDepartments: [],
    usageNotes: "",
    ...data,
  }

  // 初始化表单
  const form = useForm<DetailInfoFormValues>({
    resolver: zodResolver(detailInfoSchema),
    defaultValues,
  })

  // 监听表单值变化并更新父组件
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (onUpdate) {
        onUpdate(value as DetailInfoFormValues)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, onUpdate])

  // 监听审批要求切换
  const approvalRequired = form.watch("approvalRequired")
  
  // 监听部门限制切换
  const restrictDepartments = form.watch("restrictDepartments")

  return (
    <Form {...form}>
      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">适用场景</h3>
              <p className="text-sm text-muted-foreground">
                选择该用章类型适用的业务场景
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="applicableScenarios"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {scenarioOptions.map((scenario) => (
                      <FormField
                        key={scenario.id}
                        control={form.control}
                        name="applicableScenarios"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={scenario.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(scenario.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, scenario.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== scenario.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {scenario.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">审批设置</h3>
              <p className="text-sm text-muted-foreground">
                配置该用章类型的审批要求
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="approval-required">需要审批</Label>
                  <p className="text-sm text-muted-foreground">
                    是否需要审批流程才能使用此类型的用章
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="approvalRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          id="approval-required"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {approvalRequired && (
                <FormField
                  control={form.control}
                  name="approvalLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>审批级别</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择审批级别" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvalLevelOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        选择需要哪个级别的管理员进行审批
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">使用限制</h3>
              <p className="text-sm text-muted-foreground">
                设置该用章类型的使用限制条件
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="validityPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>有效期（天）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          field.onChange(isNaN(value) ? "" : value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      设置用章申请通过后的有效使用天数
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUsageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大使用次数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          field.onChange(isNaN(value) ? "" : value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      单次申请允许的最大用章次数
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="restrict-departments">限制使用部门</Label>
                  <p className="text-sm text-muted-foreground">
                    是否限制特定部门才能申请使用此类型的用章
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="restrictDepartments"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          id="restrict-departments"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {restrictDepartments && (
                <FormField
                  control={form.control}
                  name="allowedDepartments"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {departmentOptions.map((department) => (
                          <FormField
                            key={department.id}
                            control={form.control}
                            name="allowedDepartments"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={department.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(department.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], department.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== department.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {department.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormDescription>
                        选择允许申请使用此类型用章的部门
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="usageNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>使用说明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入该用章类型的使用说明与注意事项"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                输入关于此用章类型的使用说明、注意事项或特殊要求
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
} 