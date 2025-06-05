import { ReviewFileItem } from "../review-file-list";

// 定义审查类型
export enum ReviewType {
  // 动物伦理审查类型
  ANIMAL_INITIAL = "animal_initial",
  ANIMAL_AMENDMENT = "animal_amendment",
  ANIMAL_CONTINUING = "animal_continuing",
  ANIMAL_FINAL = "animal_final",
  
  // 人体伦理审查类型
  HUMAN_INITIAL = "human_initial",
  HUMAN_AMENDMENT = "human_amendment",
  HUMAN_CONTINUING = "human_continuing",
  HUMAN_SAE = "human_sae", // 严重不良事件
  HUMAN_FINAL = "human_final",
  
  // 人类遗传资源审查类型
  HUMAN_GENETICS_COLLECTION = "human_genetics_collection", // 人遗采集审批
  HUMAN_GENETICS_PRESERVATION = "human_genetics_preservation", // 人遗保藏审批
  HUMAN_GENETICS_INTERNATIONAL = "human_genetics_international", // 国际合作科学研究审批
  HUMAN_GENETICS_EXPORT = "human_genetics_export", // 材料出境审批
  HUMAN_GENETICS_CLINICAL_TRIAL = "human_genetics_clinical_trial", // 国际合作临床试验备案
  HUMAN_GENETICS_PROVISION = "human_genetics_provision", // 对外提供或开放使用备案
  HUMAN_GENETICS_FAMILY_RESOURCE = "human_genetics_family_resource", // 重要遗传家系和特定地区人遗资源
  
  // 复审类型
  RECHECK = "recheck" // 复审
}

// 审查类型基础配置
export interface ReviewTypeConfig {
  type: ReviewType;
  title: string;
  description: string;
  path: string;
  returnPath: string;
}

// 审查类型配置
export const reviewTypeConfigs: Record<ReviewType, ReviewTypeConfig> = {
  // 动物伦理审查类型配置
  [ReviewType.ANIMAL_INITIAL]: {
    type: ReviewType.ANIMAL_INITIAL,
    title: "新增动物伦理初始审查",
    description: "首次提交动物实验伦理审查申请",
    path: "/ethic-projects/review/animal",
    returnPath: "/ethic-projects/animal"
  },
  [ReviewType.ANIMAL_AMENDMENT]: {
    type: ReviewType.ANIMAL_AMENDMENT,
    title: "新增动物伦理修改审查",
    description: "对已批准的动物实验伦理项目进行修改",
    path: "/ethic-projects/review/animal/amendment",
    returnPath: "/ethic-projects/animal"
  },
  [ReviewType.ANIMAL_CONTINUING]: {
    type: ReviewType.ANIMAL_CONTINUING,
    title: "新增动物伦理续期审查",
    description: "申请延长动物实验伦理项目的有效期",
    path: "/ethic-projects/review/animal/continuing",
    returnPath: "/ethic-projects/animal"
  },
  [ReviewType.ANIMAL_FINAL]: {
    type: ReviewType.ANIMAL_FINAL,
    title: "新增动物伦理结题审查",
    description: "动物实验伦理项目完成后的结题报告",
    path: "/ethic-projects/review/animal/final",
    returnPath: "/ethic-projects/animal"
  },
  
  // 人体伦理审查类型配置
  [ReviewType.HUMAN_INITIAL]: {
    type: ReviewType.HUMAN_INITIAL,
    title: "新增人体伦理初始审查",
    description: "首次提交人体研究伦理审查申请",
    path: "/ethic-projects/review/human",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_AMENDMENT]: {
    type: ReviewType.HUMAN_AMENDMENT,
    title: "新增人体伦理修改审查",
    description: "对已批准的人体研究伦理项目进行修改",
    path: "/ethic-projects/review/human/amendment",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_CONTINUING]: {
    type: ReviewType.HUMAN_CONTINUING,
    title: "新增人体伦理续期审查",
    description: "申请延长人体研究伦理项目的有效期",
    path: "/ethic-projects/review/human/continuing",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_SAE]: {
    type: ReviewType.HUMAN_SAE,
    title: "新增严重不良事件报告",
    description: "报告人体研究中发生的严重不良事件",
    path: "/ethic-projects/review/human/sae",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_FINAL]: {
    type: ReviewType.HUMAN_FINAL,
    title: "新增人体伦理结题审查",
    description: "人体研究伦理项目完成后的结题报告",
    path: "/ethic-projects/review/human/final",
    returnPath: "/ethic-projects/human"
  },
  
  // 人类遗传资源审查类型配置
  [ReviewType.HUMAN_GENETICS_COLLECTION]: {
    type: ReviewType.HUMAN_GENETICS_COLLECTION,
    title: "人类遗传资源采集审批",
    description: "审批人类遗传资源的采集",
    path: "/ethic-projects/review/human/genetics/collection",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_PRESERVATION]: {
    type: ReviewType.HUMAN_GENETICS_PRESERVATION,
    title: "人类遗传资源保藏审批",
    description: "审批人类遗传资源的保藏",
    path: "/ethic-projects/review/human/genetics/preservation",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_INTERNATIONAL]: {
    type: ReviewType.HUMAN_GENETICS_INTERNATIONAL,
    title: "国际合作科学研究审批",
    description: "审批国际合作科学研究",
    path: "/ethic-projects/review/human/genetics/international",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_EXPORT]: {
    type: ReviewType.HUMAN_GENETICS_EXPORT,
    title: "材料出境审批",
    description: "审批人类遗传资源材料出境",
    path: "/ethic-projects/review/human/genetics/export",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_CLINICAL_TRIAL]: {
    type: ReviewType.HUMAN_GENETICS_CLINICAL_TRIAL,
    title: "国际合作临床试验备案",
    description: "备案国际合作临床试验",
    path: "/ethic-projects/review/human/genetics/clinical-trial",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_PROVISION]: {
    type: ReviewType.HUMAN_GENETICS_PROVISION,
    title: "对外提供或开放使用备案",
    description: "备案对外提供或开放使用人类遗传资源",
    path: "/ethic-projects/review/human/genetics/provision",
    returnPath: "/ethic-projects/human"
  },
  [ReviewType.HUMAN_GENETICS_FAMILY_RESOURCE]: {
    type: ReviewType.HUMAN_GENETICS_FAMILY_RESOURCE,
    title: "重要遗传家系和特定地区人遗资源",
    description: "重要遗传家系和特定地区人遗资源",
    path: "/ethic-projects/review/human/genetics/family-resource",
    returnPath: "/ethic-projects/human"
  },
  
  // 复审类型配置
  [ReviewType.RECHECK]: {
    type: ReviewType.RECHECK,
    title: "复审",
    description: "复审",
    path: "/ethic-projects/review/recheck",
    returnPath: "/ethic-projects/review"
  }
};

