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
        const issues: FileReviewIssue[] = [];
        let validFiles = 0;
        // 模拟项目编号
        const projectId = "ETH" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        files.forEach(file => {
          // 检查是否有上传的文件
          if (file.required && (!file.files || file.files.length === 0)) {
            issues.push({
              fileId: file.id,
              fileName: file.fileName,
              issueType: 'quantity',
              severity: 'error',
              message: `缺少必需的文件：${file.fileName}`,
              suggestion: '请上传此必需文件',
              autoFixable: false
            });
          } else if (file.files && file.files.length > 0) {
            validFiles++;
            
            // 对每个已上传的文件进行检查
            file.files.forEach(uploadedFile => {
              const fileName = uploadedFile.name || '';
              
              // 1. 文件类型验证
              if (!validateFileType(fileName, file.format)) {
                issues.push({
                  fileId: file.id,
                  fileName: file.fileName,
                  issueType: 'fileType',
                  severity: 'error',
                  message: `文件类型不匹配，应为${file.format}格式`,
                  suggestion: '请转换为正确的文件格式后重新上传',
                  autoFixable: file.format.includes('PDF') && 
                             (fileName.endsWith('.doc') || fileName.endsWith('.docx')),
                  originalValue: fileName.split('.').pop(),
                  suggestedValue: 'pdf'
                });
              }
              
              // 2. 版本号解析
              const versionNumber = parseVersionNumber(fileName);
              if (!versionNumber) {
                const fixedVersion = generateFixedVersionNumber(fileName);
                issues.push({
                  fileId: file.id,
                  fileName: uploadedFile.name,
                  issueType: 'version',
                  severity: 'warning',
                  message: '未检测到文件版本号或版本号格式不正确',
                  suggestion: `请在文件名中添加版本号(建议使用V${fixedVersion})`,
                  autoFixable: true,
                  originalValue: fileName,
                  suggestedValue: fileName.replace(/(\.[^.]+)$/, `_V${fixedVersion}$1`),
                  fixOptions: [`V${fixedVersion}`, `v${fixedVersion}`, fixedVersion]
                });
              } else if (!versionRegex.test('V' + versionNumber)) {
                const fixedVersion = generateFixedVersionNumber(fileName);
                issues.push({
                  fileId: file.id,
                  fileName: uploadedFile.name,
                  issueType: 'version',
                  severity: 'warning',
                  message: '版本号格式不符合规范',
                  suggestion: `版本号应符合规范(如V1.0)，建议修改为V${fixedVersion}`,
                  autoFixable: true,
                  originalValue: versionNumber,
                  suggestedValue: fixedVersion,
                  fixOptions: [`V${fixedVersion}`, `v${fixedVersion}`, fixedVersion]
                });
              }
              
              // 3. 文件命名检查
              const [isValidName, nameError] = validateFileName(fileName, projectId, file.fileType);
              if (!isValidName && nameError) {
                const correctedName = generateCorrectedFileName(
                  fileName, 
                  projectId, 
                  file.fileType,
                  versionNumber || '1.0'
                );
                
                issues.push({
                  fileId: file.id,
                  fileName: uploadedFile.name,
                  issueType: 'naming',
                  severity: 'warning',
                  message: `文件命名不规范: ${nameError}`,
                  suggestion: `建议重命名为"${correctedName}"格式`,
                  autoFixable: true,
                  originalValue: fileName,
                  suggestedValue: correctedName,
                  fixOptions: [
                    correctedName,
                    `${projectId}_${fileName}`,
                    fileName.replace(/(\.[^.]+)$/, `_${projectId}$1`)
                  ]
                });
              }
              
              // 4. 格式合规检查 (模拟)
              if (Math.random() > 0.8) {
                const formatIssues = [
                  '检测到文档包含修订痕迹，请清理后再提交',
                  '文档页码格式不一致，建议统一设置',
                  'PDF文件可能被加密保护，无法提取文本',
                  '文档字体不一致，建议统一字体',
                  '文档页边距设置不符合规范'
                ];
                const randomIssue = formatIssues[Math.floor(Math.random() * formatIssues.length)];
                
                issues.push({
                  fileId: file.id,
                  fileName: uploadedFile.name,
                  issueType: 'format',
                  severity: Math.random() > 0.5 ? 'warning' : 'error',
                  message: randomIssue,
                  suggestion: '请按照格式规范修改文档内容',
                  autoFixable: false
                });
              }
            });
          }
        });

        console.log("AI文件审查完成，发现问题:", issues.length);
        
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
      // 创建一个新的文件对象，使用新名称
      const renamedFile = new File([file], newName, { type: file.type });
      
      resolve({
        success: true,
        message: `文件已重命名为"${newName}"`,
        file: renamedFile
      });
    }, 500);
  });
} 