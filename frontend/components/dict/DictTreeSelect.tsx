'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDictStore } from '@/stores/dictStore';
import { 
  ChevronRight, ChevronDown, X, Search, 
  Folder, File, Check, Circle, Plus, Minus, 
  FolderOpen, FolderClosed, Layers, Package,
  BookOpen, Book, Database, Server,
  Building2, Users, User, Tag,
  List, ListTree, Library, Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DictDataDTO } from '@/types/dict';

interface DictTreeData {
  id: string;
  label: string;
  value: string;
  children?: DictTreeData[];
  parentValue?: string;
}

interface DictTreeSelectProps {
  dictCode: string; // 字典编码
  value?: string | number | undefined; // 选中值
  onChange?: (value: string | undefined, option?: any) => void; // 变更回调
  placeholder?: string; // 占位文本
  allowClear?: boolean; // 是否允许清空
  loading?: boolean; // 自定义加载状态
  className?: string; // 自定义类名
  size?: 'default' | 'sm' | 'lg'; // 组件大小
  disabled?: boolean; // 是否禁用
  defaultExpanded?: boolean; // 是否默认展开
}

/**
 * 字典树形选择组件
 */
const DictTreeSelect: React.FC<DictTreeSelectProps> = ({
  dictCode,
  value,
  onChange,
  placeholder = '请选择',
  allowClear = true,
  loading: propLoading,
  className = '',
  size = 'default',
  disabled = false,
  defaultExpanded = false,
}) => {
  const { fetch, dictionaries, loading } = useDictStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    setMounted(true);
    if (!dictionaries[dictCode]) {
      fetch(dictCode);
    }
  }, [dictCode, fetch, dictionaries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取完整的节点路径
  const getNodePath = (nodeId: string | number | undefined): string[] => {
    if (!nodeId) return [];
    
    const path: string[] = [];
    let current = dictData.find(item => item.dictValue === String(nodeId));
    
    while (current) {
      path.unshift(current.dictLabel);
      const parent = current.parentValue ? dictData.find(item => item.dictValue === current.parentValue) : undefined;
      if (!parent) break;
      current = parent;
    }
    
    return path;
  };

  const handleExpand = (nodeId: string) => {
    setExpandedKeys(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // 将字典数据转换为树形结构
  const treeData = useMemo(() => {
    const dictData = dictionaries[dictCode]?.data || [];
    const map: Record<string, DictTreeData> = {};
    const result: DictTreeData[] = [];

    dictData.forEach(item => {
      map[item.dictValue] = {
        id: item.dictValue,
        label: item.dictLabel,
        value: item.dictValue,
        parentValue: item.parentValue,
      };
    });

    dictData.forEach(item => {
      const node = map[item.dictValue];
      if (item.parentValue) {
        const parent = map[item.parentValue];
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        }
      } else {
        result.push(node);
      }
    });

    return result;
  }, [dictionaries, dictCode]);

  // 过滤树节点
  const filteredTreeData = useMemo(() => {
    if (!searchValue) return treeData;

    const filterNode = (node: DictTreeData): DictTreeData | null => {
      if (node.label.toLowerCase().includes(searchValue.toLowerCase())) {
        return { ...node };
      }

      if (node.children) {
        const filteredChildren = node.children
          .map(child => filterNode(child))
          .filter((child): child is DictTreeData => child !== null);

        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
      }

      return null;
    };

    return treeData
      .map(node => filterNode(node))
      .filter((node): node is DictTreeData => node !== null);
  }, [treeData, searchValue]);
  
  const handleChange = (value: string | undefined) => {
    if (disabled) return;
    
    if (onChange) {
      const dictData = value ? dictionaries[dictCode]?.data.find(item => item.dictValue === value) : undefined;
      // 如果值是空字符串，转换为 undefined
      const finalValue = value === '' ? undefined : value;
      onChange(finalValue, dictData);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    handleChange(undefined);
  };
  
  const dictData = dictionaries[dictCode]?.data || [];
  const isLoading = propLoading !== undefined ? propLoading : loading[dictCode];
  
  // 确保 value 是字符串类型，并且处理空字符串的情况
  const stringValue = value !== undefined && value !== null && value !== '' ? String(value) : undefined;
  
  // 查找选中的项
  const selectedItem = stringValue ? dictData.find(item => item.dictValue === stringValue) : undefined;

  if (!mounted) {
    return null;
  }

  const getNodeIcon = (node: DictTreeData, isExpanded: boolean, level: number) => {
    // 根据节点深度返回不同的图标
    switch (level) {
      case 0:
        return <Library className="h-4 w-4 text-blue-500" />;
      case 1:
        return <BookOpen className="h-4 w-4 text-cyan-500" />;
      case 2:
        return <BookOpen className="h-4 w-4 text-purple-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-amber-500" />;
    }
  };

  // 渲染树节点
  const renderTreeNode = (node: DictTreeData, level: number = 0) => {
    const isExpanded = expandedKeys.includes(node.id);
    const isSelected = value === node.value;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative group">
        <div 
          className={cn(
            "flex items-center gap-2 cursor-pointer rounded-lg py-2 px-3 transition-all duration-200",
            "hover:bg-blue-50 hover:text-blue-700",
            isSelected && "bg-blue-100 text-blue-700 font-medium",
            level > 0 && "ml-6",
            disabled && "opacity-50 cursor-not-allowed",
            "text-sm"
          )}
          onClick={() => !disabled && handleChange(node.value)}
        >
          <div className="relative flex items-center">
            {level > 0 && (
              <>
                <span className="absolute h-px w-4 bg-blue-200 left-[-1rem] top-1/2 transform -translate-y-1/2" />
                <span className="absolute h-4 w-px bg-blue-200 left-[-1rem] top-0" />
                <span className="absolute h-4 w-px bg-blue-200 left-[-1rem] bottom-0" />
              </>
            )}
            <div className="flex items-center gap-1">
              {hasChildren ? (
                <div 
                  className={cn(
                    "w-4 h-4 flex items-center justify-center rounded-md",
                    "hover:bg-blue-100 transition-colors duration-100",
                    isExpanded && "bg-blue-100"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    !disabled && handleExpand(node.id);
                  }}
                >
                  {isExpanded ? (
                    <Minus className="h-2.5 w-2.5 text-blue-500" />
                  ) : (
                    <Plus className="h-2.5 w-2.5 text-blue-500" />
                  )}
                </div>
              ) : (
                <div className="w-4 h-4" />
              )}
              <div className="w-4 h-4 flex items-center justify-center">
                {getNodeIcon(node, isExpanded, level)}
              </div>
            </div>
          </div>
          <span className="flex-1 truncate text-sm">{node.label}</span>
          {isSelected && (
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-blue-500" />
            </div>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className={cn(
            "relative ml-6 transition-all duration-200",
            {"before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-blue-200": level >= 0}
          )}>
            {node.children?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={cn(
          "flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all duration-200",
          "hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200",
          isOpen && "border-blue-500 ring-1 ring-blue-200",
          size === 'sm' && 'text-sm',
          size === 'lg' && 'text-lg',
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0">
          {selectedItem ? (
            <div className="flex items-center gap-2">
              <span className="truncate text-sm">{selectedItem.dictLabel}</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {allowClear && !disabled && selectedItem && (
            <X 
              className={cn(
                "h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-100",
                "hover:bg-gray-100 rounded-full p-0.5"
              )}
              onClick={handleClear}
            />
          )}
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg",
          "max-h-60 overflow-hidden flex flex-col"
        )}>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索..."
                className="pl-9 border focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="overflow-auto p-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {filteredTreeData.map(node => renderTreeNode(node))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DictTreeSelect; 