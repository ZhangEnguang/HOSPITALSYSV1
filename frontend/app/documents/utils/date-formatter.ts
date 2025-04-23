// 格式化日期，只显示年月日
export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // 如果日期无效，返回原始字符串
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr; // 出错时返回原始字符串
  }
}; 