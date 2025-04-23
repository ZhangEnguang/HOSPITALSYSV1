'use client';

import React, { useEffect, useState } from 'react';
import { useDictStore } from '@/stores/dictStore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DictRadioGroupProps {
  dictCode: string; // 字典编码
  value?: string | number | undefined; // 选中值
  onChange?: (value: string | undefined, option?: any) => void; // 变更回调
  className?: string; // 自定义类名
}

/**
 * 字典单选按钮组组件
 */
const DictRadioGroup: React.FC<DictRadioGroupProps> = ({
  dictCode,
  value,
  onChange,
  className = '',
}) => {
  const { fetch, dictionaries, loading } = useDictStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);
  
  const handleChange = (value: string) => {
    if (onChange) {
      const dictData = dictionaries[dictCode]?.data.find(item => item.dictValue === value);
      onChange(value, dictData);
    }
  };
  
  const dictData = dictionaries[dictCode]?.data || [];
  const isLoading = loading[dictCode];
  
  if (!mounted) {
    return null;
  }
  
  return (
    <RadioGroup
      value={value?.toString()}
      onValueChange={handleChange}
      disabled={isLoading}
      className={`flex flex-wrap gap-4 ${className}`}
    >
      {dictData.map(item => (
        <div key={item.dictValue} className="flex items-center space-x-2">
          <RadioGroupItem value={item.dictValue} id={item.dictValue} />
          <Label htmlFor={item.dictValue}>{item.dictLabel}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default DictRadioGroup; 