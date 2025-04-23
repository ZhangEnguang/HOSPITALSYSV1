"use client"

import { useEffect, useState, useRef } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { get } from "@/lib/api"
import { Checkbox } from "@/components/ui/checkbox"
import Dict from "@/components/dict/Dict"

// 表单校验规则
const formSchema = z.object({
  name: z.string().min(2, {
    message: "名称至少需要2个字符",
  }),
  code: z.string().min(2, {
    message: "分类编号至少需要2个字符",
  }),
  projectLevel: z.string({
    required_error: "请选择项目级别",
  }),
  category: z.string({
    required_error: "请选择项目类别",
  }),
  parentId: z.string().optional(),
  isUsed: z.boolean().default(true),
  note: z.string().optional(),
  feeCode: z.string().optional(),
  eduStatistics: z.string().optional(),
  projectSource: z.string().optional(),
  paymentSource: z.string().optional(),
  budgetControl: z.boolean().default(false),
})

export type FormValues = z.infer<typeof formSchema>



interface BasicInfoFormProps {
  initialData?: Partial<FormValues>
  onSubmit?: (data: FormValues) => void  // 保留向后兼容性
  onUpdate?: (data: FormValues) => void  // 新增数据更新回调
  isLoading?: boolean
  isGeneratingCode?: boolean
  parentName?: string | null
  parentId?: string | null
  isCreatingChild?: boolean
  validationErrors?: Record<string, boolean>
}

