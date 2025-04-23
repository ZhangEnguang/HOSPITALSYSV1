import React, { useEffect } from 'react';
import { useDictStore } from '@/stores/dictStore';
import { DictDataDTO } from '@/types/dict';

interface DictTextProps {
  dictCode: string; // 字典编码
  value?: string | number | string[] | undefined; // 字典值，支持单值或数组
  defaultText?: string; // 未找到字典项时显示的默认文本
  className?: string; // 自定义类名
  separator?: string; // 当value为数组时的分隔符
}

/**
 * 字典文本组件
 * 用于将字典值显示为对应的字典标签
 */
const DictText: React.FC<DictTextProps> = ({
  dictCode,
  value,
  defaultText,
  className = '',
  separator = ' '
}) => {
  const { fetch, dictionaries } = useDictStore();
  
  // 加载字典数据
  useEffect(() => {
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);
  
  // 如果没有值，直接返回默认文本或空
  if (value === undefined || value === null || value === '') {
    return <span className={className}>{defaultText || ''}</span>;
  }

  // 字典数据
  const dictData = dictionaries[dictCode]?.data || [];
  
  // 处理数组类型的值
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className={className}>{defaultText || ''}</span>;
    }
    
    // 映射数组中的每个值为对应的字典标签
    const labels = value.map(v => {
      const dictItem = dictData.find((item: DictDataDTO) => 
        item.dictValue === String(v)
      );
      return dictItem ? dictItem.dictLabel : (defaultText || String(v));
    });
    
    return <span className={className}>{labels.join(separator)}</span>;
  }
  
  // 处理逗号分隔的字符串
  if (typeof value === 'string' && value.includes(',')) {
    const valueArray = value.split(',').filter(v => v.trim());
    if (valueArray.length === 0) {
      return <span className={className}>{defaultText || ''}</span>;
    }
    
    // 映射分割后的每个值为对应的字典标签
    const labels = valueArray.map(v => {
      const dictItem = dictData.find((item: DictDataDTO) => 
        item.dictValue === v.trim()
      );
      return dictItem ? dictItem.dictLabel : (defaultText || v.trim());
    });
    
    return <span className={className}>{labels.join(separator)}</span>;
  }
  
  // 处理单值情况
  const dictItem = dictData.find((item: DictDataDTO) => 
    item.dictValue === String(value)
  );
  
  return (
    <span className={className}>
      {dictItem ? dictItem.dictLabel : (defaultText || String(value))}
    </span>
  );
};

export default DictText; 