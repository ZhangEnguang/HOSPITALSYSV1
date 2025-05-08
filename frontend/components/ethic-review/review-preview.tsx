"use client"

import { CheckCircle2, AlertCircle, FileText, FileTextIcon } from "lucide-react"
import { ProjectInfoField } from "./project-info-card"
import { ReviewFileItem } from "./review-file-list"

// 项目信息预览组件
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

// 修改说明预览组件
export function AmendmentDescriptionPreview({
  title = "修改说明",
  description
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileTextIcon className="h-4 w-4 text-blue-500" />
          {title}
        </h3>
      </div>
      
      <div className="px-4 py-3">
        {description ? (
          <p className="text-sm text-slate-800 whitespace-pre-line">{description}</p>
        ) : (
          <p className="text-sm text-slate-500 italic">未提供修改说明</p>
        )}
      </div>
    </div>
  )
}

// 送审文件预览组件
export function ReviewFilePreview({
  title = "送审文件信息",
  fileList
}: {
  title?: string;
  fileList: ReviewFileItem[];
}) {
  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileTextIcon className="h-4 w-4 text-blue-500" />
          {title}
        </h3>
      </div>
      
      <div className="px-4 py-3 space-y-4">
        {/* 送审文件表格 */}
        <div className="overflow-hidden rounded-md border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left font-medium text-slate-700 border-b border-gray-200 w-[25%]">文件名称</th>
                <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%]">必填</th>
                <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[10%] whitespace-nowrap">数量</th>
                <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[15%] whitespace-nowrap">文件类型</th>
                <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[20%]">已上传</th>
                <th className="py-2 px-3 text-center font-medium text-slate-700 border-b border-gray-200 w-[20%]">版本信息</th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-3 border-b border-gray-200 font-medium">{item.fileName}</td>
                  <td className="py-2 px-3 text-center border-b border-gray-200">
                    {item.required ? 
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">必填</span> : 
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">选填</span>
                    }
                  </td>
                  <td className="py-2 px-3 text-center border-b border-gray-200 whitespace-nowrap">{item.quantity}</td>
                  <td className="py-2 px-3 text-center border-b border-gray-200 whitespace-nowrap">{item.fileType}</td>
                  <td className="py-2 px-3 text-center border-b border-gray-200">
                    {item.files.length > 0 ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {item.files.length}个文件
                      </span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        未上传
                      </span>
                    }
                  </td>
                  <td className="py-2 px-3 text-center border-b border-gray-200">
                    {item.versionDate || item.versionNumber ? 
                      <div className="text-xs">
                        {item.versionDate && <span className="text-slate-600">{item.versionDate}</span>}
                        {item.versionDate && item.versionNumber && <span className="mx-1">|</span>}
                        {item.versionNumber && <span className="font-medium text-slate-800">{item.versionNumber}</span>}
                      </div> : 
                      <span className="text-gray-400">-</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 已上传文件详情 */}
        <div>
          <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            已上传文件详情
          </h4>
          
          <div className="border border-gray-200 rounded-md bg-gray-50 divide-y divide-gray-200">
            {fileList.some(item => item.files.length > 0) ? (
              fileList.map(item => 
                item.files.length > 0 && (
                  <div key={item.id} className="px-3 py-2">
                    <div className="font-medium text-xs text-slate-700 mb-1.5">
                      {item.fileName}
                    </div>
                    <div className="space-y-1">
                      {item.files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs pl-2">
                          <FileText className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          <span className="text-slate-600 truncate">
                            {file.name}
                          </span>
                          <span className="text-slate-500 ml-auto whitespace-nowrap">
                            {(file.size / 1024).toFixed(1)}KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="p-4 text-center">
                <div className="text-xs text-gray-500 flex flex-col items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-400 mb-1" />
                  暂无已上传文件
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 