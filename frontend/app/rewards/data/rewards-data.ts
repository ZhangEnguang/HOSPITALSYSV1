// 考核标准数据
export interface AssessmentStandard {
  id: string;
  name: string;
  description: string;
  department: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalScore: number;
  status: string;
  applicableType?: "个人考核" | "部门考核";
  criteria: {
    id: string;
    name: string;
    maxScore: number;
  }[];
}

export const assessmentStandards: AssessmentStandard[] = [
  {
    id: "1",
    name: "研发部绩效考核标准",
    description: "适用于研发部门的绩效考核标准，重点评估技术能力和项目交付",
    department: "研发部",
    createdBy: "李四",
    createdAt: "2023-11-15",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "个人考核",
    criteria: [
      { id: "workQuality", name: "工作质量", maxScore: 25 },
      { id: "workEfficiency", name: "工作效率", maxScore: 20 },
      { id: "technicalSkills", name: "技术能力", maxScore: 25 },
      { id: "teamwork", name: "团队协作", maxScore: 15 },
      { id: "innovation", name: "创新能力", maxScore: 15 },
    ],
  },
  {
    id: "2",
    name: "市场部绩效考核标准",
    description: "适用于市场部门的绩效考核标准，重点评估营销效果和客户关系",
    department: "市场部",
    createdBy: "李四",
    createdAt: "2023-11-16",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "个人考核",
    criteria: [
      { id: "marketingEffectiveness", name: "营销效果", maxScore: 30 },
      { id: "customerRelationship", name: "客户关系", maxScore: 25 },
      { id: "marketAnalysis", name: "市场分析", maxScore: 20 },
      { id: "teamwork", name: "团队协作", maxScore: 15 },
      { id: "innovation", name: "创新能力", maxScore: 10 },
    ],
  },
  {
    id: "3",
    name: "人力资源部绩效考核标准",
    description: "适用于人力资源部门的绩效考核标准，重点评估招聘效果和员工关系",
    department: "人力资源部",
    createdBy: "王五",
    createdAt: "2023-11-17",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "个人考核",
    criteria: [
      { id: "recruitmentEffectiveness", name: "招聘效果", maxScore: 25 },
      { id: "employeeRelations", name: "员工关系", maxScore: 25 },
      { id: "trainingDevelopment", name: "培训发展", maxScore: 20 },
      { id: "performanceManagement", name: "绩效管理", maxScore: 20 },
      { id: "compliance", name: "合规性", maxScore: 10 },
    ],
  },
  {
    id: "4",
    name: "财务部绩效考核标准",
    description: "适用于财务部门的绩效考核标准，重点评估财务报告准确性和成本控制",
    department: "财务部",
    createdBy: "赵六",
    createdAt: "2023-11-18",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "个人考核",
    criteria: [
      { id: "financialReporting", name: "财务报告", maxScore: 30 },
      { id: "costControl", name: "成本控制", maxScore: 25 },
      { id: "financialAnalysis", name: "财务分析", maxScore: 20 },
      { id: "compliance", name: "合规性", maxScore: 15 },
      { id: "riskManagement", name: "风险管理", maxScore: 10 },
    ],
  },
  {
    id: "5",
    name: "运营部绩效考核标准",
    description: "适用于运营部门的绩效考核标准，重点评估运营效率和客户服务",
    department: "运营部",
    createdBy: "钱七",
    createdAt: "2023-11-19",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "个人考核",
    criteria: [
      { id: "operationalEfficiency", name: "运营效率", maxScore: 30 },
      { id: "customerService", name: "客户服务", maxScore: 25 },
      { id: "qualityControl", name: "质量控制", maxScore: 20 },
      { id: "teamwork", name: "团队协作", maxScore: 15 },
      { id: "problemSolving", name: "问题解决", maxScore: 10 },
    ],
  },
  {
    id: "6",
    name: "研发部门整体考核标准",
    description: "适用于研发部门整体的绩效考核标准，重点评估部门整体项目交付和技术创新",
    department: "研发部",
    createdBy: "张三",
    createdAt: "2023-11-20",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "部门考核",
    criteria: [
      { id: "projectDelivery", name: "项目交付", maxScore: 30 },
      { id: "codeQuality", name: "代码质量", maxScore: 20 },
      { id: "technicalInnovation", name: "技术创新", maxScore: 20 },
      { id: "teamManagement", name: "团队管理", maxScore: 15 },
      { id: "knowledgeSharing", name: "知识共享", maxScore: 15 },
    ],
  },
  {
    id: "7",
    name: "市场部门整体考核标准",
    description: "适用于市场部门整体的绩效考核标准，重点评估市场拓展和品牌建设",
    department: "市场部",
    createdBy: "李四",
    createdAt: "2023-11-21",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "部门考核",
    criteria: [
      { id: "marketExpansion", name: "市场拓展", maxScore: 30 },
      { id: "brandBuilding", name: "品牌建设", maxScore: 25 },
      { id: "customerSatisfaction", name: "客户满意度", maxScore: 20 },
      { id: "marketingROI", name: "营销投资回报", maxScore: 15 },
      { id: "competitiveAnalysis", name: "竞争分析", maxScore: 10 },
    ],
  },
  {
    id: "8",
    name: "人力资源部门整体考核标准",
    description: "适用于人力资源部门整体的绩效考核标准，重点评估人才招聘和员工发展",
    department: "人力资源部",
    createdBy: "王五",
    createdAt: "2023-11-22",
    updatedAt: "2023-12-01",
    totalScore: 100,
    status: "已发布",
    applicableType: "部门考核",
    criteria: [
      { id: "talentAcquisition", name: "人才招聘", maxScore: 25 },
      { id: "employeeDevelopment", name: "员工发展", maxScore: 25 },
      { id: "organizationCulture", name: "组织文化", maxScore: 20 },
      { id: "compensationBenefits", name: "薪酬福利", maxScore: 15 },
      { id: "employeeRetention", name: "员工保留", maxScore: 15 },
    ],
  },
];

