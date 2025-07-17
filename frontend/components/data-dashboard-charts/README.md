# 数据看板图表组件

## 概述

此文件夹包含数据看板专用的图表组件，与仪表盘（`components/charts/`）完全独立，互不影响。

## 独立性保证

### 1. 文件结构独立
```
components/
├── charts/                    # 仪表盘图表组件
│   ├── project-status-chart.tsx
│   ├── teacher-publication-chart.tsx
│   └── ...
└── data-dashboard-charts/     # 数据看板图表组件（本文件夹）
    ├── dashboard-project-status-chart.tsx
    ├── dashboard-teacher-publication-chart.tsx
    ├── dashboard-config.ts
    └── README.md
```

### 2. 命名空间独立
- 所有数据看板图表组件均以 `Dashboard` 前缀命名
- 配置文件使用独立的命名空间
- 避免与仪表盘组件产生命名冲突

### 3. 配置独立
- `dashboard-config.ts` - 数据看板专用配置
- 独立的颜色方案、动画设置、API端点等
- 可以单独修改而不影响仪表盘

### 4. 数据独立
- 每个组件内部使用独立的数据变量
- 可以连接不同的API端点
- 支持不同的数据格式和结构

## 组件列表

| 组件名 | 文件名 | 功能描述 |
|-------|--------|----------|
| DashboardProjectStatusChart | dashboard-project-status-chart.tsx | 项目状态分布饼图 |
| DashboardTeacherPublicationChart | dashboard-teacher-publication-chart.tsx | 教师论文发表统计柱状图 |
| DashboardProjectFundingChart | dashboard-project-funding-chart.tsx | 项目经费趋势折线图 |
| DashboardProjectHealthChart | dashboard-project-health-chart.tsx | 项目健康度仪表盘 |
| DashboardTeamDistributionChart | dashboard-team-distribution-chart.tsx | 团队分布饼图（可切换） |
| DashboardResourceUtilizationChart | dashboard-resource-utilization-chart.tsx | 资源利用率柱状图 |

## 使用方式

```tsx
import DashboardProjectStatusChart from "@/components/data-dashboard-charts/dashboard-project-status-chart"

// 在数据看板中使用
<DashboardProjectStatusChart />
```

## 配置修改

### 修改颜色方案
```typescript
// 在 dashboard-config.ts 中修改
export const DASHBOARD_CONFIG = {
  CHART_COLORS: {
    pie: ["#自定义颜色1", "#自定义颜色2", ...],
    // ...
  }
}
```

### 修改数据源
```typescript
// 在各个图表组件中修改 dashboardData 变量
const dashboardData = [
  // 自定义数据
]
```

## 独立性验证

1. **修改测试**: 修改数据看板图表的颜色、数据不会影响仪表盘
2. **导入测试**: 数据看板和仪表盘使用不同的导入路径
3. **配置测试**: 两个模块有独立的配置文件

## 扩展说明

### 添加新图表
1. 在此文件夹创建新的图表组件
2. 使用 `Dashboard` 前缀命名
3. 在 `dashboard-config.ts` 中添加相关配置
4. 在数据看板主组件中导入使用

### 数据对接
1. 修改 `DASHBOARD_DATA_CONFIG.API_ENDPOINTS` 配置API地址
2. 在各图表组件中替换模拟数据为真实API调用
3. 处理数据格式转换和错误处理

## 注意事项

- ⚠️ 不要直接引用 `components/charts/` 下的组件
- ⚠️ 不要在仪表盘中使用此文件夹的组件
- ⚠️ 修改配置时请确保不影响其他模块
- ✅ 保持命名规范和文件结构清晰 