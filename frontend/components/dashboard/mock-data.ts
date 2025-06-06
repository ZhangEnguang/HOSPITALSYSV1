// 模拟数据
export const mockData = {
  // 经费入账情况
  fundingReceipt: {
    categories: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"],
    series: [
      {
        name: "纵向项目",
        data: [320, 450, 280, 390, 520, 680, 420, 590],
      },
      {
        name: "横向项目",
        data: [180, 230, 350, 290, 410, 320, 370, 280],
      },
      {
        name: "校级项目",
        data: [120, 90, 140, 110, 170, 130, 150, 100],
      },
    ],
  },
  // 合同签订情况
  contractSigning: [
    { value: 42, name: "纵向项目" },
    { value: 28, name: "横向项目" },
    { value: 18, name: "校级项目" },
    { value: 12, name: "其他类型" },
  ],
  // 项目&经费年度变化趋势
  annualTrends: {
    years: ["2019", "2020", "2021", "2022", "2023", "2024"],
    projects: [45, 52, 68, 79, 95, 110],
    funding: [1200, 1450, 1680, 1950, 2380, 2850],
  },
  // 银行来款情况
  bankPayments: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"],
    data: [580, 680, 790, 920, 850, 1050, 980, 1150],
  },
  // 学院科研经费TOP 5
  collegeTop5: {
    colleges: ["计算机学院", "电子信息学院", "机械工程学院", "材料科学学院", "经济管理学院"],
    data: [1850, 1620, 1450, 1280, 1050],
  },
  // 立项经费情况
  projectFunding: [
    { value: 4500, name: "国家级项目" },
    { value: 3200, name: "省部级项目" },
    { value: 2100, name: "市厅级项目" },
    { value: 1800, name: "企业合作项目" },
    { value: 900, name: "校级项目" },
  ],
  // 经费类型分布
  fundingByType: [
    { value: 38, name: "设备费" },
    { value: 25, name: "材料费" },
    { value: 18, name: "测试化验费" },
    { value: 12, name: "差旅费" },
    { value: 7, name: "会议费" },
  ],
  // 月度经费对比
  monthlyComparison: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"],
    currentYear: [320, 450, 520, 610, 580, 750, 690, 820],
    lastYear: [280, 390, 460, 530, 510, 680, 620, 750],
  },
  // 项目完成情况
  projectCompletion: {
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    planned: [25, 35, 40, 30],
    completed: [22, 32, 38, 28],
    completionRate: [88, 91, 95, 93],
  },
  // 添加统计卡片的趋势数据
  cardTrends: {
    projects: [10, 8, 12, 15, 11, 14, 12, 16, 14, 18, 20, 22],
    tasks: [18, 22, 19, 23, 25, 28, 24, 26, 29, 32, 30, 35],
    funding: [800, 950, 1100, 1050, 1200, 1300, 1250, 1400, 1500, 1600, 1700, 1800],
    achievements: [5, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42],
  },
}

