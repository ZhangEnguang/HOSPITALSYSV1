import { ReactNode } from "react"

// 基础字段定义
export type Material = {
  id: string
  name: string
  description: string
}

export type KeyDate = {
  id: string
  name: string
  date: Date
}

export type Requirement = {
  id: string
  content: string
}

export type Attachment = {
  id: string
  name: string
  size: number
  type: string
}

// 表单数据类型
export type ApplicationFormData = {
  name: string
  description: string
  type: string
  category: string
  startDate: Date
  endDate: Date
  amount: number
  autoEnd: string
  canReview: string
  hasQuota: string
  guide: string
  template: string
  materials: Material[]
  keyDates: KeyDate[]
  requirements: Requirement[]
  notes: string
  [key: string]: any // 允许额外字段
}

// 步骤定义
export type Step = {
  id: number
  name: string
  description: string
  component?: ReactNode
}

// 字段验证配置
export type ValidationConfig = {
  [key: string]: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    customValidator?: (value: any) => boolean
  }
}

// 表单模式
export enum FormMode {
  CREATE = "create",
  EDIT = "edit",
  VIEW = "view"
}

// 表单组件属性
export interface ApplicationFormProps {
  // 表单模式
  mode?: FormMode
  
  // 初始数据
  initialData?: ApplicationFormData
  
  // 自定义步骤配置
  steps?: Step[]
  
  // 字段验证配置
  validationConfig?: ValidationConfig
  
  // 回调函数
  onSubmit?: (data: ApplicationFormData) => Promise<void>
  onSaveDraft?: (data: ApplicationFormData) => Promise<void>
  onCancel?: () => void
  
  // 自定义标题
  title?: string
  
  // 是否显示模板选择
  showTemplateSelector?: boolean
  
  // 自定义URL返回路径
  returnUrl?: string
  
  // 禁用的字段（仅在VIEW或EDIT模式有效）
  disabledFields?: string[]
  
  // 隐藏的字段
  hiddenFields?: string[]
  
  // 隐藏的步骤
  hiddenSteps?: number[]
  
  // 自定义类名
  className?: string
  
  // 当前步骤
  currentStep?: number
  
  // 跳转到指定步骤
  goToStep?: (step: number) => void
  
  // 已完成的步骤
  completedSteps?: number[]
}
