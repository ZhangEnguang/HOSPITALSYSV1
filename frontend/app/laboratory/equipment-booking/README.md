# 仪器预约管理 - 查看详情弹框功能

## 功能概述

该功能为仪器预约管理系统添加了一个通过弹框形式查看预约详情的功能。当用户点击操作列中的"查看详情"按钮时，系统会弹出一个详细的预约信息展示弹框。

## 主要特性

### 📋 完整信息展示
弹框包含以下预约信息：
- **预约仪器信息**：仪器名称、类型、编号等
- **预约人信息**：申请人姓名、所属单位、联系电话等
- **预约时间信息**：预约日期、使用时间段、申请时间等
- **关联项目**：项目名称、使用目的
- **备注说明**：申请备注、审核意见
- **处理信息**：审核人员、处理时间等

### 🎨 优美的界面设计
- 采用卡片式布局，信息层次清晰
- 响应式设计，支持桌面端和移动端
- 不同状态使用不同颜色标识（审核通过、待审核、审核退回、已取消）
- 使用图标增强视觉效果

### 📱 用户交互
- 点击"查看详情"按钮打开弹框
- 支持关闭和打印功能
- 支持键盘ESC关闭
- 弹框外点击关闭

## 技术实现

### 组件结构
```
app/laboratory/equipment-booking/
├── components/
│   └── booking-detail-dialog.tsx    # 预约详情弹框组件
├── page.tsx                         # 主页面（已集成弹框）
├── config/
│   └── equipment-booking-config.tsx # 配置文件（已添加电话字段）
└── data/
    └── equipment-booking-demo-data.ts # 示例数据
```

### 关键组件

#### BookingDetailDialog
主要的弹框组件，负责展示预约详情信息。

**Props:**
- `open: boolean` - 控制弹框开关
- `onOpenChange: (open: boolean) => void` - 弹框状态改变回调
- `booking: any` - 预约数据对象

#### 状态管理
在主页面中添加了以下状态：
```typescript
const [detailDialogOpen, setDetailDialogOpen] = useState(false)
const [selectedBooking, setSelectedBooking] = useState<any>(null)
```

### 数据字段

预约详情包含以下字段：
- `id` - 预约编号
- `bookingTitle` - 预约标题
- `equipmentName` - 仪器名称
- `equipmentType` - 仪器类型
- `equipmentId` - 仪器编号
- `status` - 预约状态
- `applicant` - 申请人信息（包含name, role, phone等）
- `department` - 所属部门
- `project` - 关联项目
- `purpose` - 使用目的
- `startTime` - 开始时间
- `endTime` - 结束时间
- `duration` - 使用时长
- `applicationDate` - 申请时间
- `processor` - 处理人信息
- `processDate` - 处理时间
- `notes` - 申请备注
- `approvalComments` - 审核意见

## 使用方法

1. 访问仪器预约管理页面 `/laboratory/equipment-booking`
2. 在预约列表中找到目标预约记录
3. 点击操作列中的"查看详情"按钮
4. 弹框将显示该预约的完整详情信息
5. 可以通过"关闭"按钮或弹框外点击关闭弹框
6. 可以通过"打印详情"按钮打印预约信息

## 状态显示

弹框中的预约状态会根据不同状态显示不同的样式：
- **审核通过**：绿色背景 + 对勾图标
- **待审核**：黄色背景 + 时钟图标  
- **审核退回**：红色背景 + 叉号图标
- **已取消**：灰色背景 + 警告图标

## 移动端适配

弹框采用响应式设计：
- 大屏幕：双列卡片布局
- 小屏幕：单列垂直布局
- 支持弹框滚动查看完整内容
- 优化触摸交互体验 