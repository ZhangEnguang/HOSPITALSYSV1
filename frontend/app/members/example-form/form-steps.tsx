"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

// 成员基本信息步骤
export const MemberBasicInfoStep = ({
  formData,
  handleInputChange,
  validationErrors,
}: {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">基本信息</h2>
        <p className="text-sm text-muted-foreground">请填写成员的基本信息</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名 <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData["姓名"] || ""}
              onChange={(e) => handleInputChange("姓名", e.target.value)}
              className={validationErrors["姓名"] ? "border-red-500" : ""}
            />
            {validationErrors["姓名"] && (
              <p className="text-xs text-red-500">{validationErrors["姓名"]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">性别</Label>
            <Select
              value={formData["性别"] || ""}
              onValueChange={(value) => handleInputChange("性别", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="请选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男">男</SelectItem>
                <SelectItem value="女">女</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">所属部门 <span className="text-red-500">*</span></Label>
            <Select
              value={formData["所属部门"] || ""}
              onValueChange={(value) => handleInputChange("所属部门", value)}
            >
              <SelectTrigger id="department" className={validationErrors["所属部门"] ? "border-red-500" : ""}>
                <SelectValue placeholder="请选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="能源研究院">能源研究院</SelectItem>
                <SelectItem value="信息工程学院">信息工程学院</SelectItem>
                <SelectItem value="机械工程学院">机械工程学院</SelectItem>
                <SelectItem value="软件工程学院">软件工程学院</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors["所属部门"] && (
              <p className="text-xs text-red-500">{validationErrors["所属部门"]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">职称</Label>
            <Select
              value={formData["职称"] || ""}
              onValueChange={(value) => handleInputChange("职称", value)}
            >
              <SelectTrigger id="title">
                <SelectValue placeholder="请选择职称" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="教授">教授</SelectItem>
                <SelectItem value="副教授">副教授</SelectItem>
                <SelectItem value="讲师">讲师</SelectItem>
                <SelectItem value="研究员">研究员</SelectItem>
                <SelectItem value="助理研究员">助理研究员</SelectItem>
                <SelectItem value="博士后">博士后</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">专业方向</Label>
          <Textarea
            id="expertise"
            value={formData["专业方向"] || ""}
            onChange={(e) => handleInputChange("专业方向", e.target.value)}
            placeholder="请简要描述成员的专业方向"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

// 联系方式步骤
export const MemberContactStep = ({
  formData,
  handleInputChange,
  validationErrors,
}: {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">联系方式</h2>
        <p className="text-sm text-muted-foreground">请填写成员的联系方式信息</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">手机号码 <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              value={formData["手机号码"] || ""}
              onChange={(e) => handleInputChange("手机号码", e.target.value)}
              className={validationErrors["手机号码"] ? "border-red-500" : ""}
            />
            {validationErrors["手机号码"] && (
              <p className="text-xs text-red-500">{validationErrors["手机号码"]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱 <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData["电子邮箱"] || ""}
              onChange={(e) => handleInputChange("电子邮箱", e.target.value)}
              className={validationErrors["电子邮箱"] ? "border-red-500" : ""}
            />
            {validationErrors["电子邮箱"] && (
              <p className="text-xs text-red-500">{validationErrors["电子邮箱"]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="office">办公室地点</Label>
            <Input
              id="office"
              value={formData["办公室地点"] || ""}
              onChange={(e) => handleInputChange("办公室地点", e.target.value)}
              placeholder="例如: A楼301"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-preference">首选联系方式</Label>
            <RadioGroup
              value={formData["首选联系方式"] || "电子邮箱"}
              onValueChange={(value) => handleInputChange("首选联系方式", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="电子邮箱" id="preference-email" />
                <Label htmlFor="preference-email">电子邮箱</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="手机" id="preference-phone" />
                <Label htmlFor="preference-phone">手机</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

// 身份信息步骤
export const MemberIdentityStep = ({
  formData,
  handleInputChange,
  validationErrors,
}: {
  formData: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">其他信息</h2>
        <p className="text-sm text-muted-foreground">请补充成员的其他相关信息</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id-number">身份证号</Label>
            <Input
              id="id-number"
              value={formData["身份证号"] || ""}
              onChange={(e) => handleInputChange("身份证号", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee-id">工号</Label>
            <Input
              id="employee-id"
              value={formData["工号"] || ""}
              onChange={(e) => handleInputChange("工号", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>项目权限</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="permission-create"
                checked={formData["权限_创建项目"] || false}
                onCheckedChange={(checked) => handleInputChange("权限_创建项目", checked === true)}
              />
              <Label htmlFor="permission-create" className="cursor-pointer">创建项目</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="permission-review"
                checked={formData["权限_审核项目"] || false}
                onCheckedChange={(checked) => handleInputChange("权限_审核项目", checked === true)}
              />
              <Label htmlFor="permission-review" className="cursor-pointer">审核项目</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="permission-budget"
                checked={formData["权限_预算管理"] || false}
                onCheckedChange={(checked) => handleInputChange("权限_预算管理", checked === true)}
              />
              <Label htmlFor="permission-budget" className="cursor-pointer">预算管理</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="permission-export"
                checked={formData["权限_导出报表"] || false}
                onCheckedChange={(checked) => handleInputChange("权限_导出报表", checked === true)}
              />
              <Label htmlFor="permission-export" className="cursor-pointer">导出报表</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">备注</Label>
          <Textarea
            id="notes"
            value={formData["备注"] || ""}
            onChange={(e) => handleInputChange("备注", e.target.value)}
            placeholder="请填写其他需要说明的信息"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

// 预览步骤
export const MemberPreviewStep = ({
  formData,
}: {
  formData: Record<string, any>;
}) => {
  // 权限显示
  const permissions = [
    {key: "权限_创建项目", label: "创建项目"},
    {key: "权限_审核项目", label: "审核项目"},
    {key: "权限_预算管理", label: "预算管理"},
    {key: "权限_导出报表", label: "导出报表"},
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">信息预览</h2>
        <p className="text-sm text-muted-foreground">请核对以下成员信息，确认无误后提交</p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">基本信息</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">姓名</div>
                    <div>{formData["姓名"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">性别</div>
                    <div>{formData["性别"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">所属部门</div>
                    <div>{formData["所属部门"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">职称</div>
                    <div>{formData["职称"] || "-"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">专业方向</h3>
                <div className="mt-1">
                  <p className="text-sm">{formData["专业方向"] || "-"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">联系方式</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">手机号码</div>
                    <div>{formData["手机号码"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">电子邮箱</div>
                    <div>{formData["电子邮箱"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">办公室地点</div>
                    <div>{formData["办公室地点"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">首选联系方式</div>
                    <div>{formData["首选联系方式"] || "-"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">其他信息</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">身份证号</div>
                    <div>{formData["身份证号"] || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">工号</div>
                    <div>{formData["工号"] || "-"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">权限</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {permissions.map(({key, label}) => (
                    formData[key] ? (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {label}
                      </span>
                    ) : null
                  ))}
                  {!permissions.some(({key}) => formData[key]) && <span className="text-gray-500">-</span>}
                </div>
              </div>
            </div>
          </div>

          {formData["备注"] && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">备注</h3>
              <div className="mt-1">
                <p className="text-sm">{formData["备注"]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
