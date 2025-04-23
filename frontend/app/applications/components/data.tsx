import { useState, useEffect } from "react"
import { extendedApplicationItems } from "../data/applications-data"

// 生成研究人员姓名
const generateResearcher = () => {
  const surnames = ["张", "李", "王", "赵", "陈", "刘", "杨", "黄", "周", "吴"]
  const names = ["明", "华", "强", "伟", "勇", "芳", "娜", "静", "秀英", "建国"]
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  return surname + name
}

// 高校科研相关的部门和职称
const academicDepartments = [
  "物理学院", "化学学院", "生命科学学院", "材料科学与工程学院", "电子信息学院",
  "计算机科学与技术学院", "机械工程学院", "土木工程学院", "环境科学与工程学院", "医学院"
]

const academicTitles = ["教授", "副教授", "讲师", "助理教授", "特聘教授"]

// 生成项目数据
const generateResearchProjectData = (batchName: string, batchType: string, batchCategory: string) => {
  const projectNamesByCategory: Record<string, string[]> = {
    自然科学: ["基于量子计算的密码学安全性研究", "新型二维材料的电子结构与物理性质研究"],
    工程技术: ["新一代人工智能芯片架构设计与优化", "高效太阳能电池关键材料与器件研究"],
    农业科学: ["作物抗逆性分子机制与品种改良研究", "农业生态系统碳循环与碳汇增强技术研究"],
    医药科学: ["新型冠状病毒变异机制与疫苗研发", "肿瘤免疫治疗新靶点与新策略研究"],
    人文社科: ["数字经济发展与社会变迁研究", "中国传统文化创新传承与国际传播研究"],
    教育科学: ["智能时代教育教学模式创新研究", "高校思政教育创新与实践研究"],
    其他: ["跨学科交叉研究方法与应用", "科技伦理与科研诚信建设研究"]
  }

  const projectDescriptionsByCategory: Record<string, string[]> = {
    自然科学: ["探索量子计算对现有密码体系的影响", "研究新型二维材料的电子结构特性"],
    工程技术: ["设计新一代人工智能专用芯片架构", "研发高效太阳能电池材料与器件"],
    农业科学: ["研究作物抗逆性的分子机制", "研究农业生态系统碳循环规律"],
    医药科学: ["研究新冠病毒变异规律", "探索肿瘤免疫治疗新靶点"],
    人文社科: ["研究数字经济发展对社会结构的影响", "探索中国传统文化创新传承路径"],
    教育科学: ["研究智能技术在教育教学中的应用", "探索高校思政教育创新路径"],
    其他: ["探索跨学科研究方法论", "研究科技伦理规范与科研诚信建设策略"]
  }

  const categoryNames = projectNamesByCategory[batchCategory] || projectNamesByCategory["其他"]
  const categoryDescriptions = projectDescriptionsByCategory[batchCategory] || projectDescriptionsByCategory["其他"]
  const randomIndex = Math.floor(Math.random() * categoryNames.length)

  return {
    name: categoryNames[randomIndex],
    description: categoryDescriptions[randomIndex]
  }
}

export const useApplicationData = () => {
  const [applicationItems, setApplicationItems] = useState(extendedApplicationItems)
  const [batchProjects, setBatchProjects] = useState<Record<string, any[]>>({})

  useEffect(() => {
    const mockBatchProjects: Record<string, any[]> = {}
    applicationItems.forEach((batch) => {
      const projectCount = batch.projectCount || 0
      const projects = []

      for (let i = 0; i < projectCount; i++) {
        const projectData = generateResearchProjectData(batch.name, batch.type, batch.category)
        const researcherName = generateResearcher()
        const department = academicDepartments[Math.floor(Math.random() * academicDepartments.length)]
        const title = academicTitles[Math.floor(Math.random() * academicTitles.length)]
        const baseAmount = batch.amount / projectCount
        const variationFactor = 0.5 + Math.random()
        const projectAmount = Number((baseAmount * variationFactor).toFixed(2))

        let projectStatus
        const statusRandom = Math.random()
        if (batch.batch === "申报批次") {
          if (statusRandom < 0.3) projectStatus = "准备中"
          else if (statusRandom < 0.6) projectStatus = "已提交"
          else if (statusRandom < 0.8) projectStatus = "已通过"
          else if (statusRandom < 0.9) projectStatus = "修改中"
          else projectStatus = "审核中"
        } else {
          if (statusRandom < 0.4) projectStatus = "待评审"
          else if (statusRandom < 0.7) projectStatus = "评审中"
          else projectStatus = "已评审"
        }

        let progress = 0
        if (projectStatus === "准备中") progress = Math.floor(Math.random() * 30)
        else if (["已提交", "修改中", "审核中"].includes(projectStatus)) progress = 30 + Math.floor(Math.random() * 40)
        else if (projectStatus === "已通过") progress = 70 + Math.floor(Math.random() * 30)
        else if (projectStatus === "待评审") progress = Math.floor(Math.random() * 20)
        else if (projectStatus === "评审中") progress = 20 + Math.floor(Math.random() * 60)
        else if (projectStatus === "已评审") progress = 80 + Math.floor(Math.random() * 20)

        projects.push({
          id: `${batch.id}-project-${i + 1}`,
          name: projectData.name,
          description: projectData.description,
          type: batch.type,
          category: batch.category,
          amount: projectAmount,
          progress: progress,
          date: batch.date,
          deadline: batch.deadline,
          batchNumber: batch.batchNumber,
          status: projectStatus,
          batch: batch.batch,
          manager: {
            id: Math.floor(Math.random() * 100) + 1,
            name: researcherName,
            department: department,
            title: title,
          },
          expertCount: batch.batch === "评审批次" ? Math.floor(Math.random() * 3) + 1 : 0,
        })
      }

      mockBatchProjects[batch.id] = projects
    })

    setBatchProjects(mockBatchProjects)
  }, [applicationItems])

  return {
    applicationItems,
    setApplicationItems,
    batchProjects,
    setBatchProjects
  }
} 