// 生成模拟数据
export const initialFundsItems = [
  // 经费入账数据
  {
    id: "1",
    name: "国家自然科学基金项目经费入账",
    description: "基于深度学习的复杂场景目标检测与跟踪关键技术研究项目经费",
    project: { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    type: "入账",
    category: "纵向项目经费",
    amount: 850000.0,
    status: "已通过",
    applicant: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-01-10",
    approver: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-01-12",
    attachments: 2,
    source: "国家自然科学基金委员会",
    accountNumber: "10001-20240110-NSFC",
  },
  {
    id: "2",
    name: "省部级重点项目经费入账",
    description: "新型高效光电转换材料的设计与制备研究项目经费",
    project: { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    type: "入账",
    category: "纵向项目经费",
    amount: 500000.0,
    status: "已通过",
    applicant: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-01-15",
    approver: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-01-17",
    attachments: 3,
    source: "省科技厅",
    accountNumber: "10002-20240115-PROV",
  },
  {
    id: "3",
    name: "企业合作项目经费入账",
    description: "新能源汽车动力电池回收利用技术研究项目经费",
    project: { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    type: "入账",
    category: "横向项目经费",
    amount: 300000.0,
    status: "已通过",
    applicant: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-02-05",
    approver: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-02-07",
    attachments: 2,
    source: "某新能源科技有限公司",
    accountNumber: "20001-20240205-CORP",
  },

  // 经费外拨数据
  {
    id: "4",
    name: "合作单位经费外拨",
    description: "基于深度学习的复杂场景目标检测项目合作单位经费",
    project: { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    type: "外拨",
    category: "合作经费",
    amount: 200000.0,
    status: "已通过",
    applicant: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-02-10",
    approver: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-02-12",
    attachments: 3,
    recipient: "某大学计算机学院",
    recipientAccount: "6225xxxxxxxxxxxx",
    recipientBank: "中国建设银行",
  },
  {
    id: "5",
    name: "设备采购款外拨",
    description: "新型高效光电转换材料项目设备采购款",
    project: { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    type: "外拨",
    category: "设备采购",
    amount: 150000.0,
    status: "待审核",
    applicant: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-03-05",
    approver: null,
    approveDate: null,
    attachments: 2,
    recipient: "某科学仪器有限公司",
    recipientAccount: "6228xxxxxxxxxxxx",
    recipientBank: "中国工商银行",
  },
  {
    id: "6",
    name: "材料采购款外拨",
    description: "新能源汽车动力电池项目材料采购款",
    project: { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    type: "外拨",
    category: "材料采购",
    amount: 80000.0,
    status: "已退回",
    applicant: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-02-20",
    approver: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-02-22",
    attachments: 2,
    recipient: "某材料科技有限公司",
    recipientAccount: "6217xxxxxxxxxxxx",
    recipientBank: "中国农业银行",
  },

  // 经费报销数据
  {
    id: "7",
    name: "会议费报销",
    description: "参加全国学术会议的差旅费和会议注册费",
    project: { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    type: "报销",
    category: "会议费",
    amount: 8500.0,
    status: "已报销",
    applicant: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-02-15",
    approver: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-02-17",
    attachments: 5,
    expenseType: "会议费",
    expenseDate: "2024-02-10",
    receiptNumber: "R20240210-001",
  },
  {
    id: "8",
    name: "差旅费报销",
    description: "项目调研差旅费",
    project: { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    type: "报销",
    category: "差旅费",
    amount: 5200.0,
    status: "待审核",
    applicant: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-03-10",
    approver: null,
    approveDate: null,
    attachments: 4,
    expenseType: "差旅费",
    expenseDate: "2024-03-05",
    receiptNumber: "R20240305-002",
  },
  {
    id: "9",
    name: "材料费报销",
    description: "实验耗材采购费用报销",
    project: { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    type: "报销",
    category: "材料费",
    amount: 12000.0,
    status: "已通过",
    applicant: { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-02-25",
    approver: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-02-27",
    attachments: 3,
    expenseType: "材料费",
    expenseDate: "2024-02-20",
    receiptNumber: "R20240220-003",
  },

  // 经费结转数据
  {
    id: "10",
    name: "年度经费结转",
    description: "国家自然科学基金项目年度经费结转",
    project: { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    type: "结转",
    category: "年度结转",
    amount: 120000.0,
    status: "已通过",
    applicant: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-25",
    approver: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2023-12-27",
    attachments: 2,
    fromYear: "2023",
    toYear: "2024",
    carryoverReason: "项目实施进度调整",
  },
  {
    id: "11",
    name: "项目结题经费结转",
    description: "省部级重点项目结题经费结转",
    project: { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    type: "结转",
    category: "结题结转",
    amount: 50000.0,
    status: "待审核",
    applicant: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-03-15",
    approver: null,
    approveDate: null,
    attachments: 3,
    fromYear: "2023",
    toYear: "2024",
    carryoverReason: "项目延期至2024年6月结题",
  },
  {
    id: "12",
    name: "横向项目经费结转",
    description: "企业合作项目经费结转",
    project: { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    type: "结转",
    category: "合同结转",
    amount: 80000.0,
    status: "已通过",
    applicant: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2024-01-20",
    approver: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    approveDate: "2024-01-22",
    attachments: 2,
    fromYear: "2023",
    toYear: "2024",
    carryoverReason: "合作企业要求延期交付研究成果",
  },
]

// 生成更多模拟数据
export const generateMoreFundsItems = (count: number) => {
  const statuses = ["待审核", "已通过", "已退回", "已报销", "已取消"]
  const types = ["入账", "外拨", "报销", "结转"]
  const categories = {
    入账: ["纵向项目经费", "横向项目经费", "学校配套经费", "其他经费"],
    外拨: ["合作经费", "设备采购", "材料采购", "劳务费", "其他外拨"],
    报销: ["差旅费", "会议费", "材料费", "劳务费", "出版费", "其他费用"],
    结转: ["年度结转", "结题结转", "合同结转", "其他结转"],
  }
  const projects = [
    { id: "1", name: "基于深度学习的复杂场景目标检测与跟踪关键技术研究" },
    { id: "2", name: "新能源汽车动力电池回收利用技术研究" },
    { id: "3", name: "新型高效光电转换材料的设计与制备研究" },
    { id: "4", name: "高校创新创业教育体系构建研究" },
    { id: "5", name: "智慧校园综合管理平台开发" },
  ]
  const applicants = [
    { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "孙七", avatar: "/placeholder.svg?height=32&width=32" },
  ]
  const approvers = [
    { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const sources = ["国家自然科学基金委员会", "省科技厅", "教育部", "某企业", "学校科研基金"]
  const recipients = ["某大学计算机学院", "某科学仪器有限公司", "某材料科技有限公司", "某研究所"]
  const banks = ["中国建设银行", "中国工商银行", "中国农业银行", "中国银行"]
  const expenseTypes = ["差旅费", "会议费", "材料费", "劳务费", "出版费", "其他费用"]

  const additionalItems = []

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const categoryList = categories[type as keyof typeof categories]
    const category = categoryList[Math.floor(Math.random() * categoryList.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const applicant = applicants[Math.floor(Math.random() * applicants.length)]
    const project = projects[Math.floor(Math.random() * projects.length)]

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    let approver = null
    let approveDate = null
    if (status === "已通过" || status === "已退回" || status === "已报销") {
      approver = approvers[Math.floor(Math.random() * approvers.length)]

      const approvalDate = new Date(date)
      approvalDate.setDate(approvalDate.getDate() + Math.floor(Math.random() * 5) + 1)
      approveDate = approvalDate.toISOString().split("T")[0]
    }

    // 根据类型设置金额范围
    let amount = 0
    if (type === "入账") {
      amount = Math.floor(Math.random() * 500000) + 100000
    } else if (type === "外拨") {
      amount = Math.floor(Math.random() * 200000) + 50000
    } else if (type === "报销") {
      amount = Math.floor(Math.random() * 15000) + 1000
    } else {
      amount = Math.floor(Math.random() * 100000) + 30000
    }

    // 基本信息
    const item: any = {
      id: (initialFundsItems.length + i + 1).toString(),
      name: `${type}-${category}-${i + 1}`,
      description: `${project.name}项目的${category}`,
      project,
      type,
      category,
      amount: Number.parseFloat(amount.toFixed(2)),
      status,
      applicant,
      date: date.toISOString().split("T")[0],
      approver,
      approveDate,
      attachments: Math.floor(Math.random() * 5),
    }

    // 根据类型添加特定字段
    if (type === "入账") {
      item.source = sources[Math.floor(Math.random() * sources.length)]
      item.accountNumber = `${Math.floor(Math.random() * 90000) + 10000}-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-IN`
    } else if (type === "外拨") {
      item.recipient = recipients[Math.floor(Math.random() * recipients.length)]
      item.recipientAccount = `${Math.floor(Math.random() * 9000) + 1000}xxxxxxxxxxxx`
      item.recipientBank = banks[Math.floor(Math.random() * banks.length)]
    } else if (type === "报销") {
      item.expenseType = expenseTypes[Math.floor(Math.random() * expenseTypes.length)]
      const expenseDate = new Date(date)
      expenseDate.setDate(expenseDate.getDate() - Math.floor(Math.random() * 10))
      item.expenseDate = expenseDate.toISOString().split("T")[0]
      item.receiptNumber = `R${expenseDate.getFullYear()}${(expenseDate.getMonth() + 1).toString().padStart(2, "0")}${expenseDate.getDate().toString().padStart(2, "0")}-${Math.floor(Math.random() * 900) + 100}`
    } else if (type === "结转") {
      item.fromYear = (date.getFullYear() - 1).toString()
      item.toYear = date.getFullYear().toString()
      item.carryoverReason = ["项目实施进度调整", "项目延期", "合作方要求延期", "经费使用计划调整"][
        Math.floor(Math.random() * 4)
      ]
    }

    additionalItems.push(item)
  }

  return additionalItems
}

// 扩展初始经费数据
export const extendedFundsItems = [...initialFundsItems, ...generateMoreFundsItems(8)]

