"use client"

import React, { useState, useEffect } from "react"
import { DynamicStepForm, AIAssistantPanel } from "@/components/dynamic-form"
import { toast } from "@/hooks/use-toast"
import {
  MemberBasicInfoStep,
  MemberContactStep,
  MemberIdentityStep,
  MemberPreviewStep
} from "./form-steps"

// 示例初始数据（用于编辑模式）
const sampleMemberData = {
  "姓名": "张三",
  "性别": "男",
  "所属部门": "信息工程学院",
  "职称": "副教授",
  "专业方向": "人工智能与模式识别",
  "手机号码": "13800138000",
  "电子邮箱": "zhangsan@example.edu.cn",
  "办公室地点": "A楼301",
  "首选联系方式": "电子邮箱",
  "身份证号": "330************789",
  "工号": "20050035",
  "权限_创建项目": true,
  "权限_审核项目": false,
  "权限_预算管理": true,
  "权限_导出报表": false,
  "备注": "负责人工智能与数据科学实验室"
}

// 示例AI建议数据
const sampleAISuggestions = [
  {
    field: "姓名",
    value: "李四",
    confidence: 0.95,
    description: "从简历中提取的姓名"
  },
  {
    field: "所属部门",
    value: "能源研究院",
    confidence: 0.92,
    description: "从简历中提取的部门"
  },
  {
    field: "职称",
    value: "教授",
    confidence: 0.88,
    description: "从简历中提取的职称"
  },
  {
    field: "专业方向",
    value: "新能源电池材料研究与应用",
    confidence: 0.75,
    description: "从简历中提取的研究方向"
  },
  {
    field: "手机号码",
    value: "13900139000",
    confidence: 0.96,
    description: "从简历中提取的联系电话"
  },
  {
    field: "电子邮箱",
    value: "lisi@example.edu.cn",
    confidence: 0.93,
    description: "从简历中提取的电子邮箱"
  }
]

export default function MemberFormExample() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [initialData, setInitialData] = useState<Record<string, any>>({})
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [filledFields, setFilledFields] = useState<string[]>([])
  
  // 模拟从URL参数获取模式和ID
  useEffect(() => {
    // 这里可以根据URL参数来决定是否为编辑模式
    // 例如，如果URL包含id参数，则为编辑模式
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    
    if (id) {
      setIsEditMode(true)
      // 模拟从API获取数据，这里使用示例数据
      setInitialData(sampleMemberData)
    }
  }, [])
  
  // 表单步骤配置
  const memberFormSteps = [
    {
      id: "basic-info",
      name: "基本信息",
      component: MemberBasicInfoStep,
      validation: (data: Record<string, any>) => {
        const errors: Record<string, string> = {}
        if (!data["姓名"]) errors["姓名"] = "姓名不能为空"
        if (!data["所属部门"]) errors["所属部门"] = "请选择所属部门"
        return errors
      }
    },
    {
      id: "contact-info",
      name: "联系方式",
      component: MemberContactStep,
      validation: (data: Record<string, any>) => {
        const errors: Record<string, string> = {}
        if (!data["手机号码"]) {
          errors["手机号码"] = "手机号码不能为空"
        } else if (!/^1\d{10}$/.test(data["手机号码"])) {
          errors["手机号码"] = "请输入有效的手机号码"
        }
        
        if (!data["电子邮箱"]) {
          errors["电子邮箱"] = "电子邮箱不能为空"
        } else if (!/^\S+@\S+\.\S+$/.test(data["电子邮箱"])) {
          errors["电子邮箱"] = "请输入有效的电子邮箱"
        }
        
        return errors
      }
    },
    {
      id: "identity-info",
      name: "其他信息",
      component: MemberIdentityStep
      // 无需验证
    },
    {
      id: "preview",
      name: "预览",
      component: MemberPreviewStep
      // 预览步骤无需验证
    }
  ]
  
  // 处理表单提交
  const handleSubmit = async (data: Record<string, any>) => {
    console.log("提交数据:", data)
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 成功提示
    toast({
      title: "提交成功",
      description: isEditMode ? "成员信息已更新" : "成员已成功添加",
    })
    
    return true
  }
  
  // 处理表单保存
  const handleSave = async (data: Record<string, any>) => {
    console.log("保存草稿:", data)
    setFormData(data)
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return true
  }
  
  // 处理AI填充字段
  const handleFillField = (field: string, value: any) => {
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 添加到已填充字段列表
    setFilledFields(prev => [...prev, field])
  }
  
  // 处理AI填充所有字段
  const handleFillAll = () => {
    const updatedFormData = { ...formData }
    const newFilledFields: string[] = [...filledFields]
    
    // 遍历所有AI建议并填充
    sampleAISuggestions.forEach(suggestion => {
      updatedFormData[suggestion.field] = suggestion.value
      if (!newFilledFields.includes(suggestion.field)) {
        newFilledFields.push(suggestion.field)
      }
    })
    
    setFormData(updatedFormData)
    setFilledFields(newFilledFields)
  }
  
  // 渲染AI助手面板
  const renderAIPanel = () => {
    return (
      <AIAssistantPanel
        moduleType="成员"
        formData={formData}
        mockSuggestions={sampleAISuggestions}
        filledFields={filledFields}
        onFillField={handleFillField}
        onFillAll={handleFillAll}
        defaultCollapsed={false}
      />
    )
  }
  
  return (
    <div className="container py-8">
      <DynamicStepForm
        steps={memberFormSteps}
        initialData={initialData}
        onSubmit={handleSubmit}
        onSave={handleSave}
        titleConfig={{
          field: "姓名",
          label: isEditMode ? "编辑成员" : "添加成员",
          editable: true
        }}
        subtitleFields={["所属部门", "职称"]}
        returnPath="/members"
        moduleType="成员"
        isEditMode={isEditMode}
        localStorageKey={isEditMode ? `member_edit_draft` : `member_new_draft`}
        showAIPanel={true}
        aiPanelComponent={renderAIPanel()}
      />
    </div>
  )
}
