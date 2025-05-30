# 耗材编辑功能

## 概述

这是为耗材管理模块添加的编辑功能，允许用户编辑现有耗材的详细信息。

## 文件结构

```
app/laboratory/consumables/edit/
├── [id]/
│   ├── page.tsx                    # 动态路由页面
│   └── components/
│       └── consumable-edit-form.tsx  # 耗材编辑表单组件
└── README.md                       # 本文档
```

## 功能特性

### 1. 数据加载和预填充
- 根据耗材ID从数据源加载现有数据
- 自动预填充所有表单字段
- 包括基本信息、供应信息、库存信息等
- 支持图片预加载

### 2. 表单验证
- 必填字段验证
- 数据类型验证（数字、价格等）
- 业务逻辑验证（如最小库存应小于最大库存）
- 实时错误提示

### 3. 用户体验
- 加载状态指示器
- 错误处理和用户友好的错误信息
- 保存草稿功能
- 完成后的确认对话框

### 4. 数据完整性
- 与新增页面保持一致的表单结构
- 支持所有耗材属性的编辑
- 别名管理（添加、删除、修改）
- 图片上传和管理

## 路由配置

编辑页面使用动态路由：`/laboratory/consumables/edit/[id]`

其中 `[id]` 是要编辑的耗材的唯一标识符。

## 使用方法

### 1. 从列表页面进入编辑
在耗材管理页面，点击操作下拉菜单中的"编辑耗材"按钮即可进入编辑页面。

### 2. 直接访问编辑页面
可以通过URL直接访问：`/laboratory/consumables/edit/{消费品ID}`

### 3. 编辑操作
1. 页面会自动加载并填充现有数据
2. 修改需要更新的字段
3. 点击"保存修改"提交更改
4. 或点击"保存草稿"暂存修改

## 技术实现

### 数据加载
```typescript
useEffect(() => {
  const loadConsumableData = async () => {
    const consumable = allDemoConsumableItems.find(item => item.id === consumableId)
    if (consumable) {
      setFormData({
        name: consumable.name,
        // ... 其他字段
      })
    }
  }
  loadConsumableData()
}, [consumableId])
```

### 表单验证
```typescript
const validateForm = () => {
  const requiredFields = ["name", "category", "model", ...]
  // 验证逻辑
}
```

### 状态管理
- `formData`: 表单数据
- `formErrors`: 验证错误
- `formTouched`: 字段触摸状态
- `isLoading`: 加载状态
- `dataLoaded`: 数据加载状态

## 与新增页面的一致性

编辑页面复用了新增页面的大部分逻辑和UI组件，主要差异：

1. **数据预填充**: 编辑页面会从数据源加载现有数据
2. **页面标题**: "编辑耗材" vs "新增耗材"
3. **保存逻辑**: 更新现有记录 vs 创建新记录
4. **按钮文本**: "保存修改" vs "确认添加"

## 错误处理

1. **数据加载失败**: 显示错误消息并跳转回列表页面
2. **验证失败**: 高亮错误字段并显示具体错误信息
3. **保存失败**: 显示错误提示，允许用户重试

## 扩展性

该实现支持轻松扩展：

1. **添加新字段**: 在formData中添加新字段，并在UI中添加对应输入组件
2. **自定义验证**: 在validateForm函数中添加新的验证规则
3. **API集成**: 替换模拟数据调用为真实API调用
4. **权限控制**: 在页面层面添加权限检查

## 注意事项

1. 当前使用模拟数据，实际项目中需要集成真实API
2. 图片上传目前为本地预览，需要配置实际的文件上传服务
3. 别名功能最多支持10个别名
4. 所有必填字段必须填写完整才能保存

## 依赖

- React 18+
- Next.js 14+
- TypeScript
- Tailwind CSS
- Lucide React (图标)
- Radix UI (组件库) 