# 试剂卡片逻辑设计实现

## 概述
根据用户需求，完成了试剂卡片的有效期、库存量、申领功能逻辑设计。在不影响现有主要布局和功能的基础上，实现了完整的状态判断、视觉反馈和用户体验优化。

## 1. 有效期显示逻辑

### 1.1 过期判断条件
```typescript
const isExpired = () => {
  const expiryDate = new Date(item.expiryDate);
  const today = new Date();
  return expiryDate < today || item.status === "已过期";
};
```

### 1.2 有效期字段颜色规则
- **已过期**：文字显示为红色 (`text-red-600`)
- **未过期**：文字显示为绿色 (`text-green-600`)

### 1.3 卡片左上角标识规则
- **已过期**：显示红色"已过期"标识 (`Badge variant="destructive"`)
- **即将过期**（30天内）：显示黄色"即将过期"标识 (`Badge variant="outline"`)
- **未过期**：无特殊标识

## 2. 库存量显示逻辑

### 2.1 库存状态判断条件
```typescript
const getStockStatus = () => {
  if (item.currentAmount <= 0) {
    return { text: "无库存", color: "text-red-600 bg-red-50" };
  } else if (item.currentAmount <= item.initialAmount * 0.5) {
    return { text: "库存不足", color: "text-orange-600 bg-orange-50" };
  } else {
    return { text: "库存充足", color: "text-green-600 bg-green-50" };
  }
};
```

### 2.2 右下角库存状态显示规则
- **库存充足**：当库存量 > 50% 初始库存时，显示绿色"库存充足"
- **库存不足**：当库存量 ≤ 50% 且 > 0 时，显示橙色"库存不足"
- **无库存**：当库存量 = 0 时，显示红色"无库存"

### 2.3 库存量文字颜色
- **无库存**：红色 (`text-red-600`)
- **库存不足**：橙色 (`text-orange-600`)
- **库存充足**：绿色 (`text-green-600`)

## 3. 申领功能逻辑

### 3.1 可申领条件
```typescript
const canApply = () => {
  return !isExpired() && item.currentAmount > 0;
};
```

**必须同时满足：**
- 试剂未过期 (`!isExpired()`)
- 库存量大于0 (`item.currentAmount > 0`)

### 3.2 不可申领情况
- **试剂过期**：无论库存多少，都不可申领
- **库存为0**：即使未过期，也不可申领

### 3.3 申领按钮状态
- **可申领**：正常显示"试剂申领"
- **试剂已过期**：禁用状态，显示"试剂已过期"
- **库存不足**：禁用状态，显示"库存不足"

## 4. 卡片整体样式逻辑

### 4.1 卡片边框和背景
```typescript
const getCardStyles = () => {
  if (isExpired()) {
    return "border-red-300 bg-red-50/30";
  } else if (isExpiringSoon()) {
    return "border-yellow-300 bg-yellow-50/30";
  }
  return "";
};
```

- **已过期**：红色边框 + 浅红色背景 (`border-red-300 bg-red-50/30`)
- **即将过期**（30天内）：黄色边框 + 浅黄色背景 (`border-yellow-300 bg-yellow-50/30`)
- **正常状态**：默认边框和背景

### 4.2 悬停提示
```typescript
const getTooltipText = () => {
  if (isExpired()) {
    return "此试剂已过期，无法申领";
  } else if (item.currentAmount <= 0) {
    return "库存不足，无法申领";
  }
  return "";
};
```

- **过期试剂**：显示"此试剂已过期，无法申领"
- **无库存试剂**：显示"库存不足，无法申领"

## 5. 申领操作处理逻辑

### 5.1 点击申领时的验证流程
```typescript
const handleSubmit = () => {
  // 1. 首先检查是否过期
  if (isExpired()) {
    toast({ title: "申领失败", description: "试剂已过期，无法申领。", variant: "destructive" });
    return;
  }
  
  // 2. 然后检查库存是否充足
  if (reagent.currentAmount <= 0) {
    toast({ title: "申领失败", description: "试剂库存不足，无法申领。", variant: "destructive" });
    return;
  }
  
  // 3. 只有通过所有验证才能打开申领弹框
  // ... 后续申领逻辑
};
```

### 5.2 申领弹框内的限制
- **过期试剂**：显示详细的过期警告，禁用申领表单
- **库存不足**：显示库存不足警告，禁用申领表单
- **即将过期**：显示警告但允许申领
- **可申领**：显示完整的申领表单，限制最大申领数量

## 6. 用户体验优化

### 6.1 视觉反馈
- ✅ 使用不同颜色清晰区分试剂状态（红色=危险，橙色=警告，绿色=安全）
- ✅ 过期和库存不足的试剂使用明显的视觉标识
- ✅ 鼠标悬停时显示详细的状态说明

### 6.2 操作引导
- ✅ 对于不可申领的试剂，在操作菜单中禁用申领选项
- ✅ 提供清晰的错误提示信息
- ✅ 为库存不足的试剂推荐替代方案

### 6.3 安全性保障
- ✅ **安全性**：过期试剂绝对不能申领
- ✅ **可用性**：只有有库存的未过期试剂才能申领
- ✅ **一致性**：与现有代码结构保持一致

## 7. 组件文件更新

### 7.1 试剂卡片组件
- 文件：`app/laboratory/reagent/config/reagent-config.tsx`
- 更新：`ReagentCard` 组件逻辑
- 新增：库存状态判断、申领验证、样式逻辑等函数

### 7.2 试剂申领对话框
- 文件：`app/laboratory/reagent/components/reagent-apply-dialog.tsx`
- 更新：验证逻辑与卡片保持一致
- 优化：错误提示和用户反馈

## 8. 实现特色

### 8.1 状态优先级
1. **过期状态**：最高优先级，过期试剂无论库存多少都不可申领
2. **库存状态**：次优先级，无库存试剂即使未过期也不可申领
3. **即将过期**：提醒级别，显示警告但允许申领

### 8.2 动态显示
- 试剂瓶图标中的液体高度根据库存比例动态显示
- 库存状态标识实时反映当前库存情况
- 有效期颜色根据过期状态动态变化

### 8.3 智能提示
- 操作菜单项根据试剂状态智能禁用/启用
- 悬停提示提供详细的状态说明
- 申领弹框根据状态显示相应的警告和建议

这套设计确保了试剂管理的安全性、实用性和用户体验的一致性。 