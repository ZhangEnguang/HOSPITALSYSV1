# 专家评审组件

## 组件位置
- `expert-review-tab.tsx` - 专家评审页签组件

## 功能介绍
专家评审页签组件用于显示专家评审意见和独立顾问回复，主要功能包括：

### 核心功能
1. **专家评审意见列表**
   - 表格形式展示专家基本信息
   - 显示评审结果（同意/修改后同意/不同意）
   - AI总结的关键点标签显示
   - 可展开查看详细评审意见

2. **独立顾问回复**
   - 卡片形式展示顾问信息
   - 显示咨询问题和简要回复
   - 可展开查看完整回复和所有建议

### 新增优化功能

#### 1. 评审结果统计面板
- 同意/修改后同意/不同意的数量和百分比
- 专家参与度统计
- 意见冲突数量统计
- 直观的统计卡片展示

#### 2. 智能筛选和排序功能
- **按评审结果筛选**：同意/修改后同意/不同意
- **按专业背景筛选**：根据专家专业领域过滤
- **按时间/评分/结果排序**：支持升序/降序
- **关键要点搜索**：模糊匹配关键词

#### 3. 意见冲突检测
- 自动识别相互矛盾的专家意见
- 用橙色边框高亮显示冲突意见
- 在意见旁显示⚠警告图标
- 展开时显示冲突提醒面板

#### 4. 快速操作工具栏
- **全部展开/收起**：一键操作所有专家意见
- **标记重要**：⭐标记重要意见，支持切换
- **管理员备注**：为每个专家意见添加内部备注
- **生成汇总报告**：一键查看统计报告
- **显示/隐藏冲突**：控制冲突标识显示

#### 5. 增强的视觉体验
- **Tooltip提示**：悬停显示操作说明
- **状态标识**：重要标记、冲突警告等视觉提示
- **响应式布局**：适配不同屏幕尺寸
- **数据统计**：实时显示筛选结果数量

## 使用方式
```typescript
import ExpertReviewTab from "./components/expert-review-tab"

<ExpertReviewTab 
  expertOpinions={expertOpinions}
  advisorResponses={advisorResponses}
  className="custom-class"
/>
```

## 数据类型
```typescript
interface ExpertOpinion {
  id: string;
  expertId: string;
  expertName: string;
  department: string;
  title: string;
  date: string;
  opinion: string;
  detailedOpinion?: string;
  rating: number;
  result: "同意" | "修改后同意" | "不同意";
  category: string;
  specialty: string;
  expertise: string[];
  key_points: string[];
  follow_up_questions: string[];
  aiSummary: string;
}
```

## 当前使用位置
- `app/ethic-review/quick-review/[id]/summary/page.tsx` - 快速评审项目总结页面

## 技术特性
- **状态管理**：使用React Hooks管理复杂交互状态
- **性能优化**：使用useMemo进行数据计算缓存
- **类型安全**：完整的TypeScript类型定义
- **可访问性**：支持键盘导航和屏幕阅读器
- **响应式设计**：移动端友好的界面布局