// 项目分类类型
export interface ProjectCategory {
  id: string
  name: string
  code: string
  level: string
  projectCount: number
  fundingStandard: string
  accountingType: string
  fundingForm: string
  managementMethod: string
  projectManagementMethod: string
  undergradCardRequirement: string
  masterCardRequirement: string
  phdCardRequirement: string
  description: string
  status: string
  createdAt: string
  type: string
  parentId: string | null
  children: string[]
}

// 预算标准类型
export interface BudgetStandard {
  id: string
  name: string
  code: string
  projectType: string
  limitAmount?: number
  description: string
  status: string
  createdAt: string
  type: string
}

// 评审表类型
export interface ReviewWorksheet {
  id: string
  name: string
  code: string
  projectType: string
  description: string
  status: string
  createdAt: string
  type: string
}

// 管理费提取方案类型
export interface ManagementFeeScheme {
  id: string
  name: string
  applicableProjectCategory: string
  status: string
  createdAt: string
  type: string
  description?: string
}

// 刊物级别类型
export interface JournalLevel {
  id: string
  code: string
  name: string
  paperType: string
  applicableJournalSource: string
  isIndexed: boolean
  status?: string
  createdAt: string
  type: string
  description?: string
}

// 用章类型
export interface SealType {
  id: string
  businessCategory: string
  businessType: string
  sealType: string
  status: string
  createdAt: string
  type: string
  description?: string
}

// 辅助数据类型
export type AuxiliaryItem = 
  | ProjectCategory 
  | BudgetStandard 
  | ReviewWorksheet 
  | ManagementFeeScheme
  | JournalLevel
  | SealType; 