"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectCreationForm, ProjectFormData } from "@/components/project-creation/project-creation-form"
import { toast } from "@/hooks/use-toast"
// 导入API函数
import { getProjectById } from "@/lib/api/project"
import { ApiResponse } from "@/lib/api"

// 映射通用项目数据到表单格式的函数
const mapProjectToFormData = (project: any): Record<string, any> => {
  console.log('开始映射项目数据到表单格式:', project);
  // 处理预算明细
  const budgetItems = Array.isArray(project.budgets) && project.budgets.length > 0
    ? project.budgets.map((budget: any) => ({
        id: budget.id || null,
        category: budget.category || '未分类',
        amount: budget.amount?.toString() || '0',
        description: budget.description || ''
      }))
    : [{
        category: '',
        amount: (project.totalBudget || 0).toString(),
        description: ''
      }];
  
  console.log('处理后的预算明细:', budgetItems);
  
  return {
    id: project.id,
    批准号: project.projectNumber,
    项目名称: project.name,
    项目类型: project.type,
    项目描述: project.description,
    项目级别: project.level || "省级",
    经费来源: project.source || "省科技厅",
    项目状态: project.status || "进行中",
    开始日期: project.startDate ? project.startDate.split(' ')[0].replace(/-/g, '/') : "",
    结束日期: project.endDate ? project.endDate.split(' ')[0].replace(/-/g, '/') : "",
    项目负责人: project.leaderName,
    职称: project.leaderTitle,
    联系电话: project.leaderPhone,
    电子邮箱: project.leaderEmail,
    身份证号: project.leaderIdCard || "",
    项目经办人: project.managerName || "",
    经办人电话: project.managerPhone || "",
    团队成员: Array.isArray(project.members) 
      ? project.members.map((m: any) => {
          // 如果是字符串，直接使用
          if (typeof m === 'string') {
            return { name: m, role: '', unit: '', title: '', email: '', phone: '', orderId: '', isLeader: 0 };
          }
          // 如果是对象，保留所有字段
          return {
            name: m.name || '',
            role: m.role || '',
            unit: m.unit || '',
            title: m.title || '',
            email: m.email || '',
            phone: m.phone || '',
            orderId: m.orderId || '',
            isLeader: m.isLeader || 0,
            ...m // 保留所有其他字段
          };
        }) 
      : [],
    预算金额: project.totalBudget ? project.totalBudget.toString() : "0",
    budgets: budgetItems, // 添加预算明细数组
    所属单位: project.unitId || "",
    项目分类: project.category || "",
    合同编号: project.contractNumber || "",
    合作企业: project.partnerCompany || "",
    知识产权归属: project.intellectualProperty || "",
    保密等级: project.confidentialityLevel || ""
  };
};

interface ProjectEditFormProps {
  projectId: number | string
  redirectPath?: string
  projectType?: "horizontal" | "schoolLevel" | "vertical"
}

export function ProjectEditForm({ 
  projectId, 
  redirectPath = "/projects",
  projectType
}: ProjectEditFormProps) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<ProjectFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detectProjectType, setDetectProjectType] = useState<string | null>(null)

  useEffect(() => {
    // 获取项目数据
    const fetchProject = async () => {
      try {
        console.log('ProjectEditForm - 开始加载项目:', projectId);
        
        // 转换项目ID为字符串（API需要字符串类型的ID）
        const projectIdStr = typeof projectId === 'number' ? projectId.toString() : projectId;
        
        // 直接使用通用的getProjectById接口获取项目数据
        const projectData = await getProjectById(projectIdStr);
        console.log('ProjectEditForm - 获取到的项目数据:', projectData);
        // 保存项目数据
        setProject(projectData);
        
        // 设置项目类型
        setDetectProjectType(projectData.type);
        
        // 将项目数据映射为表单数据格式
        const formattedData = mapProjectToFormData(projectData);
        
        // 确保ID被正确传递，用于后续编辑操作
        formattedData.id = projectIdStr;
        setFormData(formattedData as ProjectFormData);
        setError(null);
      } catch (error) {
        console.error("Error fetching project:", error);
        const errorMessage = error instanceof Error ? error.message : "加载失败";
        setError(errorMessage);
        toast({
          title: "加载失败",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, projectType]);

  // 如果正在加载中，显示加载中提示
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  // 如果发生错误或没有找到项目，显示错误提示
  if (error || !project || !formData) {
    return (
      <div className="p-8 text-center py-12">
        <h2 className="text-xl font-semibold mb-2">找不到项目</h2>
        <p className="text-muted-foreground">{error || "该项目可能已被删除或不存在"}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => router.push(redirectPath)}
        >
          返回项目列表
        </button>
      </div>
    )
  }

  // 获取项目类型
  const actualProjectType = detectProjectType || formData.项目类型 || "横向";
  
  // 为校级项目添加额外字段
  const additionalFields = actualProjectType === "校级项目" || actualProjectType === "校级"
    ? ["合作企业", "合同编号", "知识产权归属", "保密等级"]
    : [];

  // 显示项目编辑表单
  return (
    <ProjectCreationForm
      projectType={actualProjectType}
      mockAnalysisResult={formData}
      localStorageKey={`project_edit_${projectId}`}
      redirectPath={redirectPath}
      showAIPanel={false}
      isEditMode={true}
      defaultPanelCollapsed={true}
      additionalFields={additionalFields}
    />
  )
}
