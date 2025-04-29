export interface EthicProject {
  id: string
  projectNumber: string
  name: string
  type: string
  status: string
  auditStatus: string
  source: string
  leader: string
  progress: number
  startDate: string
  endDate: string
  favorite: boolean
  description?: string
  department?: string
  location?: string
  budget?: number
  animalCount?: string | number
  createdAt: string
  updatedAt: string
}

export interface EthicProjectsFilterState {
  search: string
  type: string[]
  status: string[]
  auditStatus: string[]
  source: string[]
  progress: number[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export const mockEthicProjects: EthicProject[] = [
  {
    id: "1",
    projectNumber: "ETH-2023-001",
    name: "小鼠脑组织研究",
    type: "动物伦理",
    status: "进行中",
    auditStatus: "已通过",
    source: "内部研究",
    leader: "张三",
    progress: 65,
    startDate: "2023-01-15",
    endDate: "2023-12-15",
    favorite: true,
    description: "本项目旨在研究小鼠脑组织在特定药物作用下的反应，为神经退行性疾病治疗提供理论基础。",
    department: "神经科学研究部",
    location: "北京",
    budget: 120000,
    animalCount: "100只",
    createdAt: "2023-01-05",
    updatedAt: "2023-03-22"
  },
  {
    id: "2",
    projectNumber: "ETH-2023-002",
    name: "新冠疫苗临床研究",
    type: "人类伦理",
    status: "进行中",
    auditStatus: "已通过",
    source: "合作项目",
    leader: "赵六",
    progress: 40,
    startDate: "2023-02-01",
    endDate: "2024-02-01",
    favorite: false,
    description: "评估新型新冠疫苗在特定人群中的安全性和有效性，为疫苗改进提供科学依据。",
    department: "临床研究部",
    location: "上海",
    budget: 500000,
    animalCount: "200只",
    createdAt: "2023-01-20",
    updatedAt: "2023-01-25"
  },
  {
    id: "3",
    projectNumber: "ETH-2023-003",
    name: "基因编辑小鼠模型",
    type: "动物伦理",
    status: "规划中",
    auditStatus: "审核中",
    source: "内部研究",
    leader: "钱九",
    progress: 10,
    startDate: "2023-04-01",
    endDate: "2024-04-01",
    favorite: true,
    description: "使用CRISPR-Cas9技术开发神经退行性疾病小鼠模型，为相关疾病研究提供工具。",
    department: "分子生物学部",
    location: "广州",
    budget: 200000,
    animalCount: "50只",
    createdAt: "2023-03-15",
    updatedAt: "2023-03-20"
  },
  {
    id: "4",
    projectNumber: "ETH-2023-004",
    name: "精神健康干预研究",
    type: "人类伦理",
    status: "已完成",
    auditStatus: "已通过",
    source: "外部合作",
    leader: "郑十一",
    progress: 100,
    startDate: "2022-07-01",
    endDate: "2023-01-31",
    favorite: false,
    description: "评估在线认知行为疗法对青少年抑郁症的干预效果，为心理健康服务提供科学依据。",
    department: "心理健康研究中心",
    location: "杭州",
    budget: 150000,
    animalCount: "100只",
    createdAt: "2022-06-10",
    updatedAt: "2023-02-28"
  },
  {
    id: "5",
    projectNumber: "ETH-2023-005",
    name: "转基因斑马鱼模型",
    type: "动物伦理",
    status: "已暂停",
    auditStatus: "已驳回",
    source: "内部研究",
    leader: "杨十四",
    progress: 30,
    startDate: "2023-03-01",
    endDate: "2023-12-31",
    favorite: false,
    description: "建立荧光标记转基因斑马鱼模型，研究神经发育过程中的基因表达调控。",
    department: "发育生物学研究室",
    location: "深圳",
    budget: 80000,
    animalCount: "50只",
    createdAt: "2023-02-15",
    updatedAt: "2023-03-10"
  }
] 