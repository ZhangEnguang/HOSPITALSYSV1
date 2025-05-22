// AI文件审查服务

import { ReviewFileItem } from "@/components/ethic-review/review-file-list";

export interface FileReviewIssue {
  fileId: number;
  fileName: string;
  issueType: 'quantity' | 'fileType' | 'naming' | 'version' | 'format';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  autoFixable: boolean;
  // 增加差异对比所需字段
  originalValue?: string;
  suggestedValue?: string;
  // 修正方案
  fixOptions?: string[];
  // 是否已修复
  fixed?: boolean;
}

export interface FileReviewResult {
  hasIssues: boolean;
  issues: FileReviewIssue[];
  totalFiles: number;
  validFiles: number;
}

// 文件扩展名白名单配置（实际应用中应从后端API获取）
const allowedExtensions: Record<string, string[]> = {
  'PDF': ['.pdf'],
  'Word': ['.doc', '.docx'],
  'Excel': ['.xls', '.xlsx'],
  'JPG': ['.jpg', '.jpeg'],
  'PNG': ['.png']
};

// 版本号验证正则
const versionRegex = /^V?\d+(\.\d+)*$/i;

// 文件名模板规则（实际应用中应从后端API获取）
const fileNameTemplate = '[项目编号]_[文件类型]_V[版本号]';

// 检查文件扩展名是否符合要求
function validateFileType(fileName: string, allowedFormats: string): boolean {
  if (!fileName) return false;
  
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  const formats = allowedFormats.split('/');
  
  return formats.some(format => {
    const validExtensions = allowedExtensions[format.toUpperCase()];
    return validExtensions && validExtensions.includes(extension);
  });
}

// 解析版本号
function parseVersionNumber(fileName: string): string | null {
  // 尝试从文件名中提取版本号
  const versionMatch = fileName.match(/[vV](\d+(\.\d+)*)/);
  if (versionMatch) {
    return versionMatch[1];
  }
  
  // 尝试提取纯数字版本
  const numericMatch = fileName.match(/_(\d+(\.\d+)*)[\._]/);
  if (numericMatch) {
    return numericMatch[1];
  }
  
  return null;
}

// 验证文件命名是否符合规范
function validateFileName(fileName: string, projectId: string, fileType: string): [boolean, string | null] {
  // 提取项目编号（假设应该以项目编号开头）
  if (!fileName.startsWith(projectId) && !fileName.includes(`_${projectId}_`)) {
    return [false, `缺少项目编号前缀"${projectId}"`];
  }
  
  // 检查是否包含文件类型标识
  if (!fileName.includes(fileType) && !fileName.includes(fileType.toLowerCase())) {
    return [false, `文件名应包含文件类型标识"${fileType}"`];
  }
  
  // 检查版本号
  const versionNumber = parseVersionNumber(fileName);
  if (!versionNumber) {
    return [false, `缺少版本号标识符(如V1.0)`];
  }
  
  return [true, null];
}

// 生成修正后的文件名
function generateCorrectedFileName(fileName: string, projectId: string, fileType: string, versionNumber: string): string {
  // 获取文件扩展名
  const extension = '.' + fileName.split('.').pop();
  // 基本文件名（不含扩展名）
  const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  
  // 生成符合模板的新文件名
  return `${projectId}_${fileType}_V${versionNumber}${extension}`;
}

// 生成自动修复版本号
function generateFixedVersionNumber(fileName: string): string {
  // 从文件名中提取数字
  const numbers = fileName.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    // 如果找到数字，使用第一个数字作为主版本号
    const majorVersion = numbers[0];
    return numbers.length > 1 ? `${majorVersion}.${numbers[1]}` : `${majorVersion}.0`;
  }
  // 如果没有找到数字，默认使用1.0
  return '1.0';
}

// 检查文件列表是否有效
function isValidFileList(files: any[]): files is ReviewFileItem[] {
  return Array.isArray(files) && files.every(file => 
    typeof file === 'object' && 
    file !== null && 
    'id' in file && 
    'fileName' in file
  );
}

