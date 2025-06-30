// 仪器预约配置演示数据

export interface EquipmentConfigItem {
  id: string
  configName: string           // 配置名称
  configType: "通用" | "自定义"  // 配置类型
  applicableScope?: string     // 适用范围类型（仪器类别、指定仪器、实验室、部门）
  targetScope?: string         // 具体适用目标
  scopeDescription: string     // 适用范围描述
  status: "启用" | "禁用" | "维护中" | "草稿"
  lastUpdated: string
  updatedBy: string
  
  // 预约规则配置
  maxAdvanceBookingDays: number
  requireApproval: boolean
  allowWeekends: boolean
  maxBookingDuration: number
  minBookingDuration: number
  emailNotifications: boolean
  autoApproval: boolean
  maxConcurrentBookings: number
  cancellationDeadline: number
  
  // 时间段配置
  bookingTimeSlots: string[]
  
  // 审核配置
  approvalWorkflow: {
    level1: string[]
    level2: string[]
    autoApprovalConditions: string[]
  }
  
  // 通知配置
  notificationSettings: {
    bookingConfirmation: boolean
    reminderBeforeBooking: boolean
    reminderHours: number
    cancellationNotification: boolean
    statusChangeNotification: boolean
  }
  
  // 使用限制
  usageRestrictions: {
    allowedUserRoles: string[]
    allowedDepartments: string[]
    trainingRequired: boolean
    certificationRequired: boolean
  }
}

