/**
 * 动物伦理项目审查文件配置
 * 定义审查过程中需要提交的文件清单
 */

// 动物伦理审查文件清单
export const animalReviewFileList = [
  {
    id: 1,
    fileName: "动物伦理审查申请表",
    format: "PDF/Word",
    required: true,
    quantity: "1",
    fileType: "申请表",
    hasTemplate: true,
    templateUrl: "/templates/animal-ethics-application-form.docx"
  },
  {
    id: 2,
    fileName: "项目研究方案",
    format: "PDF/Word",
    required: true,
    quantity: "1",
    fileType: "研究方案",
    hasTemplate: true,
    templateUrl: "/templates/research-protocol-template.docx"
  },
  {
    id: 3,
    fileName: "知情同意书",
    format: "PDF/Word",
    required: true,
    quantity: "1",
    fileType: "知情同意",
    hasTemplate: true,
    templateUrl: "/templates/informed-consent-template.docx"
  },
  {
    id: 4,
    fileName: "调查问卷",
    format: "PDF/Word/Excel",
    required: false,
    quantity: "不限制",
    fileType: "调查问卷",
    hasTemplate: false,
    templateUrl: ""
  },
  {
    id: 5,
    fileName: "其他支持性文件",
    format: "PDF/Word/Excel",
    required: false,
    quantity: "不限制",
    fileType: "其他",
    hasTemplate: false,
    templateUrl: ""
  }
];

// 动物伦理审查状态
export const animalReviewStatuses = [
  { id: "pending", label: "待审核", color: "warning" },
  { id: "reviewing", label: "审核中", color: "secondary" },
  { id: "approved", label: "审核通过", color: "success" },
  { id: "rejected", label: "审核退回", color: "destructive" },
  { id: "revised", label: "修改后重审", color: "secondary" }
]; 