// 模拟AI检查文件的函数
export async function aiReviewFiles(files: ReviewFileItem[]): Promise<FileReviewResult> {
  // 在实际应用中，这里应该调用AI服务API
  // 这里我们模拟一个异步操作
  return new Promise((resolve) => {
    // 确保文件列表是有效的
    if (!isValidFileList(files)) {
      console.error("文件列表格式无效");
      resolve({
        hasIssues: true,
        issues: [{
          fileId: 0,
          fileName: "系统",
          issueType: 'format',
          severity: 'error',
          message: "文件列表格式无效",
          suggestion: "请检查文件上传组件",
          autoFixable: false
        }],
        totalFiles: 0,
        validFiles: 0
      });
      return;
    }
    
    // 设置较短的超时，避免用户等待太久
    setTimeout(() => {
      try {
        // 控制总问题数量，最多10个
        const MAX_ISSUES = 10;
        const issues: FileReviewIssue[] = [];
        let validFiles = 0;

        // 模拟项目编号
        const projectId = "ETH" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        // 创建已处理文件类型的跟踪集合，确保每种问题类型只出现一次
        const processedIssueTypes = new Set<string>();
        
        // 跟踪每个文件ID已添加的问题类型
        const fileIssueTypes = new Map<number, Set<string>>();

        // 添加问题的函数，确保不重复添加同类型问题
        const addIssue = (issue: FileReviewIssue) => {
          const issueKey = `${issue.fileId}_${issue.issueType}`;
          
          // 如果这个文件的这种问题类型已经添加过，或者总问题数已达上限，则跳过
          if (processedIssueTypes.has(issueKey) || issues.length >= MAX_ISSUES) {
            return false;
          }
          
          // 记录已处理的问题类型
          processedIssueTypes.add(issueKey);
          
          // 为文件ID初始化问题类型集合
          if (!fileIssueTypes.has(issue.fileId)) {
            fileIssueTypes.set(issue.fileId, new Set());
          }
          
          // 记录该文件已添加的问题类型
          fileIssueTypes.get(issue.fileId)!.add(issue.issueType);
          
          // 添加问题
          issues.push(issue);
          return true;
        };

        // 首先处理所有文件的必填项检查
        files.forEach(file => {
          // 检查是否有上传的文件
          if (file.required && (!file.files || file.files.length === 0)) {
            addIssue({
              fileId: file.id,
              fileName: file.fileName,
              issueType: 'quantity',
              severity: 'warning',
              message: `缺少必需的文件：${file.fileName}`,
              suggestion: '建议上传此文件，但可以继续提交',
              autoFixable: false
            });
          } else if (file.files && file.files.length > 0) {
            validFiles++;
          }
        });

        // 预设一些固定的问题以确保覆盖各种类型
        const predefinedIssues = [
          // 文件类型不匹配问题 - 针对受试者招募材料
          {
            fileId: 5, // 假设ID 5是受试者招募材料
            fileName: "受试者招募材料.doc",
            issueType: 'fileType' as const,
            severity: 'error' as const,
            message: "文件类型不匹配，应为PDF/Word/JPG格式",
            suggestion: "请转换为正确的文件格式后重新上传",
            autoFixable: true,
            originalValue: "doc",
            suggestedValue: "pdf"
          },
          // 版本号缺失问题
          {
            fileId: 2, // 研究方案
            fileName: "项目研究方案.pdf",
            issueType: 'version' as const,
            severity: 'warning' as const,
            message: "未检测到文件版本号或版本号格式不正确",
            suggestion: "请在文件名中添加版本号(建议使用V1.0)",
            autoFixable: true,
            originalValue: "项目研究方案.pdf",
            suggestedValue: "项目研究方案_V1.0.pdf",
            fixOptions: ["V1.0", "v1.0", "1.0"]
          },
          // 文件命名规范问题
          {
            fileId: 1, // 伦理审查申请表
            fileName: "伦理审查申请表.docx",
            issueType: 'naming' as const,
            severity: 'warning' as const,
            message: "文件命名不规范: 缺少项目编号前缀",
            suggestion: `建议重命名为"${projectId}_申请表_V1.0.docx"格式`,
            autoFixable: true,
            originalValue: "伦理审查申请表.docx",
            suggestedValue: `${projectId}_申请表_V1.0.docx`,
            fixOptions: [
              `${projectId}_申请表_V1.0.docx`,
              `${projectId}_伦理审查申请表.docx`,
              `伦理审查申请表_${projectId}.docx`
            ]
          },
          // 文件格式问题
          {
            fileId: 3, // 知情同意书
            fileName: "知情同意书_V1.2.pdf",
            issueType: 'format' as const,
            severity: 'error' as const,
            message: "PDF文件可能被加密保护，无法提取文本",
            suggestion: "请解除PDF加密后再提交",
            autoFixable: false
          },
          // 其他格式问题，严重性为警告
          {
            fileId: 4, // 研究者手册
            fileName: "研究者手册_V2.0.doc",
            issueType: 'format' as const, 
            severity: 'warning' as const,
            message: "检测到文档包含修订痕迹，请清理后再提交",
            suggestion: "按照格式规范清理文档修订痕迹",
            autoFixable: false
          }
        ];
        
        // 添加预设问题
        predefinedIssues.forEach(issue => {
          // 确保文件存在
          const fileExists = files.some(f => f.id === issue.fileId);
          if (fileExists) {
            addIssue(issue);
          }
        });
        
        // 如果预设问题不足，随机生成少量其他问题以达到理想的演示效果
        if (issues.length < 7) {
          files.forEach(file => {
            if (file.files && file.files.length > 0 && issues.length < 7) {
              // 仅为未添加过问题的文件添加随机问题
              const fileId = file.id;
              const fileIssues = fileIssueTypes.get(fileId) || new Set();
              
              if (fileIssues.size < 1) { // 每个文件最多一个随机问题
                const fileName = file.files[0].name || '未命名文件.pdf';
                
                // 可能的问题类型
                const possibleIssueTypes = [
                  'version', 'naming', 'format'
                ].filter(type => !fileIssues.has(type));
                
                if (possibleIssueTypes.length > 0) {
                  // 随机选择一个问题类型
                  const issueType = possibleIssueTypes[Math.floor(Math.random() * possibleIssueTypes.length)] as 'version' | 'naming' | 'format';
                  
                  // 根据问题类型生成不同的问题描述
                  let issue: FileReviewIssue;
                  
                  switch (issueType) {
                    case 'version':
                      issue = {
                        fileId,
                        fileName,
                        issueType: 'version',
                        severity: 'warning',
                        message: '版本号格式不符合规范',
                        suggestion: '版本号应符合规范(如V1.0)',
                        autoFixable: true,
                        originalValue: fileName,
                        suggestedValue: fileName.replace(/(\.[^.]+)$/, `_V1.0$1`),
                        fixOptions: ["V1.0", "v1.0", "1.0"]
                      };
                      break;
                    case 'naming':
                      issue = {
                        fileId,
                        fileName,
                        issueType: 'naming',
                        severity: 'warning',
                        message: '文件命名不规范',
                        suggestion: `文件名应包含项目标识和版本号`,
                        autoFixable: true,
                        originalValue: fileName,
                        suggestedValue: `${projectId}_${file.fileType}_V1.0.${fileName.split('.').pop()}`,
                        fixOptions: []
                      };
                      break;
                    case 'format':
                    default:
                      const formatIssues = [
                        '文档页码格式不一致，建议统一设置',
                        '文档字体不一致，建议统一字体',
                        '文档页边距设置不符合规范'
                      ];
                      const randomIssue = formatIssues[Math.floor(Math.random() * formatIssues.length)];
                      issue = {
                        fileId,
                        fileName,
                        issueType: 'format',
                        severity: 'warning',
                        message: randomIssue,
                        suggestion: '请按照格式规范修改文档内容',
                        autoFixable: false
                      };
                      break;
                  }
                  
                  addIssue(issue);
                }
              }
            }
          });
        }
        
        // 计算问题数量
        const errorCount = issues.filter(i => i.severity === 'error').length;
        const warningCount = issues.filter(i => i.severity === 'warning').length;
        
        console.log(`AI文件审查完成，发现问题: ${issues.length} (${errorCount}个错误, ${warningCount}个警告)`);
        
        resolve({
          hasIssues: issues.length > 0,
          issues,
          totalFiles: files.length,
          validFiles
        });
      } catch (error) {
        console.error("AI文件审查过程出错:", error);
        resolve({
          hasIssues: true,
          issues: [{
            fileId: 0,
            fileName: "系统",
            issueType: 'format',
            severity: 'error',
            message: "文件审查过程发生内部错误",
            suggestion: "请联系管理员或重试",
            autoFixable: false
          }],
          totalFiles: files.length,
          validFiles: 0
        });
      }
    }, 1000); // 修改为较短的延迟时间
  });
}

