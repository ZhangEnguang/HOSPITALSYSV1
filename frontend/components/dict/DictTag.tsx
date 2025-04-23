import React, { useEffect } from 'react';
import { useDictStore } from '@/stores/dictStore';
import { DictDataDTO } from '@/types/dict';

interface DictTagProps {
  dictCode: string; // 字典编码
  value?: string | number | string[] | undefined; // 字典值，支持单值或数组
  defaultText?: string; // 未找到字典项时显示的默认文本
  className?: string; // 自定义类名
  showBorder?: boolean; // 是否显示边框
  useColor?: boolean; // 是否使用字典项的颜色属性
  colorMap?: Record<string, string>; // 自定义颜色映射，优先级高于useColor
  separator?: string; // 当value为数组时的分隔符
}

/**
 * 字典标签组件
 * 用于将字典值显示为带样式的标签
 */
const DictTag: React.FC<DictTagProps> = ({
  dictCode,
  value,
  defaultText,
  className = '',
  showBorder = true,
  useColor = true,
  colorMap,
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
    
    // 为数组中的每个值创建标签
    return (
      <span className={className}>
        {value.map((v, index) => {
          const dictItem = dictData.find((item: DictDataDTO) => 
            item.dictValue === String(v)
          );
          
          if (!dictItem) {
            return (
              <React.Fragment key={index}>
                {index > 0 && separator}{defaultText || String(v)}
              </React.Fragment>
            );
          }
          
          // 确定标签颜色
          let backgroundColor = '';
          let textColor = '';
          
          // 优先使用传入的颜色映射
          if (colorMap && colorMap[dictItem.dictValue]) {
            backgroundColor = colorMap[dictItem.dictValue];
          } 
          // 其次使用字典项自带的颜色属性
          else if (useColor && dictItem.color) {
            backgroundColor = dictItem.color;
          } 
          // 默认颜色根据字典值自动生成
          else {
            // 简单的哈希函数生成颜色
            const hash = Array.from(dictItem.dictValue).reduce((acc, char) => {
              return acc + char.charCodeAt(0);
            }, 0);
            
            // 生成浅色背景
            const hue = hash % 360;
            backgroundColor = `hsl(${hue}, 70%, 90%)`;
            textColor = `hsl(${hue}, 80%, 30%)`;
          }
          
          return (
            <React.Fragment key={index}>
              {index > 0 && separator}
              <span
                className={`inline-block px-2 py-1 text-xs rounded-md ${showBorder ? 'border' : ''}`}
                style={{
                  backgroundColor,
                  color: textColor || (backgroundColor ? '#333' : 'inherit'),
                  borderColor: textColor || backgroundColor || 'currentColor'
                }}
              >
                {dictItem.dictLabel}
              </span>
            </React.Fragment>
          );
        })}
      </span>
    );
  }
  
  // 处理逗号分隔的字符串
  if (typeof value === 'string' && value.includes(',')) {
    const valueArray = value.split(',').filter(v => v.trim());
    if (valueArray.length === 0) {
      return <span className={className}>{defaultText || ''}</span>;
    }
    
    // 为分割后的每个值创建标签
    return (
      <span className={className}>
        {valueArray.map((v, index) => {
          const vTrimmed = v.trim();
          const dictItem = dictData.find((item: DictDataDTO) => 
            item.dictValue === vTrimmed
          );
          
          if (!dictItem) {
            return (
              <React.Fragment key={index}>
                {index > 0 && separator}{defaultText || vTrimmed}
              </React.Fragment>
            );
          }
          
          // 确定标签颜色
          let backgroundColor = '';
          let textColor = '';
          
          // 优先使用传入的颜色映射
          if (colorMap && colorMap[dictItem.dictValue]) {
            backgroundColor = colorMap[dictItem.dictValue];
          } 
          // 其次使用字典项自带的颜色属性
          else if (useColor && dictItem.color) {
            backgroundColor = dictItem.color;
          } 
          // 默认颜色根据字典值自动生成
          else {
            // 简单的哈希函数生成颜色
            const hash = Array.from(dictItem.dictValue).reduce((acc, char) => {
              return acc + char.charCodeAt(0);
            }, 0);
            
            // 生成浅色背景
            const hue = hash % 360;
            backgroundColor = `hsl(${hue}, 70%, 90%)`;
            textColor = `hsl(${hue}, 80%, 30%)`;
          }
          
          return (
            <React.Fragment key={index}>
              {index > 0 && separator}
              <span
                className={`inline-block px-2 py-1 text-xs rounded-md ${showBorder ? 'border' : ''}`}
                style={{
                  backgroundColor,
                  color: textColor || (backgroundColor ? '#333' : 'inherit'),
                  borderColor: textColor || backgroundColor || 'currentColor'
                }}
              >
                {dictItem.dictLabel}
              </span>
            </React.Fragment>
          );
        })}
      </span>
    );
  }
  
  // 处理单值情况
  const dictItem = dictData.find((item: DictDataDTO) => 
    item.dictValue === String(value)
  );
  
  // 如果没有找到对应的字典项
  if (!dictItem) {
    return <span className={className}>{defaultText || String(value)}</span>;
  }
  
  // 确定标签颜色
  let backgroundColor = '';
  let textColor = '';
  
  // 优先使用传入的颜色映射
  if (colorMap && colorMap[dictItem.dictValue]) {
    backgroundColor = colorMap[dictItem.dictValue];
  } 
  // 其次使用字典项自带的颜色属性
  else if (useColor && dictItem.color) {
    backgroundColor = dictItem.color;
  } 
  // 默认颜色根据字典值自动生成
  else {
    // 简单的哈希函数生成颜色
    const hash = Array.from(dictItem.dictValue).reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // 生成浅色背景
    const hue = hash % 360;
    backgroundColor = `hsl(${hue}, 70%, 90%)`;
    textColor = `hsl(${hue}, 80%, 30%)`;
  }
  
  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-md ${showBorder ? 'border' : ''} ${className}`}
      style={{
        backgroundColor,
        color: textColor || (backgroundColor ? '#333' : 'inherit'),
        borderColor: textColor || backgroundColor || 'currentColor'
      }}
    >
      {dictItem.dictLabel}
    </span>
  );
};

export default DictTag; 