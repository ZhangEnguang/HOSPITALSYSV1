"use client"

import { FileTextIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 项目信息字段类型定义
export type ProjectInfoField = {
  key: string;
  label: string;
  value: string;
  disabled?: boolean;
  span?: 'full' | 'half'; // 控制字段占据的宽度
}

// 项目信息卡片标题组件
const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md mb-4">
      <div className="text-blue-500">
        {icon}
      </div>
      <h3 className="text-base font-medium text-slate-900">{title}</h3>
    </div>
  )
}

// 项目信息卡片组件，可配置显示字段
export function ProjectInfoCard({
  title = "项目信息",
  fields,
  updateField
}: {
  title?: string;
  fields: ProjectInfoField[];
  updateField?: (key: string, value: string) => void;
}) {
  // 将字段分组，每行最多显示2个字段
  const groupedFields = fields.reduce((acc: ProjectInfoField[][], field) => {
    if (field.span === 'full') {
      // 单独一行显示
      acc.push([field]);
    } else {
      // 检查最后一行是否有空间
      const lastRow = acc[acc.length - 1];
      if (lastRow && lastRow.length < 2 && !lastRow.some(f => f.span === 'full')) {
        lastRow.push(field);
      } else {
        acc.push([field]);
      }
    }
    return acc;
  }, []);

  return (
    <Card className="border-[#E9ECF2] shadow-sm">
      <CardContent className="p-6 space-y-6">
        <SectionTitle 
          icon={<FileTextIcon className="h-5 w-5" />} 
          title={title} 
        />
        
        {/* 使用分组后的字段进行渲染 */}
        {groupedFields.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 gap-4">
            {row.map((field, fieldIndex) => (
              <div 
                key={field.key} 
                className={`space-y-2 ${field.span === 'full' ? 'col-span-2' : ''}`}
              >
                <Label htmlFor={field.key} className="text-slate-800">
                  {field.label}
                </Label>
                <Input 
                  id={field.key} 
                  value={field.value} 
                  onChange={(e) => updateField && updateField(field.key, e.target.value)} 
                  className="border-[#E9ECF2] rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 text-black font-medium"
                  disabled={field.disabled}
                />
              </div>
            ))}
            {/* 如果只有一个字段且不是占满整行，添加一个空div保持布局对称 */}
            {row.length === 1 && row[0].span !== 'full' && (
              <div className="space-y-2">
                {/* 留空，保持布局对称 */}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// 项目信息预览卡片组件，用于预览对话框中显示
export function ProjectInfoPreview({
  title = "项目基本信息",
  fields
}: {
  title?: string;
  fields: ProjectInfoField[];
}) {
  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileTextIcon className="h-4 w-4 text-blue-500" />
          {title}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3">
        {fields.map((field) => (
          <div 
            key={field.key} 
            className={`space-y-1 ${field.span === 'full' ? 'col-span-2' : ''}`}
          >
            <p className="text-xs text-slate-500">{field.label}</p>
            <p className="text-sm font-medium text-slate-800">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 