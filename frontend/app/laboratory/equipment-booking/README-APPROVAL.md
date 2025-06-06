# 仪器预约审核弹框功能

## 功能概述

本功能为仪器预约管理系统提供了一个完整的审核申领弹框，允许管理员直接在页面上进行预约审核，无需跳转到单独页面。

## 主要特性

### 1. 审核弹框组件 (`booking-approval-dialog.tsx`)
- **字段一致性**: 与查看详情弹框(`booking-detail-dialog.tsx`)保持相同的字段布局
- **审核功能**: 提供审核通过、审核退回和审核意见输入功能
- **响应式设计**: 支持桌面端和移动端显示
- **表单验证**: 要求必须填写审核意见才能提交
- **状态管理**: 提交过程中显示加载状态，防止重复提交

### 2. 字段布局

审核弹框包含以下信息区域：

#### 预约状态
- 当前预约状态显示（带颜色和图标区分）
- 预约编号

#### 预约仪器信息
- 仪器名称和类型
- 仪器编号
- 仪器图标显示

#### 预约人信息
- 申请人姓名和头像
- 申请人职位
- 所属单位
- 联系电话

#### 预约时间信息
- 预约日期（年月日及星期）
- 使用时间段
- 申请时间
- 处理人信息

#### 预约详情
- 关联项目名称
- 使用目的
- 申请备注

#### 审核意见（重点功能）
- 必填的审核意见输入框
- 占位符提示
- 字符计数和说明
- 蓝色高亮显示，区别于其他信息

### 3. 底部操作栏

固定在弹框底部的操作按钮：
- **取消**: 关闭弹框，不保存任何更改
- **审核退回**: 红色按钮，将预约状态设为"审核退回"
- **审核通过**: 蓝色按钮，将预约状态设为"审核通过"

### 4. 主页面集成

在主页面(`page.tsx`)中：
- 添加审核弹框状态管理
- 修改`handleRowAction`函数支持"审核申领"操作
- 添加审核处理函数(`handleApproveBooking`, `handleRejectBooking`)
- 在页面底部渲染审核弹框组件

## 使用流程

1. **打开审核弹框**
   - 点击操作列的"审核申领"按钮
   - 弹框显示预约详细信息

2. **查看预约信息**
   - 审核员可以查看完整的预约详情
   - 包括仪器、申请人、时间、项目等信息

3. **填写审核意见**
   - 在底部审核意见区域输入审核意见（必填）
   - 系统提示审核意见的重要性

4. **提交审核结果**
   - 点击"审核通过"或"审核退回"按钮
   - 系统更新预约状态和审核信息
   - 显示成功提示消息

## 技术实现

### 组件结构
```typescript
interface BookingApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: any
  onApprove?: (booking: any, comments: string) => void
  onReject?: (booking: any, comments: string) => void
}
```

### 状态管理
- 使用React useState管理审核意见和提交状态
- 表单验证确保审核意见不为空
- 异步处理审核操作，支持错误处理

### 样式设计
- 使用Tailwind CSS和shadcn/ui组件
- 审核意见区域使用蓝色主题突出显示
- 底部操作栏固定布局，按钮颜色区分功能
- 响应式网格布局适配不同屏幕尺寸

### 数据更新
- 审核通过后更新预约状态为"审核通过"
- 审核退回后更新预约状态为"审核退回" 
- 同时更新审核意见、处理人和处理时间
- 使用Toast组件显示操作结果

## 扩展功能

可以进一步扩展的功能：
- 审核历史记录
- 审核流程多级审批
- 邮件通知功能
- 审核统计报表
- 批量审核功能增强

## 注意事项

1. **数据一致性**: 确保审核操作后数据状态正确更新
2. **用户体验**: 提供清晰的操作反馈和错误提示
3. **权限控制**: 在实际应用中需要添加审核权限验证
4. **数据持久化**: 当前为演示版本，实际应用需要连接后端API 