export const allDemoEquipmentConfigItems: EquipmentConfigItem[] = [
  {
    id: "config_001",
    configName: "通用仪器预约配置",
    configType: "通用",
    scopeDescription: "适用于所有仪器",
    status: "启用",
    lastUpdated: "2025-06-30 16:02",
    updatedBy: "系统管理员",
    maxAdvanceBookingDays: 30,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 8,
    minBookingDuration: 1,
    emailNotifications: true,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 24,
    bookingTimeSlots: ["09:00-12:00", "13:00-17:00"],
    approvalWorkflow: {
      level1: ["zhang.san"],
      level2: [],
      autoApprovalConditions: []
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 2,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: false,
      certificationRequired: false
    }
  },
  {
    id: "config_002",
    configName: "分析仪器专用配置",
    configType: "自定义",
    applicableScope: "仪器类别",
    targetScope: "分析仪器",
    scopeDescription: "分析仪器类别",
    status: "启用",
    lastUpdated: "2024-01-15 22:30",
    updatedBy: "张三",
    maxAdvanceBookingDays: 60,
    requireApproval: true,
    allowWeekends: true,
    maxBookingDuration: 12,
    minBookingDuration: 2,
    emailNotifications: true,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 48,
    bookingTimeSlots: ["09:00-12:00", "13:00-17:00", "19:00-21:00"],
    approvalWorkflow: {
      level1: ["zhang.san", "li.si"],
      level2: ["prof.chen"],
      autoApprovalConditions: []
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 4,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: true,
      certificationRequired: true
    }
  },
  {
    id: "config_003",
    configName: "光学仪器配置",
    configType: "自定义",
    applicableScope: "仪器类别",
    targetScope: "光学仪器",
    scopeDescription: "光学仪器类别",
    status: "启用",
    lastUpdated: "2024-01-12 17:15",
    updatedBy: "李四",
    maxAdvanceBookingDays: 21,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 6,
    minBookingDuration: 1,
    emailNotifications: true,
    autoApproval: true,
    maxConcurrentBookings: 2,
    cancellationDeadline: 12,
    bookingTimeSlots: ["09:00-12:00", "14:00-17:00"],
    approvalWorkflow: {
      level1: ["wang.wu"],
      level2: [],
      autoApprovalConditions: ["内部人员"]
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 1,
      cancellationNotification: true,
      statusChangeNotification: false
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: false,
      certificationRequired: false
    }
  },
  {
    id: "config_004",
    configName: "精密仪器特殊配置",
    configType: "自定义",
    applicableScope: "指定仪器",
    targetScope: "EQ001",
    scopeDescription: "气相色谱-质谱联用仪 (EQ001)",
    status: "维护中",
    lastUpdated: "2024-01-08 19:20",
    updatedBy: "赵六",
    maxAdvanceBookingDays: 90,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 24,
    minBookingDuration: 4,
    emailNotifications: true,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 72,
    bookingTimeSlots: ["08:00-12:00", "13:00-18:00"],
    approvalWorkflow: {
      level1: ["zhao.liu"],
      level2: ["prof.liu"],
      autoApprovalConditions: []
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 24,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: true,
      certificationRequired: true
    }
  },
  {
    id: "config_005",
    configName: "化学系专用配置",
    configType: "自定义",
    applicableScope: "部门",
    targetScope: "化学系",
    scopeDescription: "化学系所有仪器",
    status: "禁用",
    lastUpdated: "2024-01-05 16:30",
    updatedBy: "孙七",
    maxAdvanceBookingDays: 45,
    requireApproval: false,
    allowWeekends: true,
    maxBookingDuration: 10,
    minBookingDuration: 2,
    emailNotifications: false,
    autoApproval: true,
    maxConcurrentBookings: 3,
    cancellationDeadline: 6,
    bookingTimeSlots: ["全天开放"],
    approvalWorkflow: {
      level1: [],
      level2: [],
      autoApprovalConditions: ["化学系成员"]
    },
    notificationSettings: {
      bookingConfirmation: false,
      reminderBeforeBooking: false,
      reminderHours: 0,
      cancellationNotification: false,
      statusChangeNotification: false
    },
    usageRestrictions: {
      allowedUserRoles: ["研究生", "教师"],
      allowedDepartments: ["化学系"],
      trainingRequired: false,
      certificationRequired: false
    }
  },
  {
    id: "config_006",
    configName: "实验室A栋配置",
    configType: "自定义",
    applicableScope: "实验室",
    targetScope: "分析实验室A",
    scopeDescription: "分析实验室A栋所有仪器",
    status: "启用",
    lastUpdated: "2024-01-03 23:10",
    updatedBy: "周八",
    maxAdvanceBookingDays: 14,
    requireApproval: true,
    allowWeekends: true,
    maxBookingDuration: 4,
    minBookingDuration: 1,
    emailNotifications: true,
    autoApproval: true,
    maxConcurrentBookings: 5,
    cancellationDeadline: 2,
    bookingTimeSlots: ["09:00-12:00", "13:00-17:00", "18:00-22:00"],
    approvalWorkflow: {
      level1: ["zhou.ba"],
      level2: [],
      autoApprovalConditions: ["实验室成员", "工作时间"]
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 0.5,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: false,
      certificationRequired: false
    }
  },
  {
    id: "config_007",
    configName: "高精度测量仪器配置",
    configType: "自定义",
    applicableScope: "指定仪器",
    targetScope: "EQ007",
    scopeDescription: "核磁共振谱仪 (EQ007)",
    status: "启用",
    lastUpdated: "2024-01-01 18:00",
    updatedBy: "吴九",
    maxAdvanceBookingDays: 120,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 16,
    minBookingDuration: 8,
    emailNotifications: true,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 168,
    bookingTimeSlots: ["08:00-24:00"],
    approvalWorkflow: {
      level1: ["wu.jiu"],
      level2: ["prof.zhou", "prof.chen"],
      autoApprovalConditions: []
    },
    notificationSettings: {
      bookingConfirmation: true,
      reminderBeforeBooking: true,
      reminderHours: 48,
      cancellationNotification: true,
      statusChangeNotification: true
    },
    usageRestrictions: {
      allowedUserRoles: ["教师", "博士生"],
      allowedDepartments: [],
      trainingRequired: true,
      certificationRequired: true
    }
  },
  {
    id: "config_008",
    configName: "临时配置_待审核",
    configType: "自定义",
    applicableScope: "仪器类别",
    targetScope: "电子仪器",
    scopeDescription: "电子仪器类别",
    status: "草稿",
    lastUpdated: "2023-12-28 22:20",
    updatedBy: "郑十",
    maxAdvanceBookingDays: 7,
    requireApproval: true,
    allowWeekends: false,
    maxBookingDuration: 2,
    minBookingDuration: 1,
    emailNotifications: false,
    autoApproval: false,
    maxConcurrentBookings: 1,
    cancellationDeadline: 1,
    bookingTimeSlots: ["14:00-16:00"],
    approvalWorkflow: {
      level1: ["zheng.shi"],
      level2: [],
      autoApprovalConditions: []
    },
    notificationSettings: {
      bookingConfirmation: false,
      reminderBeforeBooking: false,
      reminderHours: 0,
      cancellationNotification: false,
      statusChangeNotification: false
    },
    usageRestrictions: {
      allowedUserRoles: [],
      allowedDepartments: [],
      trainingRequired: false,
      certificationRequired: false
    }
  }
] 