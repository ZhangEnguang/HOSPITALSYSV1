// 自定义文件类型，扩展了ReviewFileItem中的files字段
export type CustomFile = {
  name: string;
  uploadedAt: string;
  size: number;
  status: string;
} 