export function BasicInfoForm({
  initialData,
  onSubmit,
  onUpdate,
  isLoading = false,
  isGeneratingCode = false,
  parentName = null,
  parentId = null,
  isCreatingChild = false,
  validationErrors = {},
}: BasicInfoFormProps) {
  const { toast } = useToast()
  const [parentCategories, setParentCategories] = useState<Array<{id: string, name: string}>>([])
  const [projectLevelOptions, setProjectLevelOptions] = useState<Array<{value: string, label: string}>>([])
  const [generating, setGenerating] = useState(false)
  // 使用ref标记首次渲染，避免无意义的更新
  const isFirstRender = useRef(true)


  // 添加表单数据状态
  const [formData, setFormData] = useState<FormValues>({
    name: initialData?.name || "",
    code: initialData?.code || "",
    projectLevel: initialData?.projectLevel || "",
    category: initialData?.category || "",
    parentId: parentId || "",
    isUsed: initialData?.isUsed !== undefined ? initialData.isUsed : true,
    note: initialData?.note || "",
    feeCode: initialData?.feeCode || "",
    eduStatistics: initialData?.eduStatistics || "",
    projectSource: initialData?.projectSource || "",
    paymentSource: initialData?.paymentSource || "",
    budgetControl: initialData?.budgetControl !== undefined ? initialData.budgetControl : false,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      projectLevel: "",
      category: "",
      parentId: parentId || "",
      isUsed: true,
      note: "",
      feeCode: "",
      eduStatistics: "",
      projectSource: "",
      paymentSource: "",
      budgetControl: false,
    },
  })

  // 当表单数据更新时，同步到react-hook-form
  useEffect(() => {
    // 仅当有实际数据变化且不是首次渲染时更新表单
    if (formData && Object.keys(formData).length > 0) {
      form.setValue("name", formData.name || "");
      form.setValue("code", formData.code || "");
      form.setValue("parentId", formData.parentId || undefined);
      form.setValue("projectLevel", formData.projectLevel || "");
      form.setValue("category", formData.category || "");
      form.setValue("isUsed", formData.isUsed || true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // 移除formData依赖，只在组件挂载时执行一次

  // 当表单值变化时通知父组件
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (onUpdate) {
      const currentValues = form.getValues();
      onUpdate(currentValues);
    }
  }, [form.watch(), onUpdate]);

  // 用于Dict组件的setFormData
  const setDictFormData = (updater: any) => {
    if (typeof updater === 'function') {
      setFormData(prev => {
        try {
          // 创建一个临时对象，模拟updater函数的运行结果
          const tempData = updater(prev);
          const newValues = { ...prev, ...tempData };
          
          // 如果category发生变化，更新form并触发编码生成
          if (tempData.category && tempData.category !== prev.category) {
            console.log("项目类别变更通过setFormData触发: ", tempData.category);
            // 更新表单值
            form.setValue("category", tempData.category);
            // 异步调用，避免阻塞状态更新
            setTimeout(() => {
              handleCategoryChange(tempData.category);
            }, 100);
          }
          
          // 处理项目级别变更
          if (tempData.projectLevel && tempData.projectLevel !== prev.projectLevel) {
            console.log("项目级别变更通过setFormData触发: ", tempData.projectLevel);
            // 更新表单值
            form.setValue("projectLevel", tempData.projectLevel);
          }
          
          return newValues;
        } catch (error) {
          console.error("处理Dict组件数据出错:", error);
          return prev;
        }
      });
    }
  };

  // 预加载项目级别字典数据
  useEffect(() => {
    // 加载项目级别字典
    loadProjectLevelDictionary()
  }, []);
  
  // 初始化时加载父分类和字典数据
  useEffect(() => {
    // 如果是创建子分类，则加载父分类数据
    if (isCreatingChild) {
      loadParentCategories()
    }
    
    console.log("基本信息表单已加载，初始值:", form.getValues());
    
    // 标记首次渲染完成
    isFirstRender.current = false;
  }, [isCreatingChild]);

  useEffect(() => {
    // 如果是创建子分类，则加载父分类数据
    if (isCreatingChild) {
      loadParentCategories()
    }
    
    // 打印初始表单数据
    const initialValues = form.getValues();
    console.log("基本信息表单已加载，初始值:", initialValues);
    
    // 如果是子分类，特别检查category值
    if (isCreatingChild) {
      const categoryValue = initialValues.category;
      console.log("子分类的category值:", categoryValue);
      
      // 如果category为空但有initialData，尝试从initialData获取
      if (!categoryValue && initialData?.category) {
        console.log("从initialData获取category值:", initialData.category);
        form.setValue("category", initialData.category);
      }
    }
    
    // 标记首次渲染完成
    isFirstRender.current = false;
  }, [isCreatingChild, initialData]);
  
  // 添加额外的监听effect，确保category值变化时更新表单
  useEffect(() => {
    if (initialData?.category && form.getValues().category !== initialData.category) {
      console.log("检测到category值不一致，从initialData更新:", initialData.category);
      form.setValue("category", initialData.category);
      // 如果是子分类创建，确保类别值立即显示
      if (isCreatingChild) {
        setTimeout(() => {
          console.log("子分类创建时强制更新表单值:", initialData.category);
          const currentValue = form.getValues().category;
          console.log("当前表单category值:", currentValue);
        }, 100);
      }
    }
  }, [initialData?.category]);

  // 确保字典组件加载
  useEffect(() => {
    console.log("初始化字典组件");
    
    // 检查当前的项目类别值
    const currentCategory = form.getValues().category;
    console.log("当前项目类别值:", currentCategory);
    
    // 如果已有值且为编辑模式，生成编码
    if (currentCategory && initialData?.code) {
      console.log("编辑模式，已有项目类别:", currentCategory);
    }
  }, []);

  // 加载项目级别字典数据
  const loadProjectLevelDictionary = async () => {
    try {
      // 调用字典API获取项目级别选项
      const response = await get('/api/dictionary/items', {
        params: { code: 'project_level' }
      })
      
      if (response && response.code === 200 && response.data) {
        const options = response.data.map((item: any) => ({
          value: item.value,
          label: item.label
        }))
        setProjectLevelOptions(options)
      } else {
        // 如果API调用失败，设置默认选项
        setProjectLevelOptions([
          { value: "national", label: "国家级" },
          { value: "provincial", label: "省部级" },
          { value: "municipal", label: "市厅级" },
          { value: "school", label: "校级" }
        ])
      }
    } catch (error) {
      console.error("加载项目级别字典失败", error)
      // 加载失败时使用默认值
      setProjectLevelOptions([
        { value: "national", label: "国家级" },
        { value: "provincial", label: "省部级" },
        { value: "municipal", label: "市厅级" },
        { value: "school", label: "校级" }
      ])
    }
  }

  // 加载一级分类列表
  const loadParentCategories = async () => {
    try {
      // 使用项目中的API工具类获取一级分类列表
      const response = await get('/api/project/projectType/list', {
        params: { page: 1, pageSize: 100 }  // 加载所有可能的父分类
      })
      
      if (response && response.code === 200 && response.data) {
        // 转换为前端需要的格式
        const categories = response.data.records?.map((item: any) => ({
          id: item.code, // 使用code作为id
          name: item.name
        })) || [];
        setParentCategories(categories)
      }
    } catch (error) {
      console.error("加载父分类失败", error)
      toast({
        title: "错误",
        description: "加载父分类失败",
        variant: "destructive",
      })
    }
  }

  // 当项目类别变化时生成编码
  const handleCategoryChange = async (value: string | undefined) => {
    if (!value) return;
    
    console.log("项目类别变更为:", value, "开始请求生成分类编号");
    try {
      setGenerating(true);
      // 构建API URL
      const apiUrl = `/api/project/projectType/generateCode?category=${value}${parentId ? `&parentId=${parentId}` : ''}`;
      console.log("请求API地址:", apiUrl);
      
      // 添加延迟，确保请求在状态更新后发送
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 调用API获取编码
      const response = await get(apiUrl);
      console.log("API响应结果:", response);
      
      if (response && response.code === 200 && response.data) {
        // 更新编码字段
        console.log("获取到编码:", response.data);
        // 使用setFormData更新状态
        setFormData(prev => ({
          ...prev,
          code: response.data
        }));
        
        // 同时更新form的值
        form.setValue("code", response.data);
      } else {
        console.error("API返回错误:", response);
        toast({
          title: "自动生成编码失败",
          description: response?.message || "服务器返回格式不正确，请联系管理员",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("生成编码请求异常:", error);
      toast({
        title: "自动生成编码失败",
        description: "请求服务器出现异常，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // 处理表单字段变化
  const handleChange = (field: keyof FormValues, value: any) => {
    console.log(`字段 ${field} 变更为:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    form.setValue(field, value);
    
    // 如果有onUpdate回调，通知父组件
    if (onUpdate) {
      const currentValues = form.getValues();
      onUpdate({
        ...currentValues,
        [field]: value
      });
    }
  };

  // 为子分类自动生成编码
  useEffect(() => {
    // 只在创建子分类模式下执行
    if (isCreatingChild && initialData?.category) {
      // 确保category已经有值
      const categoryValue = initialData.category;
      console.log("子分类检测到category值，准备自动生成编码:", categoryValue);
      
      // 添加延迟确保表单完全加载
      setTimeout(() => {
        // 手动调用handleCategoryChange函数生成编码
        handleCategoryChange(categoryValue);
      }, 500);
    }
  }, [isCreatingChild, initialData?.category]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  名称 <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="请输入项目分类名称" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("name", e.target.value);
                    }}
                    className={validationErrors?.["名称"] ? "border-destructive" : ""}
                  />
                </FormControl>
                <FormMessage />
                {validationErrors?.["名称"] && (
                  <p className="text-xs text-destructive mt-1">请输入项目分类名称</p>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              console.log("渲染category字段, 当前值:", field.value);
              
              return (
                <FormItem>
                  <FormLabel className="flex items-center">
                    项目类别 <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    
                      <Dict 
                        dictCode="project_type"
                        displayType="select"
                        value={field.value}
                        field="category" 
                        setFormData={setDictFormData}
                        placeholder="请选择项目类别"
                        className={validationErrors?.["项目类别"] ? "border-destructive" : ""}
                        disabled={isCreatingChild}
                      />
                  
                  </FormControl>
                  <FormMessage />
                  {isCreatingChild && (
                    <FormDescription>
                      子分类的项目类别与父分类保持一致，不可更改
                      {!field.value && <strong className="text-orange-500">（加载中...）</strong>}
                    </FormDescription>
                  )}
                  {validationErrors?.["项目类别"] && (
                    <p className="text-xs text-destructive mt-1">请选择项目类别</p>
                  )}
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  分类编号 <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      placeholder="选择项目类别后自动生成" 
                      {...field} 
                      readOnly 
                      className={`bg-muted/50 cursor-not-allowed ${validationErrors?.["编码"] ? "border-destructive" : ""}`}
                    />
                  </FormControl>
                  {(isGeneratingCode || generating) && (
                    <div className="absolute right-3 top-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <FormDescription>
                  {parentName 
                    ? `正在创建"${parentName}"的子分类`
                    : "分类编号将根据选择的项目类别自动生成"
                  }
                </FormDescription>
                <FormMessage />
                {validationErrors?.["编码"] && (
                  <p className="text-xs text-destructive mt-1">请先选择项目类别生成编码</p>
                )}
              </FormItem>
            )}
          />

          {/* 只在创建子分类时显示上级分类字段 */}
          {isCreatingChild && (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    上级分类 <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input value={parentName || ''} disabled className="bg-muted" />
                  </FormControl>
                  <FormDescription>子分类的上级分类不可更改</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="projectLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  项目级别 <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Dict 
                    dictCode="project_level"
                    displayType="select"
                    value={field.value}
                    field="projectLevel"
                    setFormData={setDictFormData}
                    placeholder="请选择项目级别"
                    className={validationErrors?.["项目级别"] ? "border-destructive" : ""}
                  />
                </FormControl>
                <FormMessage />
                {validationErrors?.["项目级别"] && (
                  <p className="text-xs text-destructive mt-1">请选择项目级别</p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>财务账号</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入财务账号"
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("feeCode", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eduStatistics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>教育部统计归属</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入教育部统计归属"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("eduStatistics", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>项目来源</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入项目来源"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("projectSource", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>支付来源</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入支付来源"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange("paymentSource", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budgetControl"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      handleChange("budgetControl", value);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    预算管控
                  </FormLabel>
                  <FormDescription>
                    开启后将对该分类的项目进行预算管控
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  启用状态 <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                      handleChange("isUsed", boolValue);
                    }}
                    defaultValue="true"
                    value={field.value ? "true" : "false"}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="enabled-true" />
                      <FormLabel htmlFor="enabled-true" className="font-normal">
                        启用
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="enabled-false" />
                      <FormLabel htmlFor="enabled-false" className="font-normal">
                        停用
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入备注信息"
                  className="resize-none"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange("note", e.target.value);
                  }}
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