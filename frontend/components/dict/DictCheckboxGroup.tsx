import React, { useEffect } from 'react';
import { useDictStore } from '@/stores/dictStore';
import { DictDataDTO } from '@/types/dict';

interface DictCheckboxGroupProps {
  dictCode: string; // 字典编码
  value?: string[] | string; // 选中值数组或逗号分隔字符串或单个字符串
  onChange?: (value: string[]) => void; // 变更回调
  disabled?: boolean; // 是否禁用
  className?: string; // 自定义类名
  itemClassName?: string; // 单个选项自定义类名
}

/**
 * 字典多选框组组件
 */
const DictCheckboxGroup: React.FC<DictCheckboxGroupProps> = ({
  dictCode,
  value = [],
  onChange,
  disabled = false,
  className = '',
  itemClassName = ''
}) => {
  const { fetch, dictionaries, loading } = useDictStore();
  
  // 处理不同类型的value输入
  const processValue = (inputValue?: string[] | string): string[] => {
    if (!inputValue) return [];
    if (Array.isArray(inputValue)) return inputValue;
    if (typeof inputValue === 'string' && inputValue.includes(',')) {
      return inputValue.split(',').filter(v => v.trim());
    }
    return inputValue ? [inputValue] : []; // 单个字符串转为数组
  };
  
  // 处理后的选中值
  const checkedValues = processValue(value);
  
  // 加载字典数据
  useEffect(() => {
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);
  
  // 处理选择变更
  const handleChange = (dictValue: string, checked: boolean) => {
    if (!onChange) return;
    
    let newValue = [...checkedValues];
    if (checked) {
      // 添加值
      if (!newValue.includes(dictValue)) {
        newValue.push(dictValue);
      }
    } else {
      // 移除值
      newValue = newValue.filter(v => v !== dictValue);
    }
    
    onChange(newValue);
  };
  
  // 字典数据
  const dictData = dictionaries[dictCode]?.data || [];
  const isLoading = loading[dictCode];
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {dictData.map((item: DictDataDTO) => (
        <label 
          key={item.dictValue} 
          className={`group flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded ${
            disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''
          } ${
            checkedValues.includes(item.dictValue) 
              ? 'bg-white text-slate-900 border border-slate-200' 
              : 'hover:bg-slate-50'
          } ${itemClassName}`}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={checkedValues.includes(item.dictValue)}
              onChange={(e) => handleChange(item.dictValue, e.target.checked)}
              disabled={disabled || isLoading}
              className="sr-only peer"
            />
            <div className={`w-4 h-4 border rounded-sm transition-all duration-200 flex items-center justify-center ${
              checkedValues.includes(item.dictValue)
                ? 'border-slate-700'
                : 'border-slate-300'
            }`}>
              <div className={`w-2 h-2 bg-slate-700 transition-all duration-200 ${
                checkedValues.includes(item.dictValue) ? 'opacity-100' : 'opacity-0'
              }`} />
            </div>
          </div>
          <span className={`text-sm transition-colors duration-200 ${
            checkedValues.includes(item.dictValue) 
              ? 'text-slate-900 font-medium' 
              : 'text-slate-600 group-hover:text-slate-900'
          }`}>
            {item.dictLabel}
          </span>
        </label>
      ))}
      {dictData.length === 0 && isLoading && (
        <div className="text-gray-400">加载中...</div>
      )}
      {dictData.length === 0 && !isLoading && (
        <div className="text-gray-400">暂无选项</div>
      )}
    </div>
  );
};

export default DictCheckboxGroup; 