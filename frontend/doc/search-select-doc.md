# SearchSelect 组件使用文档

## 简介

SearchSelect 是一个功能强大的搜索选择组件，支持异步搜索、分页加载、自定义渲染和多字段显示。适用于需要从大量数据中搜索并选择单个项目的场景。该组件在科研人员管理系统中被广泛使用，如添加/编辑成员时的部门选择等场景。

## 组件特性

- 🔍 支持实时搜索（内置300ms防抖）
- 📄 支持分页加载更多结果（滚动加载）
- 🔄 支持异步数据获取
- 🎨 支持自定义渲染项目
- 📱 响应式设计
- 🛠️ 高度可配置
- 🎯 支持错误状态显示
- 💾 支持结果缓存
- 🖱️ 支持鼠标点击选择

## 基本用法

```tsx
import { SearchSelect } from "@/components/ui/search-select";

// 基础用法示例
<SearchSelect
  value={formData.unitId}
  displayValue={selectedUnitName}
  onChange={handleUnitSelect}
  onSearch={handleUnitSearch}
  placeholder="请输入部门名称搜索"
  labelField="name"
/>
```

## 参数说明

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| value | string | 否 | "" | 当前选中项的值 |
| displayValue | string | 否 | "" | 显示在输入框中的值 |
| onChange | (value: string, item?: T) => void | 是 | - | 选择项变化时的回调函数 |
| onSearch | (keyword: string, page: number, pageSize: number) => Promise<{list: T[]; total: number}> | 是 | - | 搜索函数，返回匹配的结果和总数 |
| placeholder | string | 否 | "请输入搜索关键词" | 输入框占位文本 |
| labelField | string | 否 | "name" | 主要标签字段名 |
| descriptionField | string | 否 | "code" | 描述字段名（向后兼容） |
| displayFields | (string \| FieldConfig)[] | 否 | [] | 结果中显示的字段配置 |
| pageSize | number | 否 | 5 | 每页加载的结果数量 |
| allowEmptySearch | boolean | 否 | false | 是否允许空值搜索 |
| renderItem | (item: T, onSelect: (item: T) => void) => ReactNode | 否 | - | 自定义渲染项目函数 |
| labelIcon | ReactNode | 否 | `<User2 />` | 主标签图标 |
| fieldIcon | ReactNode | 否 | `<Info />` | 字段默认图标 |
| disabled | boolean | 否 | false | 是否禁用组件 |
| error | boolean | 否 | false | 是否处于错误状态 |
| errorMessage | string | 否 | - | 错误提示信息 |

## 完整示例

### 1. 基本使用示例（部门选择）

```tsx
import { SearchSelect } from "@/components/ui/search-select";
import { Building2, Info, Phone, User } from "lucide-react";
import { get, ApiResponse } from "@/lib/api";

// 定义单位类型
interface Unit {
  id: string;
  name: string;
  code: string;
  charger?: string;
  tel?: string;
  linkMan?: string;
  intro?: string;
  unitTypeId?: string;
}

// 搜索单位的函数
const handleUnitSearch = async (keyword: string, page: number, pageSize: number) => {
  try {
    const response = await get<ApiResponse<{ list: Unit[]; total: number; pageNum: number; pageSize: number; pages: number }>>("/api/teamInfo/unit", { 
      params: { name: keyword, code: keyword, pageNum: page, pageSize: pageSize } 
    });
    
    if (response.code === 200 && response.data) {
      return {
        list: response.data.list,
        total: response.data.total
      };
    }
    return { list: [], total: 0 };
  } catch (error) {
    console.error("搜索单位失败:", error);
    return { list: [], total: 0 };
  }
};

// 处理单位选择的函数
const handleUnitSelect = (value: string, unit?: Unit) => {
  setFormData(prev => ({
    ...prev,
    unitId: value
  }));
  
  if (unit) {
    setSelectedUnitName(unit.name);
    // 可选：缓存单位名称
    sessionStorage.setItem(`unit_${value}`, unit.name);
  }
};

// 组件使用
<SearchSelect<Unit>
  value={formData.unitId}
  displayValue={selectedUnitName}
  onChange={handleUnitSelect}
  onSearch={handleUnitSearch}
  placeholder="请输入部门名称搜索"
  labelIcon={<Building2 className="h-4 w-4 text-blue-600" />}
  labelField="name"
  displayFields={[
    { field: "code", label: "单位编码", icon: <Info className="h-3.5 w-3.5 text-blue-500" /> },
    { field: "charger", label: "负责人", icon: <User className="h-3.5 w-3.5 text-green-500" /> },
    { field: "tel", label: "联系电话", icon: <Phone className="h-3.5 w-3.5 text-red-500" /> }
  ]}
  allowEmptySearch={true}
  error={!!errors.unitId}
  errorMessage={errors.unitId}
/>
```

### 2. 表单验证示例

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