// 自动修复文件问题
export async function autoFixFileIssues(issues: FileReviewIssue[]): Promise<FileReviewIssue[]> {
  // 模拟异步自动修复过程
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 筛选出可自动修复的问题并标记为已修复
        const fixedIssues = issues.map(issue => {
          if (issue.autoFixable) {
            return {
              ...issue,
              severity: 'info' as const,
              message: `已自动修复: ${issue.message}`,
              fixed: true
            };
          }
          return issue;
        });
        
        resolve(fixedIssues);
      } catch (error) {
        console.error("自动修复过程出错:", error);
        resolve(issues);
      }
    }, 800);
  });
}

// 自动转换文件格式（模拟）
export async function convertFileFormat(file: File, targetFormat: string): Promise<{
  success: boolean,
  message: string,
  file?: File
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟成功率
      if (Math.random() > 0.2) {
        // 构造一个模拟的转换后文件对象
        const fileName = file.name.replace(/\.[^.]+$/, `_converted.${targetFormat.toLowerCase()}`);
        const convertedFile = new File([file], fileName, { type: `application/${targetFormat.toLowerCase()}` });
        
        resolve({
          success: true,
          message: `文件已成功转换为${targetFormat}格式`,
          file: convertedFile
        });
      } else {
        resolve({
          success: false,
          message: "文件转换失败，请手动转换后上传"
        });
      }
    }, 1200);
  });
}

// 自动重命名文件（模拟）
export async function renameFile(file: File, newName: string): Promise<{
  success: boolean,
  message: string,
  file?: File
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // 创建一个新的文件对象，使用新名称
        const renamedFile = new File([file], newName, { type: file.type });
        
        resolve({
          success: true,
          message: `文件已重命名为"${newName}"`,
          file: renamedFile
        });
      } catch (error) {
        console.error("重命名文件失败:", error);
        resolve({
          success: false,
          message: "重命名文件失败，请稍后重试"
        });
      }
    }, 500);
  });
} 