// 将考核标准添加到初始数据中
const standardItems = assessmentStandards.map(standard => ({
  id: `standard_${standard.id}`,
  name: standard.name,
  avatar: "/placeholder.svg?height=32&width=32",
  type: "考核标准",
  department: standard.department || "全公司",
  author: standard.createdBy || "系统管理员",
  title: standard.name,
  description: standard.description,
  updatedAt: standard.updatedAt || "2023-12-01",
  status: standard.status || "正常",
  completionRate: 100,
  position: "",
  period: "",
  score: standard.totalScore || 100,
  result: standard.status || "正常",
  evaluator: {
    id: 1,
    name: standard.createdBy || "系统管理员",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  date: standard.updatedAt || "2023-12-01",
  comments: standard.description,
}));

// 生成模拟数据
const baseRewardItems = [
  {
    id: "1",
    name: "张三",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "研发部",
    position: "高级工程师",
    period: "2023年第四季度",
    score: 92,
    result: "优秀",
    evaluator: { id: 4, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-28",
    comments: "工作表现出色，能够高效完成任务，团队协作能力强。",
  },
  {
    id: "2",
    name: "李四",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "市场部",
    position: "市场经理",
    period: "2023年第四季度",
    score: 88,
    result: "良好",
    evaluator: { id: 5, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-27",
    comments: "市场策略制定合理，执行力强，但创新性有待提高。",
  },
  {
    id: "3",
    name: "王五",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "人力资源部",
    position: "HR主管",
    period: "2023年第四季度",
    score: 95,
    result: "优秀",
    evaluator: { id: 6, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-26",
    comments: "人才招聘和培养工作出色，员工满意度高，团队氛围良好。",
  },
  {
    id: "4",
    name: "赵六",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "财务部",
    position: "财务总监",
    period: "2023年第四季度",
    score: 85,
    result: "良好",
    evaluator: { id: 7, name: "钱七", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-25",
    comments: "财务管理规范，报表准确，但成本控制方面有待加强。",
  },
  {
    id: "5",
    name: "钱七",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "运营部",
    position: "运营经理",
    period: "2023年第四季度",
    score: 78,
    result: "合格",
    evaluator: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-24",
    comments: "日常运营工作基本完成，但效率和创新方面需要提升。",
  },
  {
    id: "6",
    name: "孙八",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "研发部",
    position: "前端开发",
    period: "2023年第四季度",
    score: 90,
    result: "优秀",
    evaluator: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-23",
    comments: "技术能力强，代码质量高，能够按时完成任务，团队协作良好。",
  },
  {
    id: "7",
    name: "周九",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "研发部",
    position: "后端开发",
    period: "2023年第四季度",
    score: 86,
    result: "良好",
    evaluator: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-22",
    comments: "系统架构设计合理，性能优化有成效，但文档编写不够详细。",
  },
  {
    id: "8",
    name: "吴十",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "市场部",
    position: "市场专员",
    period: "2023年第四季度",
    score: 82,
    result: "良好",
    evaluator: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-21",
    comments: "市场活动策划和执行能力强，但数据分析能力有待提高。",
  },
  {
    id: "9",
    name: "郑十一",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "人力资源部",
    position: "招聘专员",
    period: "2023年第四季度",
    score: 75,
    result: "合格",
    evaluator: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-20",
    comments: "基本完成招聘任务，但招聘效率和人才质量需要提升。",
  },
  {
    id: "10",
    name: "王十二",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核成员",
    department: "财务部",
    position: "会计",
    period: "2023年第四季度",
    score: 65,
    result: "不合格",
    evaluator: { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-19",
    comments: "工作态度不认真，多次出现账务错误，需要加强专业知识学习。",
  },
  {
    id: "11",
    name: "研发部Q4考核统计",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核统计",
    department: "研发部",
    position: "",
    period: "2023年第四季度",
    score: 89,
    result: "良好",
    evaluator: { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-30",
    comments: "研发部整体表现良好，技术创新能力强，但项目进度控制有待加强。",
    statistics: {
      totalMembers: 15,
      excellent: 5,
      good: 8,
      pass: 2,
      fail: 0,
      averageScore: 89,
    },
  },
  {
    id: "12",
    name: "市场部Q4考核统计",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核统计",
    department: "市场部",
    position: "",
    period: "2023年第四季度",
    score: 85,
    result: "良好",
    evaluator: { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-30",
    comments: "市场部整体表现良好，市场拓展有成效，但客户维护工作需要加强。",
    statistics: {
      totalMembers: 10,
      excellent: 3,
      good: 5,
      pass: 2,
      fail: 0,
      averageScore: 85,
    },
  },
  {
    id: "13",
    name: "人力资源部Q4考核统计",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "考核统计",
    department: "人力资源部",
    position: "",
    period: "2023年第四季度",
    score: 82,
    result: "良好",
    evaluator: { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-30",
    comments: "人力资源部整体表现良好，但员工培训和发展工作有待加强。",
    statistics: {
      totalMembers: 8,
      excellent: 2,
      good: 4,
      pass: 2,
      fail: 0,
      averageScore: 82,
    },
  },
  {
    id: "14",
    name: "张三Q4评分报告",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "评分报告",
    department: "研发部",
    position: "高级工程师",
    period: "2023年第四季度",
    score: 92,
    result: "优秀",
    evaluator: { id: 4, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-28",
    comments: "工作表现出色，能够高效完成任务，团队协作能力强。",
    reportDetails: {
      technicalSkills: 95,
      teamwork: 90,
      communication: 88,
      innovation: 92,
      responsibility: 94,
      comments: "技术能力突出，项目管理有序，团队协作良好，是团队的核心力量。",
    },
  },
  {
    id: "15",
    name: "李四Q4评分报告",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "评分报告",
    department: "市场部",
    position: "市场经理",
    period: "2023年第四季度",
    score: 88,
    result: "良好",
    evaluator: { id: 5, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-27",
    comments: "市场策略制定合理，执行力强，但创新性有待提高。",
    reportDetails: {
      marketingSkills: 90,
      customerRelations: 85,
      teamManagement: 88,
      innovation: 82,
      responsibility: 90,
      comments: "市场推广能力强，客户关系维护良好，但市场创新方面需要加强。",
    },
  },
  {
    id: "16",
    name: "王五Q4评分报告",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "评分报告",
    department: "人力资源部",
    position: "HR主管",
    period: "2023年第四季度",
    score: 95,
    result: "优秀",
    evaluator: { id: 6, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    date: "2023-12-26",
    comments: "人才招聘和培养工作出色，员工满意度高，团队氛围良好。",
    reportDetails: {
      recruitmentSkills: 96,
      employeeRelations: 94,
      trainingManagement: 92,
      policyImplementation: 95,
      responsibility: 96,
      comments: "人才招聘和培养工作出色，员工关系处理得当，是部门的中坚力量。",
    },
  },
];

// 生成更多模拟数据
const generateMoreRewardItems = (count: number) => {
  const departments = ["研发部", "市场部", "人力资源部", "财务部", "运营部"];
  const positions = {
    研发部: ["前端开发", "后端开发", "测试工程师", "产品经理", "UI设计师"],
    市场部: ["市场专员", "市场经理", "品牌专员", "活动策划", "市场分析师"],
    人力资源部: ["招聘专员", "培训专员", "绩效评估员", "薪酬专员", "HR助理"],
    财务部: ["会计", "出纳", "财务分析师", "税务专员", "审计专员"],
    运营部: ["运营专员", "内容运营", "用户运营", "活动运营", "数据分析师"],
  };
  const results = ["优秀", "良好", "合格", "不合格"];
  const resultWeights = [0.3, 0.4, 0.2, 0.1]; // 权重，使结果分布更合理
  const periods = ["2023年第四季度", "2023年第三季度", "2023年第二季度", "2023年第一季度"];
  const evaluators = [
    { id: 1, name: "张三", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "李四", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "王五", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "赵六", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "钱七", avatar: "/placeholder.svg?height=32&width=32" },
  ];

  const names = [
    "刘一",
    "陈二",
    "张三",
    "李四",
    "王五",
    "赵六",
    "孙七",
    "周八",
    "吴九",
    "郑十",
    "冯十一",
    "朱十二",
    "魏十三",
    "蒋十四",
    "沈十五",
    "韩十六",
    "杨十七",
    "朱十八",
    "秦十九",
    "尤二十",
  ];

  const additionalItems = [];

  for (let i = 0; i < count; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position =
      positions[department as keyof typeof positions][
        Math.floor(Math.random() * positions[department as keyof typeof positions].length)
      ];

    // 使用权重随机选择结果
    let resultIndex = 0;
    const rand = Math.random();
    let cumulativeWeight = 0;
    for (let j = 0; j < resultWeights.length; j++) {
      cumulativeWeight += resultWeights[j];
      if (rand < cumulativeWeight) {
        resultIndex = j;
        break;
      }
    }
    const result = results[resultIndex];

    // 根据结果生成合理的分数
    let score = 0;
    if (result === "优秀") {
      score = Math.floor(Math.random() * 10) + 90; // 90-99
    } else if (result === "良好") {
      score = Math.floor(Math.random() * 10) + 80; // 80-89
    } else if (result === "合格") {
      score = Math.floor(Math.random() * 10) + 70; // 70-79
    } else {
      score = Math.floor(Math.random() * 10) + 60; // 60-69
    }

    const period = periods[Math.floor(Math.random() * periods.length)];
    const evaluator = evaluators[Math.floor(Math.random() * evaluators.length)];
    const name = names[Math.floor(Math.random() * names.length)];

    // 生成日期，确保在合理范围内
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));

    additionalItems.push({
      id: (baseRewardItems.length + i + 1).toString(),
      name: `${name}${Math.floor(Math.random() * 100)}`,
      avatar: "/placeholder.svg?height=32&width=32",
      type: "考核成员",
      department,
      position,
      period,
      score,
      result,
      evaluator,
      date: date.toISOString().split("T")[0],
      comments: "考核评语内容，详细说明员工表现和改进建议。",
    });
  }

  return additionalItems;
};

// 扩展初始奖励数据
export const initialRewardItems = [...baseRewardItems, ...standardItems, ...generateMoreRewardItems(10)];
