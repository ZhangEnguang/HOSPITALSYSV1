'use client';

import React, { useEffect, useState } from 'react';
import { useDictStore } from '@/stores/dictStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DictSelectProps {
  dictCode: string; // 字典编码
  value?: string | number | undefined; // 选中值
  onChange?: (value: string | undefined, option?: any) => void; // 变更回调
  placeholder?: string; // 占位文本
  allowClear?: boolean; // 是否允许清空
  loading?: boolean; // 自定义加载状态
  className?: string; // 自定义类名
  disabled?: boolean; // 是否禁用
  size?: 'default' | 'sm' | 'lg'; // 组件大小
}

/**
 * 字典下拉选择框组件
 */
const DictSelect: React.FC<DictSelectProps> = ({
  dictCode,
  value,
  onChange,
  placeholder = '请选择',
  allowClear = true,
  loading: propLoading,
  className = '',
  disabled = false,
  size = 'default',
}) => {
  const { fetch, dictionaries, loading } = useDictStore();
  const [mounted, setMounted] = useState(false);
  
  // 在组件挂载时记录初始状态
  useEffect(() => {
    setMounted(true);
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);
  
  // 处理选择变更
  const handleChange = (value: string | undefined) => {
    if (value === '__CLEAR__') {
      onChange?.(undefined, undefined);
    } else {
      const dictData = value ? dictionaries[dictCode]?.data.find(item => item.dictValue === value) : undefined;
      onChange?.(value, dictData);
    }
  };
  
  // 字典数据
  const dictData = dictionaries[dictCode]?.data || [];
  const isLoading = propLoading !== undefined ? propLoading : loading[dictCode];
  
  // 只在客户端渲染
  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>
    );
  }
  
  return (
    <Select
      value={value?.toString()}
      onValueChange={handleChange}
      disabled={isLoading || disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowClear && (
          <SelectItem key="clear" value="__CLEAR__">{placeholder}</SelectItem>
        )}
        {dictData.map(item => (
          <SelectItem key={item.dictValue} value={item.dictValue}>
            {item.dictLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DictSelect; 