// 获取动物伦理初始审查的文件列表
export function getAnimalInitialReviewFiles(): ReviewFileItem[] {
  return [
    {
      id: 1,
      fileName: "动物伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
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
      files: [],
      versionDate: "",
      versionNumber: "",
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
      files: [],
      versionDate: "",
      versionNumber: "",
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
      files: [],
      versionDate: "",
      versionNumber: "",
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
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ];
}

// 获取人体伦理初始审查的文件列表
export function getHumanInitialReviewFiles(): ReviewFileItem[] {
  return [
    {
      id: 1,
      fileName: "人体伦理审查申请表",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "申请表",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/human-ethics-application-form.docx"
    },
    {
      id: 2,
      fileName: "项目研究方案",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究方案",
      files: [],
      versionDate: "",
      versionNumber: "",
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
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/informed-consent-template.docx"
    },
    {
      id: 4,
      fileName: "研究者手册",
      format: "PDF/Word",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/investigator-brochure.docx"
    },
    {
      id: 5,
      fileName: "受试者招募材料",
      format: "PDF/Word/JPG",
      required: false,
      quantity: "不限制",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 6,
      fileName: "病例报告表",
      format: "PDF/Word/Excel",
      required: true,
      quantity: "1",
      fileType: "研究文件",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: true,
      templateUrl: "/templates/case-report-form.docx"
    },
    {
      id: 7,
      fileName: "研究者资质证明",
      format: "PDF/JPG",
      required: true,
      quantity: "不限制",
      fileType: "资质证明",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    },
    {
      id: 8,
      fileName: "其他支持性文件",
      format: "PDF/Word/Excel",
      required: false,
      quantity: "不限制",
      fileType: "其他",
      files: [],
      versionDate: "",
      versionNumber: "",
      hasTemplate: false,
      templateUrl: ""
    }
  ];
}

// 获取特定审查类型的配置
export function getReviewTypeConfig(type: ReviewType): ReviewTypeConfig {
  return reviewTypeConfigs[type];
} 