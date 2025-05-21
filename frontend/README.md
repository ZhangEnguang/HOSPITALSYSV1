# AI形式审查引导功能

## 功能概述

AI形式审查引导功能是为人体审查申请表单添加的智能辅助功能，帮助用户在提交前发现并修复文件问题，显著降低退回率。主要包含以下功能点：

1. **首次使用引导**：首次使用时通过浮层介绍AI形式审查功能和使用方法
2. **下次是否提示**：用户可选择是否在下次继续显示引导说明
3. **轻量级提交提醒**：当用户跳过AI审查直接提交时显示温馨提示
4. **智能问题检测**：自动检查文件命名、格式和版本要求
5. **统计数据展示**：向用户展示使用AI形式审查可减少60%退回率

## 文件结构

```
components/
  ethic-review/
    ai-form-check-guide.tsx        # AI形式审查引导组件
    ai-review-reminder.tsx         # 轻量级AI审查提醒组件
    ai-file-review-result.tsx      # AI审查结果展示组件
app/
  ethic-projects/review/human/
    components/
      human-initial-review.tsx     # 集成了AI审查引导功能的表单组件
app/services/
  ai-file-review.ts                # AI文件审查服务
```

## 使用流程

1. 用户首次访问人体审查申请表单时，会显示AI形式审查引导
2. 用户可以选择「开始使用」立即体验AI形式审查，或关闭引导
3. 如用户选择跳过AI审查直接点击「提交送审」，会显示轻量级提醒
4. 用户可以在提醒中选择「启用AI形式审查」或「继续提交送审」
5. 使用AI形式审查后，系统会显示审查结果，并提供修复建议

## 本地存储

系统使用localStorage存储用户偏好设置，包括：

- `ai_form_check_guide_shown`: 标记用户是否已经查看过AI形式审查引导 