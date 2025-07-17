// 数据看板专用配置文件
// 此配置独立于仪表盘配置，可以单独修改而不影响仪表盘

export const DASHBOARD_CONFIG = {
  // 数据看板专用主题色
  THEME_COLORS: {
    primary: "#246EFF",
    secondary: "#00B2FF", 
    success: "#73D13D",
    warning: "#FAAD14",
    error: "#FF4D4F",
    info: "#1890FF"
  },

  // 图表通用颜色方案
  CHART_COLORS: {
    pie: ["#7275F2", "#8AD7FC", "#F97F7F", "#92F1B4"],
    bar: ["#246EFF", "#00B2FF", "#81E2FF", "#B3EEFF"],
    line: ["#1890FF", "#00DDDD", "#73D13D"],
    gauge: ["#67e0e3", "#37a2da", "#fd666d"],
    resource: ["#4cc9f0", "#7209b7", "#e9ecef"]
  },

  // 数据刷新配置
  REFRESH_INTERVALS: {
    realtime: 5000,      // 5秒
    frequent: 30000,     // 30秒
    normal: 300000,      // 5分钟
    slow: 1800000        // 30分钟
  },

  // 图表动画配置
  ANIMATION: {
    duration: 1000,
    easing: "cubicOut",
    enabled: true
  },

  // 工具提示样式
  TOOLTIP_STYLE: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: 'rgba(50, 50, 50, 0.9)',
    textStyle: {
      color: '#fff'
    },
    padding: [8, 12]
  },

  // 图表默认配置
  CHART_DEFAULTS: {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    legend: {
      bottom: 'bottom',
      itemWidth: 15,
      itemHeight: 8,
      itemGap: 20
    }
  }
}

// 数据看板专用数据配置
export const DASHBOARD_DATA_CONFIG = {
  // 模拟数据开关 (生产环境应设为false)
  USE_MOCK_DATA: true,
  
  // API端点配置
  API_ENDPOINTS: {
    projectStatus: '/api/dashboard/project-status',
    teacherPublication: '/api/dashboard/teacher-publication',
    projectFunding: '/api/dashboard/project-funding',
    projectHealth: '/api/dashboard/project-health',
    teamDistribution: '/api/dashboard/team-distribution',
    resourceUtilization: '/api/dashboard/resource-utilization'
  },

  // 缓存配置
  CACHE: {
    enabled: true,
    duration: 300000 // 5分钟
  }
} 