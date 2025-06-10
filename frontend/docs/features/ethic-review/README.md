# 伦理审查功能文档

本目录包含伦理审查系统相关功能的详细文档说明。

## 文档索引

### 核心功能文档
- [独立顾问指派功能](./README-assign-advisor.md) - 详细介绍独立顾问指派功能的实现和使用
- [专家评审组件](./expert-review-component.md) - 专家评审页签组件的功能说明

### 优化和改进文档
- [顾问卡片优化](./README-card-optimization.md) - 独立顾问选择卡片的UI优化说明
- [弹框滚动优化](./README-dialog-scroll-optimization.md) - 指派对话框滚动体验的改进
- [分页功能](./README-pagination.md) - 独立顾问选择的分页功能实现

## 文档结构

```
docs/features/ethic-review/
├── README.md                                   # 本文件 - 文档索引
├── README-assign-advisor.md                    # 独立顾问指派功能文档
├── README-card-optimization.md                 # 卡片优化文档
├── README-dialog-scroll-optimization.md        # 滚动优化文档
├── README-pagination.md                        # 分页功能文档
└── expert-review-component.md                  # 专家评审组件文档
```

## 相关代码位置

### 主要组件
- `app/ethic-review/quick-review/components/assign-advisor-dialog.tsx` - 独立顾问指派对话框
- `app/ethic-review/quick-review/components/expert-review-tab.tsx` - 专家评审页签
- `app/ethic-review/quick-review/page.tsx` - 快速审查主页面

### 使用页面
- `app/ethic-review/quick-review/[id]/summary/page.tsx` - 项目总结页面
- `app/ethic-review/quick-review/[id]/page.tsx` - 项目详情页面

## 更新说明
- 2024-12-XX: 创建文档结构，从代码目录迁移文档文件
- 2024-12-XX: 实现独立顾问指派功能
- 2024-12-XX: 优化卡片布局和分页功能
- 2024-12-XX: 改进滚动体验和用户反馈 