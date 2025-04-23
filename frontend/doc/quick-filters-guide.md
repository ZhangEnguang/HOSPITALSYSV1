# 简化版
DataList 组件中的quickFilters参数，传递需要检索的参数实体数组
参数实体结构：
quickFilters{
    id: string //后端接收的名称参数，一般为字段名
    label: string //前端提示的名称
    value: string //后端接收的值参数，数据库储存什么传什么
    options: FilterOption[] //选项列表，有category使用category，无category使用options
    category: string //字典名称
}
传递的方法
export const quickFilters = [
  {
    id: "role",
    label: "角色",
    value: "all",
    category:"roles",
  },
  {
    id: "status",
    label: "状态",
    value: "all",
    options: [
      { id: "active", label: "在职", value: "active" },
      { id: "retired", label: "退休", value: "retired" },
      { id: "left", label: "离职", value: "left" },
    ],
  },
  {
    id: "teamType",
    label: "团队类型",
    value: "all",
    options: [
      { id: "research", label: "研究团队", value: "research" },
      { id: "lab", label: "实验室", value: "lab" },
      { id: "center", label: "研究中心", value: "center" },
      { id: "institute", label: "研究所", value: "institute" },
      { id: "project", label: "项目团队", value: "project" },
    ],
  },
  {
    id: "orgType",
    label: "组织类型",
    value: "all",
    options: orgTypeOptions.map(opt => ({ id: opt.id, label: opt.label, value: opt.value })),
  },
]
const getCurrentQuickFilters = () => {
    if (activeTab === "personnel") {
        return quickFilters.filter(f => ["role", "status"].includes(f.id))
    }
    if (activeTab === "teams") {
        return quickFilters.filter(f => ["teamType"].includes(f.id))
    }
    if (activeTab === "organization") {
        return quickFilters.filter(f => ["orgType"].includes(f.id))
    }
    return []
}
特殊说明
有category使用category，无category使用options
##TODO
暂时全部选项未添加


##详细说明
# 快捷筛选 (Quick Filters) 使用说明

## 1. 功能概述

快捷筛选功能允许用户在数据列表（如人员、团队列表）的工具栏中，通过预定义的下拉菜单快速对数据进行过滤。系统支持两种类型的快捷筛选器：

1.  **字典类型筛选器**: 使用 `<Dict>` 组件，下拉选项的数据来源于后端配置的数据字典。
2.  **选项列表筛选器**: 使用 `<Select>` 组件，下拉选项直接在前端配置中定义。

系统会根据筛选器的配置自动选择渲染 `<Dict>` 还是 `<Select>`。

## 2. 配置规则

快捷筛选器的配置通常在一个集中的配置文件中完成（例如 `frontend/app/members/config/members-config.tsx`），以一个名为 `quickFilters` 的数组形式存在。

数组中的每个对象代表一个快捷筛选器，其主要属性如下：

*   `id` (string, **必需**):
    *   筛选器的唯一标识符。
    *   **极其重要**: 这个 `id` 被用作：
        *   在状态对象 (`quickFilterValues`) 中存储和查找当前选中值的键。
        *   传递给 `onQuickFilterChange` 回调函数，以标识哪个筛选器发生了变化。
*   `label` (string, **必需**):
    *   显示在筛选器下拉菜单中的占位提示文本（例如 "角色", "状态"）。
*   `value` (string, **可选**):
    *   通常用于定义默认值或初始值（例如 `"all"`）。具体用法取决于 `<Select>` 组件的实现。
*   `category` (string, **条件必需**):
    *   **如果提供了此属性**: 系统将认为这是一个**字典类型筛选器**。
    *   该属性的值将被用作 `<Dict>` 组件的 `dictCode` 属性，用于从数据字典存储中获取下拉选项。
    *   此时**不应**提供 `options` 属性。
*   `options` (Array<{id: string, label: string, value: string}>, **条件必需**):
    *   **如果未提供 `category` 属性，并且提供了此属性**: 系统将认为这是一个**选项列表筛选器**。
    *   该数组用于直接生成 `<Select>` 组件的下拉选项 (`<SelectItem>`)。
    *   数组中每个对象包含 `id` (选项唯一键), `label` (显示文本), `value` (选项值)。
    *   此时**不应**提供 `category` 属性。

**核心规则**: 每个筛选器配置对象必须明确提供 `category` 或 `options` 中的**一个**，以确定其类型和渲染方式。

## 3. 数据流

1.  **配置**: 在配置文件中定义 `quickFilters` 数组。
2.  **过滤 (可选)**: 在页面组件（如 `members/page.tsx`）中，可以根据当前上下文（例如活动标签页 `activeTab`）使用 `.filter()` 方法筛选 `quickFilters` 数组，决定哪些筛选器需要显示。筛选通常基于 `filter.id`。
3.  **传递**: 将（可能已过滤的）`quickFilters` 数组通过 Props 逐层传递给 `DataList` 组件，最终传递给 `DataListToolbar` 组件。

