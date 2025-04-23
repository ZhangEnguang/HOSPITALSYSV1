import * as z from "zod"

export const applicationSchema = z.object({
  // 基本信息
  title: z.string().min(2, {
    message: "申报标题至少需要2个字符",
  }),
  batch: z.string({
    required_error: "请选择申报批次",
  }),
  category: z.string({
    required_error: "请选择申报类别",
  }),
  description: z.string().min(10, {
    message: "描述至少需要10个字符",
  }),
  
  // 申请人信息
  applicantName: z.string().min(2, {
    message: "申请人姓名至少需要2个字符",
  }),
  applicantDepartment: z.string({
    required_error: "请选择申请人所在部门",
  }),
  applicantPhone: z.string().min(11, {
    message: "请输入有效的联系电话",
  }),
  applicantEmail: z.string().email({
    message: "请输入有效的电子邮箱",
  }),
  
  // 项目信息
  projectName: z.string().min(2, {
    message: "项目名称至少需要2个字符",
  }),
  projectBudget: z.string().min(1, {
    message: "请输入项目预算",
  }),
  projectStartDate: z.date({
    required_error: "请选择项目开始日期",
  }),
  projectEndDate: z.date({
    required_error: "请选择项目结束日期",
  }),
  
  // 附件
  attachments: z.array(z.any()).optional(),
  
  // 附加信息
  additionalInfo: z.string().optional(),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

export const defaultValues: Partial<ApplicationFormValues> = {
  title: "",
  description: "",
  applicantName: "",
  applicantPhone: "",
  applicantEmail: "",
  projectName: "",
  projectBudget: "",
  additionalInfo: "",
  attachments: [],
} 