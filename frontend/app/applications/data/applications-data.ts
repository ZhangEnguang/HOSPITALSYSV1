import { ApplicationItem } from "../types"

export const extendedApplicationItems: ApplicationItem[] = [
  {
    id: "2022-batch-1",
    name: "2022年度校级青年科研项目申报",
    description: "面向全校青年教师征集2022年度校级青年科研项目申报。",
    type: "校级项目",
    category: "青年基金",
    amount: 120.00,
    progress: 100,
    formGenerationType: "全流程在线生成",
    date: "2022-03-01",
    deadline: "2022-04-30",
    batch: "申报批次",
    batchNumber: "2022-01",
    projectCount: 35,
    status: "已完成",
    priority: "高",
    applicant: {
    id: "1",
      name: "张三"
    }
  },
  {
    id: "2023-batch-1",
    name: "2023年度校级重点项目申报",
    description: "面向全校教师征集2023年度校级重点项目申报。",
    type: "校级项目",
    category: "重点项目",
    amount: 1000.00,
    progress: 100,
    formGenerationType: "智能协同生成",
    date: "2023-09-15",
    deadline: "2023-10-15",
    batch: "申报批次",
    batchNumber: "2023-01",
    projectCount: 24,
    status: "已完成",
    priority: "高",
    applicant: {
      id: "2",
      name: "李四"
    }
  },
  {
    id: "2024-batch-1",
    name: "2024年度教育部人文社科项目申报",
    description: "面向全校教师征集2024年度教育部人文社科项目申报。",
    type: "国家级",
    category: "人文社科",
    amount: 800.00,
    progress: 80,
    formGenerationType: "线下模板化",
    date: "2024-01-20",
    deadline: "2024-02-20",
    batch: "申报批次",
    batchNumber: "2024-01",
    projectCount: 18,
    status: "已结束",
    priority: "高",
    applicant: {
      id: "3",
      name: "王五"
    }
  },
  {
    id: "2024-batch-2",
    name: "2024年度自然科学基金项目申报",
    description: "面向全校教师征集2024年度自然科学基金项目申报。",
    type: "省部级",
    category: "自然科学",
    amount: 486.10,
    progress: 100,
    formGenerationType: "线下模板化",
    date: "2024-06-03",
    deadline: "2024-09-16",
    batch: "申报批次",
    batchNumber: "2024-02",
    projectCount: 27,
    status: "已完成",
    priority: "中",
    applicant: {
      id: "4",
      name: "赵六"
    }
  },
  {
    id: "2024-batch-3",
    name: "2024年度省级科技创新项目申报",
    description: "面向全校教师征集2024年度省级科技创新项目申报。",
    type: "省部级",
    category: "多学科",
    amount: 650.00,
    progress: 45,
    formGenerationType: "线下模板化",
    date: "2023-12-01",
    deadline: "2024-01-20",
    batch: "申报批次",
    batchNumber: "2024-03",
    projectCount: 12,
    status: "已结束",
    priority: "中",
    applicant: {
      id: "5",
      name: "孙七"
    }
  },
  {
    id: "2025-batch-1",
    name: "2025年度国家重点研发计划项目申报",
    description: "面向全校教师征集2025年度国家重点研发计划项目申报。",
    type: "国家级",
    category: "工程技术",
    amount: 1500.00,
    progress: 0,
    formGenerationType: "线下模板化",
    date: "2025-01-15",
    deadline: "2025-03-15",
    batch: "申报批次",
    batchNumber: "2025-01",
    projectCount: 0,
    status: "未开始",
    priority: "高",
    applicant: {
      id: "6",
      name: "周八"
    }
  },
  {
    id: "2024-review-1",
    name: "2024年度校级科研项目评审",
    description: "对2024年度申报的校级科研项目进行专家评审。",
    type: "校级",
    category: "多学科",
    amount: 300.00,
    progress: 60,
    formGenerationType: "线下模板化",
    date: "2024-03-01",
    deadline: "2024-04-30",
    batch: "评审批次",
    batchNumber: "2024-R01",
    projectCount: 28,
    status: "进行中",
    priority: "高",
    applicant: {
      id: "7",
      name: "郑九"
    }
  },
  {
    id: "2024-review-2",
    name: "2024年度国家自然科学基金项目评审",
    description: "对2024年度申报的国家自然科学基金项目进行专家评审。",
    type: "国家级",
    category: "自然科学",
    amount: 1200.00,
    progress: 85,
    formGenerationType: "线下模板化",
    date: "2024-02-15",
    deadline: "2024-05-15",
    batch: "评审批次",
    batchNumber: "2024-R02",
    projectCount: 42,
    status: "进行中",
    priority: "高",
    applicant: {
      id: "8",
      name: "钱十"
    }
  },
  {
    id: "2024-review-3",
    name: "2024年度人文社科项目评审",
    description: "对2024年度申报的人文社科项目进行专家评审。",
    type: "省部级",
    category: "人文社科",
    amount: 500.00,
    progress: 40,
    formGenerationType: "线下模板化",
    date: "2024-04-01",
    deadline: "2024-06-30",
    batch: "评审批次",
    batchNumber: "2024-R03",
    projectCount: 15,
    status: "进行中",
    priority: "中",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  },
  {
    id: "review-2024-01",
    name: "2024年第一批国家自然科学基金项目评审",
    description: "针对2024年第一批申报的国家自然科学基金项目进行专家评审，包括面上项目、青年科学基金项目等多个类别。",
    type: "自然科学基金",
    category: "自然科学",
    amount: 1500.00,
    progress: 30,
    formGenerationType: "线下模板化",
    date: "2024-03-01",
    deadline: "2024-04-30",
    batch: "评审批次",
    batchNumber: "REVIEW-2024-01",
    projectCount: 45,
    status: "进行中",
    priority: "高",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  },
  {
    id: "review-2024-02",
    name: "2024年度教育部人文社科项目评审",
    description: "对2024年度申报的教育部人文社会科学研究项目进行评审，涵盖规划基金、青年基金等类别。",
    type: "人文社科",
    category: "人文社科",
    amount: 800.00,
    progress: 60,
    formGenerationType: "线下模板化",
    date: "2024-02-15",
    deadline: "2024-03-31",
    batch: "评审批次",
    batchNumber: "REVIEW-2024-02",
    projectCount: 32,
    status: "进行中",
    priority: "中",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  },
  {
    id: "review-2024-03",
    name: "2024年省级重点实验室评审",
    description: "对申请认定的省级重点实验室进行综合评审，包括实验室条件、研究方向、团队实力等多个维度。",
    type: "重点实验室",
    category: "工程技术",
    amount: 2000.00,
    progress: 45,
    formGenerationType: "线下模板化",
    date: "2024-03-15",
    deadline: "2024-05-15",
    batch: "评审批次",
    batchNumber: "REVIEW-2024-03",
    projectCount: 15,
    status: "进行中",
    priority: "高",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  },
  {
    id: "review-2024-04",
    name: "2024年校级创新创业项目评审",
    description: "对校内申报的创新创业项目进行评审，包括学生创新项目、创业孵化项目等多个类别。",
    type: "创新创业",
    category: "创新创业",
    amount: 300.00,
    progress: 80,
    formGenerationType: "线下模板化",
    date: "2024-01-10",
    deadline: "2024-02-28",
    batch: "评审批次",
    batchNumber: "REVIEW-2024-04",
    projectCount: 28,
    status: "已结束",
    priority: "中",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  },
  {
    id: "review-2024-05",
    name: "2024年度医学科研项目评审",
    description: "对医学院及附属医院申报的科研项目进行评审，包括临床医学、基础医学等多个研究方向。",
    type: "医学科研",
    category: "医药科学",
    amount: 1200.00,
    progress: 20,
    formGenerationType: "线下模板化",
    date: "2024-03-20",
    deadline: "2024-05-20",
      batch: "评审批次",
    batchNumber: "REVIEW-2024-05",
    projectCount: 36,
    status: "进行中",
    priority: "高",
    applicant: {
      id: "9",
      name: "孙十一"
    }
  }
]

