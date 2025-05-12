"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AnimalEthicProjectEditForm } from "../../components/animal-ethic-project-edit-form"
import { useToast } from "@/components/ui/use-toast"
 
export default function EditAnimalEthicProjectPage() {
  const params = useParams()
  const { toast } = useToast()
  const [projectData, setProjectData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // 在实际应用中，这里会从API获取项目数据
    // 这里使用模拟数据进行演示
    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        
        // 模拟API请求延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // 模拟项目数据（实际项目中应从API获取）
        const projects = [
          {
            id: "1",
            name: "实验大鼠药物代谢研究",
            description: "研究药物在大鼠体内的代谢过程及其机制",
            projectNumber: "ETH-2023-10-001",
            status: "进行中",
            animalType: "大鼠",
            animalCount: "85",
            ethicsCommittee: "医学院伦理审查委员会",
            facilityUnit: "基础医学实验中心",
            leader: "王教授",
            department: "基础医学院",
            title: "教授",
            email: "wang@example.com",
            phone: "13800138000",
            address: "医学院A栋305室",
            startDate: new Date("2023-10-12"),
            endDate: new Date("2024-10-12"),
            budget: "50000",
            researchPurpose: "研究各类新型药物在实验大鼠体内的代谢动力学特征，明确其药效与毒性机制，为临床用药提供理论依据。",
            researchMethod: "采用放射性标记与质谱分析相结合的方法，追踪药物在实验动物体内的代谢途径与终产物，结合组织病理学分析评估药物安全性。",
            members: [
              { id: "m1", name: "李研究员", title: "副研究员", department: "基础医学院", email: "li@example.com", phone: "13900139000" },
              { id: "m2", name: "张博士", title: "助理研究员", department: "药学院", email: "zhang@example.com", phone: "13700137000" }
            ]
          },
          {
            id: "2",
            name: "小鼠造血干细胞分化实验",
            description: "研究小鼠造血干细胞的分化过程与调控机制",
            projectNumber: "ETH-2023-11-002",
            status: "规划中",
            animalType: "小鼠",
            animalCount: "120",
            ethicsCommittee: "生物医学伦理委员会",
            facilityUnit: "免疫学实验中心",
            leader: "李研究员",
            department: "生物医学工程学院",
            title: "研究员",
            email: "liyanjiu@example.com",
            phone: "13600136000",
            address: "生物医学大楼B404",
            startDate: new Date("2023-11-05"),
            endDate: new Date("2024-11-05"),
            budget: "80000",
            researchPurpose: "研究造血干细胞分化为各类血细胞的调控机制，探索干细胞命运决定的分子基础。",
            researchMethod: "利用基因编辑技术构建报告基因小鼠，结合单细胞测序与体内示踪技术，追踪造血干细胞分化过程中的关键调控节点。",
            members: [
              { id: "m3", name: "陈研究生", title: "博士研究生", department: "生物医学工程学院", email: "chen@example.com", phone: "13500135000" }
            ]
          },
          {
            id: "3",
            name: "兔脊髓损伤修复研究",
            description: "通过神经干细胞移植技术研究兔脊髓损伤的修复机制",
            projectNumber: "ETH-2023-08-003",
            status: "已完成",
            animalType: "兔子",
            animalCount: "30",
            ethicsCommittee: "动物实验伦理委员会",
            facilityUnit: "神经科学实验中心",
            leader: "张副教授",
            department: "临床医学院",
            title: "副教授",
            email: "zhang@example.com",
            phone: "13400134000",
            address: "神经科学研究所305室",
            startDate: new Date("2023-08-20"),
            endDate: new Date("2024-02-20"),
            budget: "60000",
            researchPurpose: "探索神经干细胞移植治疗脊髓损伤的有效性及其机制，为临床脊髓损伤修复提供新策略。",
            researchMethod: "建立兔脊髓损伤模型，利用基因修饰的神经干细胞进行移植，通过行为学、电生理与组织学检测评估修复效果。",
            members: [
              { id: "m4", name: "王助教", title: "助教", department: "临床医学院", email: "wang@example.com", phone: "13300133000" },
              { id: "m5", name: "赵医生", title: "主治医师", department: "附属医院", email: "zhao@example.com", phone: "13200132000" }
            ]
          },
          {
            id: "4",
            name: "微型猪心脏移植研究",
            description: "探索猪心脏移植到人体的可行性与排斥反应机制研究",
            projectNumber: "ETH-2023-09-004",
            status: "进行中",
            animalType: "猪",
            animalCount: "8",
            ethicsCommittee: "医学院伦理审查委员会",
            facilityUnit: "器官移植研究中心",
            leader: "赵教授",
            department: "临床医学院",
            title: "教授",
            email: "zhao@example.com",
            phone: "13100131000",
            address: "器官移植研究中心主楼502",
            startDate: new Date("2023-09-15"),
            endDate: new Date("2024-09-15"),
            budget: "200000",
            researchPurpose: "研究异种器官移植的免疫排斥机制及其克服策略，探索解决器官短缺问题的新途径。",
            researchMethod: "利用基因编辑技术改造微型猪心脏，减少异种抗原表达，结合免疫抑制方案进行异种移植实验，监测排斥反应和器官功能。",
            members: [
              { id: "m6", name: "刘研究员", title: "副研究员", department: "临床医学院", email: "liu@example.com", phone: "13000130000" },
              { id: "m7", name: "钱博士", title: "博士后", department: "免疫学研究所", email: "qian@example.com", phone: "12900129000" }
            ]
          },
          {
            id: "5",
            name: "犬类心脏病模型研究",
            description: "建立和验证犬类心脏病动物模型，用于心脏疾病治疗新药筛选",
            projectNumber: "ETH-2023-12-005",
            status: "规划中",
            animalType: "犬类",
            animalCount: "15",
            ethicsCommittee: "医学院伦理审查委员会",
            facilityUnit: "心血管研究中心",
            leader: "钱研究员",
            department: "基础医学院",
            title: "研究员",
            email: "qian@example.com",
            phone: "12800128000",
            address: "心血管研究中心203室",
            startDate: new Date("2023-12-03"),
            endDate: new Date("2024-12-03"),
            budget: "120000",
            researchPurpose: "建立可靠的犬类心脏病模型，用于心血管疾病机制研究和药物筛选评价。",
            researchMethod: "通过外科手术、基因修饰或药物诱导等方法建立不同类型的犬心脏病模型，进行全面的心功能评估和药物干预实验。",
            members: []
          },
          {
            id: "6",
            name: "猕猴脑功能区神经连接图谱研究",
            description: "利用先进成像技术绘制猕猴脑功能区神经连接图谱，探索大脑工作机理",
            projectNumber: "ETH-2023-07-006",
            status: "进行中",
            animalType: "猴子",
            animalCount: "12",
            ethicsCommittee: "医学院伦理审查委员会",
            facilityUnit: "脑科学中心",
            leader: "孙教授",
            department: "基础医学院",
            title: "教授",
            email: "sun@example.com",
            phone: "12700127000",
            address: "脑科学中心A栋701",
            startDate: new Date("2023-07-28"),
            endDate: new Date("2024-07-28"),
            budget: "250000",
            researchPurpose: "利用先进神经示踪和成像技术，绘制猕猴脑功能区间的精细神经连接图谱，揭示大脑工作原理。",
            researchMethod: "结合病毒示踪、超高分辨率成像和光遗传学技术，系统追踪和记录猕猴脑功能区之间的神经投射和连接，构建神经环路图谱。",
            members: [
              { id: "m8", name: "周博士", title: "助理研究员", department: "脑科学中心", email: "zhou@example.com", phone: "12600126000" },
              { id: "m9", name: "吴工程师", title: "高级工程师", department: "医学影像中心", email: "wu@example.com", phone: "12500125000" },
              { id: "m10", name: "郑研究生", title: "博士研究生", department: "基础医学院", email: "zheng@example.com", phone: "12400124000" }
            ]
          }
        ]
        
        // 获取请求的项目ID
        const projectId = params?.id as string
        
        // 查找对应ID的项目
        const projectData = projects.find(p => p.id === projectId)
        
        if (projectData) {
          setProjectData(projectData)
        } else {
          // 如果找不到项目，显示错误信息
          toast({
            title: "错误",
            description: "找不到请求的项目，请检查项目ID是否正确",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("获取项目数据出错:", error)
        toast({
          title: "数据加载失败",
          description: "无法获取项目数据，请稍后重试",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
  }, [params?.id, toast])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">加载项目数据中...</p>
        </div>
      </div>
    )
  }
  
  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">项目不存在</h3>
          <p className="text-gray-500 mb-6">找不到请求的项目，请检查项目ID是否正确或返回项目列表重新选择</p>
          <a href="/ethic-projects/animal" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            返回项目列表
          </a>
        </div>
      </div>
    )
  }
  
  return <AnimalEthicProjectEditForm projectData={projectData} />
} 