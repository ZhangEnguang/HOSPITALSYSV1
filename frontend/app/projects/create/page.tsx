"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCreationForm } from "@/components/project-creation/project-creation-form"
import { templates } from "../components/templates-dialog"
import { Button } from "@/components/ui/button"

function CreateProjectPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams?.get("template")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [mockData, setMockData] = useState<any>(null)

  useEffect(() => {
    if (templateId) {
      console.log("查找模板ID:", templateId, "类型:", typeof templateId);
      
      // 1. 优先尝试从sessionStorage读取预填充数据
      let prefillData = null;
      let template = null;
      
      try {
        const prefillDataStr = sessionStorage.getItem('prefillData');
        if (prefillDataStr) {
          prefillData = JSON.parse(prefillDataStr);
          console.log("从sessionStorage读取到预填充数据:", prefillData);
          
          // 同时获取模板信息
          const templateStr = sessionStorage.getItem('selectedTemplate');
          if (templateStr) {
            template = JSON.parse(templateStr);
          }
        }
      } catch (err) {
        console.error("读取sessionStorage数据失败:", err);
      }
      
      // 2. 如果sessionStorage没有数据，则从templates数组查找
      if (!template) {
        console.log("从templates数组查找模板...");
        console.log("所有模板:", templates);
        
        template = templates.find((t) => {
          return t.id === Number(templateId) || String(t.id) === templateId;
        });
        
        console.log("从templates数组找到的模板:", template);
      }
      
      // 3. 处理找到的模板和预填充数据
      if (template) {
        setSelectedTemplate(template);
        
        // 如果已经有预填充数据，直接使用
        if (prefillData) {
          setMockData(prefillData);
          return;
        }
        
        // 否则生成新的预填充数据
        const today = new Date();
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(new Date().setMonth(today.getMonth() + 12)).toISOString().split('T')[0];
        
        // 预计划时间
        let plannedStart = startDate;
        let plannedEnd = endDate;
        
        // 根据模板类型调整项目周期
        if (template.category === "国际合作") {
          plannedEnd = new Date(new Date().setMonth(today.getMonth() + 24)).toISOString().split('T')[0];
        } else if (template.category === "科研类") {
          plannedEnd = new Date(new Date().setMonth(today.getMonth() + 36)).toISOString().split('T')[0];
        } else if (template.category === "建设类") {
          plannedEnd = new Date(new Date().setMonth(today.getMonth() + 18)).toISOString().split('T')[0];
        }
        
        // 判断项目类型（横向/纵向）
        const isHorizontal = template.category.includes("合作") || template.category === "采购类";
        const projectType = isHorizontal ? "横向" : "纵向";
        
        // 判断项目级别
        let projectLevel = "校级";
        if (template.title.includes("国家") || template.category.includes("国家")) {
          projectLevel = "国家级";
        } else if (template.title.includes("省") || template.category.includes("省")) {
          projectLevel = "省部级";
        }
        
        // 预算金额
        let budget = "100000";
        if (projectLevel === "国家级") {
          budget = "500000";
        } else if (projectLevel === "省部级") {
          budget = "300000";
        } else if (projectType === "横向") {
          budget = template.category === "采购类" ? "200000" : "150000";
        }
        
        // 创建丰富的预填充数据
        const mockAnalysisResult = {
          项目名称: template.title,
          项目分类: template.category,
          项目类型: projectType,
          项目级别: projectLevel,
          经费来源: template.category,
          项目状态: "筹备中",
          开始日期: plannedStart,
          结束日期: plannedEnd,
          预算金额: budget,
          负责人: "当前用户",
          参与人员: "待添加",
          研究内容: `基于${template.title}的深入研究与应用`,
          预期成果: template.tags.join("、"),
          关键词: template.tags.join("、"),
          摘要: template.description,
          研究计划: `本项目计划分为三个阶段完成，总周期${parseInt(plannedEnd.split('-')[0]) - parseInt(plannedStart.split('-')[0]) + 1}年`,
          技术路线: "采用先进的技术方法和研究手段，确保项目按期高质量完成",
        };
        
        setMockData(mockAnalysisResult);
      } else {
        // 如果找不到模板，重定向回项目管理页面
        router.push("/projects");
      }
    }
  }, [templateId, router]);

  if (!selectedTemplate && templateId) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="p-6 bg-white rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4">未找到模板</h2>
          <p className="text-gray-600 mb-6">
            无法找到ID为"{templateId}"的模板，请返回项目管理页面重新选择模板。
          </p>
          <Button onClick={() => router.push("/projects")}>
            返回项目列表
          </Button>
        </div>
      </div>
    );
  }

  // 无模板ID时，显示空表单
  if (!templateId) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <ProjectCreationForm
          projectType="纵向"
          redirectPath="/projects"
          showAIPanel={true}
          defaultPanelCollapsed={false}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <ProjectCreationForm
        projectType={selectedTemplate.category.includes("合作") ? "横向" : "纵向"}
        redirectPath="/projects"
        showAIPanel={true}
        defaultPanelCollapsed={false}
        mockAnalysisResult={mockData}
      />
    </div>
  )
}

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">数据加载中...</div>}>
      <CreateProjectPageContent />
    </Suspense>
  )
} 