// 表单验证函数
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.unitId) {
    newErrors.unitId = "请选择所属部门";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// 组件使用
<SearchSelect
  value={formData.unitId}
  displayValue={selectedUnitName}
  onChange={handleUnitSelect}
  onSearch={handleUnitSearch}
  placeholder="请输入部门名称搜索"
  error={!!errors.unitId}
  errorMessage={errors.unitId}
/>
```

## 高级配置

### 自定义显示字段

通过 `displayFields` 属性可以配置结果项中显示的字段：

```tsx
<SearchSelect
  // ...其他属性
  displayFields={[
    { field: "code", label: "编码", icon: <Barcode className="h-3.5 w-3.5" /> },
    { field: "description", label: "描述" },
    { field: "category", label: "分类", icon: <Tag className="h-3.5 w-3.5" /> }
  ]}
/>
```

### 自定义渲染选项

如果需要完全自定义结果项的渲染方式，可以使用 `renderItem` 属性：

```tsx
<SearchSelect
  // ...其他属性
  renderItem={(item, onSelect) => (
    <div 
      className="p-2 hover:bg-gray-100 cursor-pointer" 
      onClick={() => onSelect(item)}
    >
      <div className="font-bold">{item.name}</div>
      <div className="text-xs text-gray-500">{item.description}</div>
    </div>
  )}
/>
```

## 性能优化建议

1. **搜索防抖**：组件内部已实现300ms的搜索防抖，无需在外部再次实现
2. **滚动加载**：滚动到底部50px时自动加载更多结果，避免不必要的加载
3. **结果缓存**：对于频繁使用的搜索结果，建议在应用中实现缓存
   ```tsx
   // 示例：使用sessionStorage缓存单位信息
   const cacheKey = `unit_${unitId}`;
   const cachedName = sessionStorage.getItem(cacheKey);
   if (cachedName) {
     setSelectedUnitName(cachedName);
     return;
   }
   ```
4. **空值处理**：通过 `allowEmptySearch` 控制是否允许空值搜索，避免不必要的请求
5. **分页优化**：建议设置合适的 `pageSize`（5-10），避免一次性加载过多数据

## 注意事项

1. **数据结构要求**：
   - `onSearch` 函数必须返回符合接口的数据结构：`{ list: T[]; total: number }`
   - 每个列表项必须包含唯一的 `id` 字段
   - 建议在类型定义中包含所有可能用到的字段

2. **错误处理**：
   - 搜索函数中应包含适当的错误处理
   - 建议在控制台记录错误信息以便调试
   - 返回空结果而不是抛出错误

3. **状态管理**：
   - 组件内部管理搜索状态（loading、error等）
   - 外部只需关注选中值和显示值
   - 建议使用 `useState` 管理表单数据

4. **样式定制**：
   - 组件使用 Tailwind CSS 样式
   - 可以通过 className 属性覆盖默认样式
   - 错误状态会自动添加红色边框

## 常见问题

1. **Q: 如何实现空值搜索？**
   A: 设置 `allowEmptySearch={true}`，并在 `onSearch` 函数中处理空值情况

2. **Q: 如何自定义加载状态显示？**
   A: 组件内部已实现加载状态显示，无需额外配置

3. **Q: 如何处理大量数据？**
   A: 建议使用分页加载，并设置合适的 `pageSize`，避免一次性加载过多数据

4. **Q: 如何实现数据缓存？**
   A: 可以使用 sessionStorage 或 localStorage 缓存搜索结果，示例见性能优化建议部分

## 最佳实践

1. **数据缓存**：
   ```tsx
   // 在搜索函数中实现缓存
   const handleUnitSearch = async (keyword: string, page: number, pageSize: number) => {
     const cacheKey = `search_${keyword}_${page}`;
     const cached = sessionStorage.getItem(cacheKey);
     if (cached) {
       return JSON.parse(cached);
     }
     
     // 执行搜索...
     const result = await searchApi(keyword, page, pageSize);
     sessionStorage.setItem(cacheKey, JSON.stringify(result));
     return result;
   };
   ```

2. **错误处理**：
   ```tsx
   // 在搜索函数中实现错误处理
   const handleUnitSearch = async (keyword: string, page: number, pageSize: number) => {
     try {
       // 执行搜索...
     } catch (error) {
       console.error("搜索失败:", error);
       // 返回空结果而不是抛出错误
       return { list: [], total: 0 };
     }
   };
   ```

3. **表单集成**：
   ```tsx
   // 在表单中使用组件
   const [formData, setFormData] = useState({
     unitId: "",
     // 其他字段...
   });
   
   const handleUnitSelect = (value: string, unit?: Unit) => {
     setFormData(prev => ({
       ...prev,
       unitId: value
     }));
     
     if (unit) {
       setSelectedUnitName(unit.name);
     }
   };
   ```

## 注意事项

1. `onSearch` 函数必须返回符合接口的数据结构：`{ list: T[]; total: number }`
2. 每个列表项必须包含唯一的 `id` 字段
3. 为获得最佳用户体验，建议设置合适的 `pageSize`（5-10）
4. 如果需要缓存查询结果，可以在 `onSearch` 函数中实现

## 性能优化

1. 组件内部已实现了搜索防抖，无需在外部再次实现
2. 滚动加载更多结果时已实现了性能优化，避免不必要的加载
3. 对于频繁使用的搜索结果，建议在应用中实现缓存 