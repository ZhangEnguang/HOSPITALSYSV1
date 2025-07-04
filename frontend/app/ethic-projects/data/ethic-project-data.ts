// 伦理项目模拟数据
export const mockEthicProjects = [
  {
    id: "1",
    projectNumber: "AE-2024-0001",
    name: "实验大鼠药代谢研究",
    description: "研究药物在大鼠体内的代谢过程及其机制",
    status: "进行中",
    auditStatus: "审核通过",
    priority: "高",
    type: "动物伦理",
    source: "国家自然科学基金",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    progress: 35,
    tasks: { completed: 3, total: 8 },
    leader: { id: "1", name: "陈明宇", avatar: "/placeholder.svg?height=32&width=32" },
    members: 8,
    budget: 850000,
    isFavorite: true,
  },
  {
    id: "2",
    projectNumber: "AE-2024-0002",
    name: "狗肾脏器官移植研究动物伦理评价",
    description: "研究犬类肾脏器官移植的手术方案与术后护理标准，评估动物伦理合规性",
    status: "规划中",
    auditStatus: "待审核",
    priority: "中",
    type: "动物伦理",
    source: "省级科研基金",
    startDate: "2024-03-01",
    endDate: "2027-02-28",
    progress: 10,
    tasks: { completed: 3, total: 30 },
    leader: { id: "2", name: "李雪松", avatar: "/placeholder.svg?height=32&width=32" },
    members: 6,
    budget: 720000,
    isFavorite: false,
  },
  {
    id: "3",
    projectNumber: "HE-2024-0001",
    name: "多人种样本基因测序与健康风险预测",
    description: "采集不同人种血液样本进行基因组测序分析，研究疾病易感性与健康风险预测",
    status: "进行中",
    auditStatus: "审核通过",
    priority: "高",
    type: "人体伦理",
    source: "国家重点研发计划",
    startDate: "2024-01-15",
    endDate: "2027-12-31",
    progress: 35,
    tasks: { completed: 12, total: 36 },
    leader: { id: "3", name: "王建国", avatar: "/placeholder.svg?height=32&width=32" },
    members: 12,
    budget: 2450000,
    isFavorite: true,
    负责人所属单位: "基础医学院",
    研究执行单位: "遗传学研究中心",
  },
  {
    id: "4",
    projectNumber: "AE-2023-0001",
    name: "猪心脏移植术后神经系统变化研究",
    description: "探究猪心脏移植术后神经系统变化规律，分析相关并发症机制",
    status: "已完成",
    auditStatus: "审核通过",
    priority: "高",
    type: "动物伦理",
    source: "校级研究项目",
    startDate: "2023-10-01",
    endDate: "2024-03-31",
    progress: 100,
    tasks: { completed: 20, total: 20 },
    leader: { id: "4", name: "张伟", avatar: "/placeholder.svg?height=32&width=32" },
    members: 5,
    budget: 350000,
    isFavorite: false,
  },
  {
    id: "5",
    projectNumber: "HE-2024-0002",
    name: "新生儿肺带血干细胞提取技术评估",
    description: "研究新生儿肺带血干细胞提取技术的临床安全性与有效性，评估伦理标准",
    status: "进行中",
    auditStatus: "审核中",
    priority: "中",
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2024-02-15",
    endDate: "2025-12-15",
    progress: 45,
    tasks: { completed: 9, total: 20 },
    leader: { id: "5", name: "孙丽娜", avatar: "/placeholder.svg?height=32&width=32" },
    members: 7,
    budget: 920000,
    isFavorite: true,
    负责人所属单位: "儿科医学院",
    研究执行单位: "新生儿科",
  },
  {
    id: "6",
    projectNumber: "AE-2024-0003",
    name: "犬类眼科疾病治疗方案动物伦理评估",
    description: "研究犬类常见眼科疾病治疗方案，制定动物试验伦理标准与福利保障措施",
    status: "规划中",
    auditStatus: "审核退回",
    priority: "中",
    type: "动物伦理",
    source: "省级科研基金",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    progress: 0,
    tasks: { completed: 0, total: 15 },
    leader: { id: "6", name: "朱海燕", avatar: "/placeholder.svg?height=32&width=32" },
    members: 4,
    budget: 320000,
    isFavorite: false,
  },
  {
    id: "7",
    projectNumber: "HE-2024-0003",
    name: "老年痴呆症患者实验性药物临床试验",
    description: "针对老年痴呆症患者的实验性药物临床试验，评估药效与安全性",
    status: "进行中",
    auditStatus: "审核通过",
    priority: "高",
    type: "人体伦理",
    source: "国家重点研发计划",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    progress: 30,
    tasks: { completed: 9, total: 30 },
    leader: { id: "7", name: "郑海涛", avatar: "/placeholder.svg?height=32&width=32" },
    members: 10,
    budget: 1680000,
    isFavorite: false,
    负责人所属单位: "神经科学院",
    研究执行单位: "神经内科",
  },
  {
    id: "8",
    projectNumber: "AE-2024-0004",
    name: "家兔耳神经修复实验方案伦理评审",
    description: "研究家兔耳神经损伤修复的实验方案，制定相关伦理标准与动物福利保障",
    status: "进行中",
    auditStatus: "审核通过",
    priority: "中",
    type: "动物伦理",
    source: "校级研究项目",
    startDate: "2024-03-15",
    endDate: "2025-06-30",
    progress: 40,
    tasks: { completed: 8, total: 20 },
    leader: { id: "8", name: "杨文静", avatar: "/placeholder.svg?height=32&width=32" },
    members: 5,
    budget: 280000,
    isFavorite: true,
  },
  {
    id: "9",
    projectNumber: "HE-2024-0004",
    name: "孕妇胎儿血液采集技术伦理研究",
    description: "研究孕妇胎儿血液采集技术的安全性与伦理规范，制定相关标准",
    status: "规划中",
    auditStatus: "待审核",
    priority: "高",
    type: "人体伦理",
    source: "省级科研基金",
    startDate: "2024-07-01",
    endDate: "2025-12-31",
    progress: 0,
    tasks: { completed: 0, total: 24 },
    leader: { id: "9", name: "刘晓峰", avatar: "/placeholder.svg?height=32&width=32" },
    members: 8,
    budget: 750000,
    isFavorite: false,
    负责人所属单位: "妇产科学院",
    研究执行单位: "产科医学中心",
  },
  {
    id: "10",
    projectNumber: "AE-2023-0002",
    name: "啮齿类动物神经毒理学实验标准制定",
    description: "研究啮齿类动物神经毒理学实验的标准流程，评估伦理风险与动物福利",
    status: "已完成",
    auditStatus: "审核通过",
    priority: "中",
    type: "动物伦理",
    source: "校级研究项目",
    startDate: "2023-09-01",
    endDate: "2024-02-28",
    progress: 100,
    tasks: { completed: 18, total: 18 },
    leader: { id: "10", name: "赵明", avatar: "/placeholder.svg?height=32&width=32" },
    members: 6,
    budget: 230000,
    isFavorite: false,
  },
  {
    id: "11",
    projectNumber: "HE-2024-0005",
    name: "人体干细胞移植治疗帕金森病研究",
    description: "研究人体干细胞移植治疗帕金森病的临床疗效与安全性评估",
    status: "进行中",
    auditStatus: "审核中",
    priority: "高",
    type: "人体伦理",
    source: "国家自然科学基金",
    startDate: "2024-04-01",
    endDate: "2027-03-31",
    progress: 20,
    tasks: { completed: 5, total: 25 },
    leader: { id: "11", name: "周健", avatar: "/placeholder.svg?height=32&width=32" },
    members: 9,
    budget: 1350000,
    isFavorite: true,
    负责人所属单位: "再生医学院",
    研究执行单位: "干细胞治疗中心",
  },
  {
    id: "12",
    projectNumber: "AE-2024-0005",
    name: "灵长类动物行为学研究伦理规范",
    description: "研究灵长类动物行为学实验的伦理规范与福利保障，制定实验标准",
    status: "规划中",
    auditStatus: "待审核",
    priority: "低",
    type: "动物伦理",
    source: "省级科研基金",
    startDate: "2024-06-15",
    endDate: "2025-12-31",
    progress: 0,
    tasks: { completed: 0, total: 20 },
    leader: { id: "12", name: "陈思远", avatar: "/placeholder.svg?height=32&width=32" },
    members: 7,
    budget: 420000,
    isFavorite: false,
  },
]; 