## 4. 渲染逻辑 (`DataListToolbar.tsx`)

`DataListToolbar` 组件接收 `quickFilters` 数组，并通过 `.map()` 遍历每个 `filter` 对象，根据条件渲染不同的组件：

*   **判断条件**: `filter.category && filter.category.trim() !== ''`
*   **如果为真 (渲染 `<Dict>`)**:
    *   `key={filter.id}`: React 列表渲染必需。
    *   `dictCode={filter.category}`: 使用 `category` 的值获取字典数据。
    *   `value={quickFilterValues[filter.id]}`: 从状态中获取当前选中值，**注意使用 `filter.id` 作为键**。
    *   `field={filter.id}`: **将 `filter.id` 作为字段标识符**传递给 `<Dict>`，供其内部 `setFormData` 逻辑使用。
    *   `setFormData={handleDictChange}`: 传递自定义处理函数。该函数会提取由 `<Dict>` 内部逻辑确定的 `field` (`filter.id`) 和新 `value`，然后调用 `onQuickFilterChange`。
*   **判断条件**: `!useDict && filter.options && filter.options.length > 0` (即 `category` 不存在但 `options` 存在)
*   **如果为真 (渲染 `<Select>`)**:
    *   `key={filter.id}`: React 列表渲染必需。
    *   `value={quickFilterValues[filter.id] || "all"}`: 从状态中获取当前选中值（同样使用 `filter.id` 作为键），可能提供 "all" 作为默认/未选中的值。
    *   `onValueChange={(value) => onQuickFilterChange?.(filter.id, value === 'all' ? '' : value)}`: 当选项改变时，**直接调用 `onQuickFilterChange`**，传递 `filter.id` 和新的选项值（特殊处理 "all" 可能表示清空或不过滤）。
    *   内部使用 `filter.options.map()` 生成 `<SelectItem>`。

## 5. 状态管理

快捷筛选器的状态（即每个筛选器当前选中的值）由父组件（通常是包含 `DataList` 或 `DataListToolbar` 的页面组件，如 `members/page.tsx`）管理。

*   **状态对象 (`quickFilterValues`)**: 通常是一个 Record 或对象，结构类似 `{ [filterId: string]: selectedValue: string }`。**键是筛选器的 `id`**。
*   **更新回调 (`onQuickFilterChange`)**: 一个函数，接收 `filterId` (string) 和 `newValue` (string) 作为参数。当任何一个快捷筛选器的值发生变化时（无论是由 `<Dict>` 的 `handleDictChange` 触发还是由 `<Select>` 的 `onValueChange` 触发），这个函数会被调用。该函数负责更新父组件中的 `quickFilterValues` 状态。

## 6. 配置示例 (`members-config.tsx`)

```typescript
// frontend/app/members/config/members-config.tsx

export const quickFilters = [
  // --- 字典类型筛选器示例 ---
  {
    id: "role",        // 状态键名和回调标识符
    label: "角色",      // 下拉框占位符
    value: "all",     // 初始/默认值 (可选)
    category: "roles", // 使用名为 "roles" 的数据字典
    // 没有 options 属性
  },
  // --- 选项列表筛选器示例 ---
  {
    id: "status",      // 状态键名和回调标识符
    label: "状态",      // 下拉框占位符
    value: "all",     // 初始/默认值
    // 没有 category 属性
    options: [        // 直接定义下拉选项
      { id: "active", label: "在职", value: "active" },
      { id: "retired", label: "退休", value: "retired" },
      { id: "left", label: "离职", value: "left" },
    ],
  },
  // ... 其他筛选器配置
];
```

## 7. 工具栏代码示例 (`data-list-toolbar.tsx`)

```typescript
// frontend/components/data-management/data-list-toolbar.tsx

// ... imports and component definition ...

{quickFilters &&
  quickFilters.map((filter) => {
    const useDict = filter.category && filter.category.trim() !== '';
    const useSelect = !useDict && filter.options && filter.options.length > 0;

    if (useDict) {
      // Render Dict component if category is present
      return (
        <Dict
          key={filter.id}
          dictCode={filter.category}
          displayType="select"
          value={quickFilterValues[filter.id]} // Use id for value lookup
          setFormData={handleDictChange}       // Use custom handler
          field={filter.id}                // Use id for field identification
          className="w-[120px]"
          placeholder={filter.label}
        />
      );
    } else if (useSelect) {
      // Render Select component if options are present and category is not
      return (
        <Select
          key={filter.id}
          value={quickFilterValues[filter.id] || "all"} // Use id for value lookup
          // Directly call onQuickFilterChange for Select
          onValueChange={(value) => onQuickFilterChange?.(filter.id, value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部{filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      return null;
    }
  })}

// ... rest of the component ...
``` 