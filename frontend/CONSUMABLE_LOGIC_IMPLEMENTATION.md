# 耗材有效期、库存量、申领功能逻辑实现文档

## 实现概述
为耗材模块实现了与试剂模块一致的有效期、库存量、申领功能逻辑，确保系统的一致性和安全性。

## 1. 有效期显示逻辑

### 过期判断逻辑
```javascript
const isExpired = () => {
  const expiryDate = new Date(item.expiryDate);
  const today = new Date();
  return expiryDate < today || item.status === "已过期";
};
```

### 即将过期判断逻辑
```javascript
const isSoonExpired = () => {
  const expiryDate = new Date(item.expiryDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expiryDate <= thirtyDaysFromNow && expiryDate > today;
};
```

### 显示规则
- **已过期**：文字显示为红色 (`text-red-600`)
- **未过期**：文字显示为绿色 (`text-green-600`)
- **左上角标识**：已过期显示红色"已过期"徽章，未过期无特殊标识

## 2. 库存量显示逻辑

### 库存状态判断
```javascript
const getStockStatus = () => {
  if (item.currentStock <= 0) {
    return { text: "无库存", color: "text-red-600 bg-red-50 border-red-200" };
  } else if (item.currentStock <= item.maxStock * 0.5) {
    return { text: "库存不足", color: "text-orange-600 bg-orange-50 border-orange-200" };
  } else {
    return { text: "库存充足", color: "text-green-600 bg-green-50 border-green-200" };
  }
};
```

### 显示规则
- **库存充足**：当前库存 > 50% 最大库存，显示绿色"库存充足"
- **库存不足**：当前库存 ≤ 50% 最大库存且 > 0，显示橙色"库存不足"
- **无库存**：当前库存 = 0，显示红色"无库存"

## 3. 申领功能逻辑

### 申领条件验证
```javascript
const canApply = () => {
  return !isExpired() && item.currentStock > 0;
};
```

### 可申领条件（同时满足）
- 耗材未过期 (`!isExpired()`)
- 库存量大于0 (`item.currentStock > 0`)

### 不可申领情况
- 耗材过期：无论库存多少，都不可申领
- 库存为0：即使未过期，也不可申领
- 耗材已停用：系统管理状态限制

## 4. 卡片整体样式逻辑

### 样式规则
```javascript
const getCardStyles = () => {
  if (isExpired()) {
    return "border-red-300 bg-red-50/30";
  } else if (isSoonExpired()) {
    return "border-yellow-300 bg-yellow-50/30";
  }
  return "";
};
```

- **已过期**：红色边框 + 浅红色背景
- **即将过期（30天内）**：黄色边框 + 浅黄色背景
- **正常状态**：默认边框和背景

### 悬停提示
```javascript
const getTooltipText = () => {
  if (isExpired()) {
    return "此耗材已过期，无法申领";
  } else if (item.currentStock <= 0) {
    return "库存不足，无法申领";
  }
  return "";
};
```

## 5. 申领操作处理逻辑

### 操作菜单禁用逻辑
```javascript
const isActionDisabled = (isDisabled() || !canApply()) && action.id === "apply";
```

### 验证流程
1. **首先检查是否过期** - 如过期则显示"耗材已过期"并阻止操作
2. **然后检查库存是否充足** - 如无库存则显示"库存不足"并阻止操作
3. **只有通过所有验证** - 才能打开申领弹框

### 申领弹框内的限制
- **过期耗材**：显示详细的过期警告，禁用申领表单
- **即将过期**：显示警告但允许申领
- **库存不足**：显示库存不足警告，限制最大申领数量

## 6. 用户体验优化

### 视觉反馈
- 使用不同颜色清晰区分耗材状态
- 过期和库存不足的耗材使用明显的视觉标识
- 右下角库存状态徽章提供快速状态识别

### 操作引导
- 对于不可申领的耗材，在操作菜单中显示禁用状态和原因
- 提供清晰的错误提示信息
- 申领弹框中显示耗材完整状态信息

### 警告系统
申领弹框中实现了多层次警告：
1. **已过期警告**（红色）- 阻止申领操作
2. **即将过期提醒**（黄色）- 允许申领但给出提醒
3. **库存不足警告**（橙色）- 阻止申领操作

## 7. 修改的文件

### 核心组件
- `app/laboratory/consumables/config/consumable-config.tsx` - 卡片组件逻辑
- `app/laboratory/consumables/components/consumable-apply-dialog.tsx` - 申领弹框逻辑

### 示例数据
- `app/laboratory/consumables/data/consumable-demo-data.ts` - 添加了多种状态的测试数据

## 8. 测试数据说明

更新了示例数据以覆盖所有逻辑状态：

### 有效期多样性
- **已过期**：高透明度微孔板（30天前过期）
- **即将过期**：移液器吸头（15天后过期）
- **正常期限**：微量离心管（1年后过期）
- **长期有效**：96孔PCR微孔板（2年后过期）

### 库存多样性
- **库存充足（>50%）**：微量离心管 81%
- **库存不足（≤50%）**：移液器吸头 38%
- **无库存（0%）**：深孔微孔板

### 组合状态
涵盖了所有可能的逻辑组合，便于测试各种场景。

## 9. 安全性保障

### 核心安全原则
1. **过期耗材绝对不能申领** - 从卡片到弹框多层验证
2. **无库存耗材不能申领** - 防止超量申领
3. **已停用耗材不能申领** - 管理状态控制

### 验证机制
- 前端多重验证确保用户体验
- 状态检查贯穿整个申领流程
- 错误提示清晰明确

## 10. 与试剂模块的一致性

本实现完全遵循试剂模块的逻辑规则：
- 相同的过期判断标准
- 一致的库存状态分类
- 统一的申领条件验证
- 相似的用户界面风格
- 一致的安全性控制

确保了整个系统的逻辑一致性和用户体验的统一性。 