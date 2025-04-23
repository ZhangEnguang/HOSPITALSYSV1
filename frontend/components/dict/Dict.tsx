'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useDictStore } from '@/stores/dictStore';
import DictSelect from './DictSelect';
import DictText from './DictText';
import DictTag from './DictTag';
import DictCheckboxGroup from './DictCheckboxGroup';
import DictTreeSelect from './DictTreeSelect';
import DictRadioGroup from './DictRadioGroup';
import { Skeleton } from '@/components/ui/skeleton';

export type DictDisplayType = 
  | 'select'      // 下拉选择框
  | 'text'        // 纯文本
  | 'tag'         // 带样式的文本
  | 'checkbox'    // 复选框组
  | 'tree'        // 树形选择
  | 'radio';      // 单选按钮组

export interface DictBaseProps {
  dictCode: string;           // 字典编码
  displayType: DictDisplayType; // 展示类型
  value?: string | number | string[] | undefined; // 选中值
  field?: string;             // 字段名称，配合setFormData使用
  setFormData?: React.Dispatch<React.SetStateAction<any>>; // 表单状态更新函数
  placeholder?: string;       // 占位文本
  allowClear?: boolean;       // 是否允许清空
  loading?: boolean;          // 自定义加载状态
  className?: string;         // 自定义类名
  size?: 'default' | 'sm' | 'lg'; // 组件大小
  disabled?: boolean;         // 是否禁用
}

export interface DictSelectProps extends DictBaseProps {
  displayType: 'select';
  value?: string | number | undefined;
  onChange?: (value: string | undefined, option?: any) => void;
}

export interface DictTextProps extends DictBaseProps {
  displayType: 'text';
  value?: string | number;
}

export interface DictTagProps extends DictBaseProps {
  displayType: 'tag';
  value?: string | number;
}

export interface DictCheckboxProps extends DictBaseProps {
  displayType: 'checkbox';
  value?: string[] | string;
  onChange?: (value: string[], options?: any[]) => void;
}

export interface DictTreeProps extends DictBaseProps {
  displayType: 'tree';
  value?: string | number | undefined;
  onChange?: (value: string | undefined, option?: any) => void;
}

export interface DictRadioProps extends DictBaseProps {
  displayType: 'radio';
  value?: string | number | undefined;
  onChange?: (value: string | undefined, option?: any) => void;
}

export type DictProps = 
  | DictSelectProps 
  | DictTextProps 
  | DictTagProps 
  | DictCheckboxProps 
  | DictTreeProps 
  | DictRadioProps;

/**
 * 统一的字典组件
 * 
 * @example
 * ```tsx
 * // 下拉选择框
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="select"
 *   value={value}
 *   onChange={handleChange}
 * />
 * 
 * // 纯文本
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="text"
 *   value={value}
 * />
 * 
 * // 带样式的文本
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="tag"
 *   value={value}
 * />
 * 
 * // 复选框组
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="checkbox"
 *   value={values}
 *   onChange={handleChange}
 * />
 * 
 * // 树形选择
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="tree"
 *   value={value}
 *   onChange={handleChange}
 * />
 * 
 * // 单选按钮组
 * <Dict 
 *   dictCode="sys_yes_no"
 *   displayType="radio"
 *   value={value}
 *   onChange={handleChange}
 * />
 * ```
 */
const Dict: React.FC<DictProps> = ({
  dictCode,
  displayType = 'select',
  value,
  placeholder = '请选择',
  allowClear = true,
  loading: propLoading,
  className = '',
  size = 'default',
  disabled = false,
  field,
  setFormData,
}) => {
  const { fetch, dictionaries, loading } = useDictStore();
  const [mounted, setMounted] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  
  useEffect(() => {
    setMounted(true);
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // 根据属性生成 onChange 方法
  const generateOnChange = () => {
    // 使用直接的setFormData方式
    if (setFormData && field) {
      return (value: any) => {
        setSelectedValue(value); // 更新内部状态
        setFormData((prev: any) => ({
          ...prev,
          [field]: value
        }));
      };
    }
    
    return undefined;
  };
  
  const onChange = generateOnChange();

  if (!mounted) {
    return null;
  }

  const dictData = dictionaries[dictCode]?.data || [];
  const isLoading = propLoading !== undefined ? propLoading : loading[dictCode];

  // 加载状态骨架屏
  const LoadingSkeleton = () => {
    switch (displayType) {
      case 'select':
      case 'tree':
        return <Skeleton className="h-10 w-full" />;
      case 'text':
      case 'tag':
        return <Skeleton className="h-6 w-20" />;
      case 'checkbox':
      case 'radio':
        return <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>;
      default:
        return null;
    }
  };

  const commonProps = {
    dictCode,
    className,
    size,
    disabled: disabled || isLoading
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  switch (displayType) {
    case 'select':
      return (
        <DictSelect
          {...commonProps}
          value={selectedValue as string | number | undefined}
          onChange={onChange}
          placeholder={placeholder}
          allowClear={allowClear}
        />
      );
    case 'text':
      return (
        <DictText
          {...commonProps}
          value={selectedValue as string | number | string[]}
        />
      );
    case 'tag':
      return (
        <DictTag
          {...commonProps}
          value={selectedValue as string | number | string[]}
        />
      );
    case 'checkbox':
      return (
        <DictCheckboxGroup
          {...commonProps}
          value={selectedValue as string[] | string}
          onChange={onChange}
        />
      );
    case 'tree':
      return (
        <DictTreeSelect
          {...commonProps}
          value={selectedValue as string | number | undefined}
          onChange={onChange}
          placeholder={placeholder}
          allowClear={allowClear}
        />
      );
    case 'radio':
      return (
        <DictRadioGroup
          {...commonProps}
          value={selectedValue as string | number | undefined}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default Dict; 