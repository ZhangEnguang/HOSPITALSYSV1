// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { HumanEthicProjectForm } from "@/app/ethic-projects/create/human/components/human-ethic-project-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditHumanEthicProjectPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [projectData, setProjectData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("编辑页面加载，获取的ID参数:", params.id)
    // 在实际应用中，这里会从API获取项目数据
    fetchProjectData()
  }, [params.id])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      
      console.log("开始获取项目数据，ID:", params.id)
      
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟项目数据 - 基于mockEthicProjects中的人体伦理项目
      const mockProjects = [
        {
          id: "1",
          name: "冠心病患者饮食干预效果研究",
          description: "研究不同饮食模式对冠心病患者血脂和心血管事件的影响",
          projectNumber: "人伦2024001",
          status: "进行中",
          projectCategory: "人体",
          projectType: "临床研究", 
          projectSource: "国家自然科学基金",
          ethicsCommittee: "人体医学伦理委员会",
          researchUnit: "内科学系",
          负责人所属单位: "临床医学院",
          研究执行单位: "内科学系",
          leader: "王教授",
          department: "临床医学院",
          title: "教授",
          email: "wang@example.com",
          phone: "13800000001",
          address: "临床医学院4号楼305室",
          startDate: "2024-01-01",
          endDate: "2026-12-31",
          budget: "850000",
          participantCount: "120",
          researchPurpose: "研究不同饮食模式对冠心病患者血脂水平和心血管事件发生率的影响，寻找最佳的饮食干预方案。",
          researchMethod: "随机将参与者分为三组，分别接受地中海饮食、DASH饮食和常规饮食指导，定期检测血脂指标和记录心血管事件。",
          members: [
            { id: "m1", name: "李助理", title: "研究助理", department: "临床医学院", email: "li@example.com", phone: "13800000002" },
            { id: "m2", name: "张医生", title: "主治医师", department: "内科", email: "zhang@example.com", phone: "13800000003" },
            { id: "m3", name: "刘营养师", title: "高级营养师", department: "营养科", email: "liu@example.com", phone: "13800000004" }
          ]
        },
        {
          id: "2",
          name: "多人种样本基因测序与健康风险预测",
          description: "采集不同人种血液样本进行基因组测序分析，研究疾病易感性与健康风险预测",
          projectNumber: "人伦2024002",
          status: "规划中",
          projectCategory: "人体",
          projectType: "基因研究",
          projectSource: "国家重点研发计划",
          ethicsCommittee: "临床研究伦理委员会",
          researchUnit: "基因组医学中心",
          负责人所属单位: "基础医学系",
          研究执行单位: "基因组医学中心",
          leader: "李研究员",
          department: "基础医学系",
          title: "研究员",
          email: "li@example.com",
          phone: "13800000005",
          address: "基础医学楼B区201室",
          startDate: "2024-03-01", 
          endDate: "2026-12-31",
          budget: "2450000",
          participantCount: "500",
          researchPurpose: "采集不同人种血液样本进行基因组测序分析，研究疾病易感性与健康风险预测，建立多人种基因风险预测模型。",
          researchMethod: "招募来自不同种族背景的健康志愿者，采集血液样本进行全基因组测序，结合临床和生活方式数据建立预测模型。",
          members: [
            { id: "m4", name: "陈博士", title: "博士后", department: "基础医学系", email: "chen@example.com", phone: "13800000006" },
            { id: "m5", name: "吴工程师", title: "测序工程师", department: "基因组医学中心", email: "wu@example.com", phone: "13800000007" },
            { id: "m6", name: "周研究员", title: "助理研究员", department: "公共卫生学院", email: "zhou@example.com", phone: "13800000008" }
          ]
        },
        {
          id: "3",
          name: "多人种样本基因测序与健康风险预测",
          description: "采集不同人种血液样本进行基因组测序分析，研究疾病易感性与健康风险预测",
          projectNumber: "人伦2025001",
          status: "进行中",
          projectCategory: "人体",
          projectType: "临床研究",
          projectSource: "国家重点研发计划",
          ethicsCommittee: "人体医学伦理委员会",
          researchUnit: "内科学系",
          负责人所属单位: "基础医学系",
          研究执行单位: "内科学系",
          leader: "王建国",
          department: "基础医学系",
          title: "教授",
          email: "wang@example.com",
          phone: "13800138000",
          address: "医学院3号楼502室",
          startDate: "2024-01-15",
          endDate: "2027-12-31",
          budget: "2450000",
          participantCount: "120",
          researchPurpose: "通过大规模人群基因组测序，分析不同种族在特定疾病易感性上的差异，构建健康风险预测模型。",
          researchMethod: "采集参与者血液样本，提取DNA进行全基因组测序和分析，结合临床数据和生活方式信息，构建预测模型。",
          members: [
            { id: "m1", name: "李助理", title: "助理研究员", department: "基础医学系", email: "li@example.com", phone: "13900139000" },
            { id: "m2", name: "王博士", title: "博士后", department: "公共卫生学院", email: "wang@example.com", phone: "13700137000" }
          ]
        },
        {
          id: "5",
          name: "新生儿脐带血干细胞提取技术评估",
          description: "研究新生儿脐带血干细胞提取技术的临床安全性与有效性，评估伦理标准",
          projectNumber: "人伦2025002",
          status: "进行中",
          projectCategory: "人体",
          projectType: "实验性研究",
          projectSource: "国家自然科学基金",
          ethicsCommittee: "生物医学研究伦理委员会",
          researchUnit: "儿科学系",
          负责人所属单位: "儿科医学院",
          研究执行单位: "儿科学系",
          leader: "孙丽娜",
          department: "儿科医学院",
          title: "副教授",
          email: "sun@example.com",
          phone: "13600136000",
          address: "儿科医学院2号楼304室",
          startDate: "2024-02-15",
          endDate: "2025-12-15",
          budget: "920000",
          participantCount: "50",
          researchPurpose: "评估一种改良的脐带血干细胞提取技术在临床应用中的安全性和有效性，确定最佳操作规范。",
          researchMethod: "收集产妇脐带血样本，应用新型提取技术分离干细胞，评估细胞活性和分化潜能，结合临床数据分析技术效益。",
          members: [
            { id: "m3", name: "周医生", title: "主治医师", department: "妇产科", email: "zhou@example.com", phone: "13500135000" }
          ]
        },
        {
          id: "7",
          name: "老年痴呆症患者实验性药物临床试验",
          description: "针对老年痴呆症患者的实验性药物临床试验，评估药效与安全性",
          projectNumber: "人伦2025003",
          status: "进行中",
          projectCategory: "人体",
          projectType: "干预性研究",
          projectSource: "国家重点研发计划",
          ethicsCommittee: "药物临床试验伦理委员会",
          researchUnit: "神经内科",
          负责人所属单位: "神经科学研究所",
          研究执行单位: "神经内科",
          leader: "郑海涛",
          department: "神经科学研究所",
          title: "正高级研究员",
          email: "zheng@example.com",
          phone: "13300133000",
          address: "神经科学研究所5号楼201室",
          startDate: "2024-01-01",
          endDate: "2026-12-31",
          budget: "1680000",
          participantCount: "80",
          researchPurpose: "评估一种靶向β-淀粉样蛋白的新型药物在轻中度阿尔茨海默病患者中的安全性和有效性。",
          researchMethod: "采用随机双盲对照试验设计，将患者分为实验组和对照组，通过认知功能量表和生物标志物评估药物效果。",
          members: [
            { id: "m5", name: "林医生", title: "神经科主任", department: "神经内科", email: "lin@example.com", phone: "13200132000" }
          ]
        },
        {
          id: "9",
          name: "孕妇胎儿血液采集技术伦理研究",
          description: "研究孕妇胎儿血液采集技术的安全性与伦理规范，制定相关标准",
          projectNumber: "人伦2025004",
          status: "规划中",
          projectCategory: "人体",
          projectType: "观察性研究",
          projectSource: "省级科研基金",
          ethicsCommittee: "生物医学研究伦理委员会",
          researchUnit: "妇产科",
          负责人所属单位: "妇产科医学院",
          研究执行单位: "妇产科",
          leader: "刘晓峰",
          department: "妇产科医学院",
          title: "主任医师",
          email: "liu@example.com",
          phone: "13400134000",
          address: "妇产科医学院1号楼105室",
          startDate: "2024-07-01",
          endDate: "2025-12-31",
          budget: "750000",
          participantCount: "60",
          researchPurpose: "研究和评估孕妇胎儿血液采集技术的安全性，制定相关伦理规范和标准。",
          researchMethod: "招募孕妇志愿者，使用不同采集技术获取胎儿血液样本，评估各技术安全性指标和成功率。",
          members: [
            { id: "m6", name: "张医生", title: "副主任医师", department: "妇产科", email: "zhang@example.com", phone: "13100131000" }
          ]
        },
        {
          id: "11",
          name: "人体干细胞移植治疗帕金森病研究",
          description: "研究人体干细胞移植治疗帕金森病的临床疗效与安全性评估",
          projectNumber: "人伦2025005",
          status: "进行中",
          projectCategory: "人体",
          projectType: "干预性研究",
          projectSource: "国家自然科学基金",
          ethicsCommittee: "人体医学伦理委员会",
          researchUnit: "神经内科",
          负责人所属单位: "神经科学研究所",
          研究执行单位: "神经内科",
          leader: "周健",
          department: "神经科学研究所",
          title: "教授",
          email: "zhou@example.com",
          phone: "13000130000",
          address: "神经科学研究所3号楼401室",
          startDate: "2024-04-01",
          endDate: "2027-03-31",
          budget: "1350000",
          participantCount: "70",
          researchPurpose: "评估人体干细胞移植治疗帕金森病的临床疗效与安全性，寻找改善患者生活质量的新方法。",
          researchMethod: "招募帕金森病患者，进行干细胞移植手术，通过临床评分量表和影像学检查评估疗效。",
          members: [
            { id: "m7", name: "黄医生", title: "神经外科医师", department: "神经外科", email: "huang@example.com", phone: "13900139001" }
          ]
        }
      ]
      
      console.log("可用的模拟项目数据:", mockProjects.map(p => ({ id: p.id, name: p.name })))
      
      // 查找与当前ID匹配的项目
      const project = mockProjects.find(p => p.id === params.id)
      
      if (project) {
        console.log("找到匹配的项目:", project.id, project.name)
        setProjectData(project)
      } else {
        console.error("项目未找到:", params.id)
        // 项目未找到时重定向到列表页
        router.push("/ethic-projects/human")
      }
    } catch (error) {
      console.error("获取项目数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-8">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div>
      {projectData && (
        <HumanEthicProjectForm
          initialData={projectData}
          editMode={true}
        />
      )}
    </div>
  )
} 