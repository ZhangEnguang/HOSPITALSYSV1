"use client"

import { useState, useRef, useCallback, useEffect, ReactNode } from "react"
import { Loader2, User2, Info, Tag } from "lucide-react"
import { Input } from "./input"
import DictText from "@/components/dict/DictText"

// 定义通用的项目接口
export interface SearchSelectItem {
  id: string | number;
  [key: string]: any;
}

// 添加字段配置接口
export interface FieldConfig {
  field: string;       // 数据字段名
  label: string;       // 显示的标签名
  icon?: ReactNode;    // 字段图标，可以为每个字段单独配置
  isDict?: boolean;    // 是否是字典字段
  dictCode?: string;   // 字典编码
  renderValue?: (value: any) => ReactNode; // 自定义值渲染函数
}

// 定义组件Props
export interface SearchSelectProps<T extends SearchSelectItem> {
  // 显示的值
  placeholder?: string;
  value?: string;
  displayValue?: string;
  // 搜索和选择相关回调
  onChange: (value: string, item?: T) => void;
  onSearch: (keyword: string, page: number, pageSize: number) => Promise<{
    list: T[];
    total: number;
  }>;
  // 配置选项
  labelField?: string;
  descriptionField?: string;        // 保留用于向后兼容
  descriptionLabel?: string;        // 保留用于向后兼容
  displayFields?: (string | FieldConfig)[];  // 支持字符串或字段配置对象
  pageSize?: number;
  allowEmptySearch?: boolean; // 是否允许空值查询
  forceSearchSelect?: boolean; // 是否强制从检索结果中选择
  // 自定义渲染
  renderItem?: (item: T, onSelect: (item: T) => void) => ReactNode;
  // 图标自定义
  labelIcon?: ReactNode;           // 主标签图标
  fieldIcon?: ReactNode;           // 字段图标
  // 状态
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export function SearchSelect<T extends SearchSelectItem>({
  placeholder = "请输入搜索关键词",
  value = "",
  displayValue = "",
  onChange,
  onSearch,
  labelField = "name",
  descriptionField = "code",
  descriptionLabel,
  displayFields = [],
  pageSize = 5,
  allowEmptySearch = false, // 默认不允许空值查询
  forceSearchSelect = true, // 默认强制从检索结果中选择
  renderItem,
  labelIcon,
  fieldIcon,
  disabled = false,
  error = false,
  errorMessage,
}: SearchSelectProps<T>) {
  // 搜索相关状态
  const [searchValue, setSearchValue] = useState<string>(displayValue || "");
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [localError, setLocalError] = useState<boolean>(error);
  const [localErrorMessage, setLocalErrorMessage] = useState<string>(errorMessage || "");
  const [localDisplayValue, setLocalDisplayValue] = useState<string>(displayValue || "");
  
  // 滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 重置搜索状态
  const resetSearch = useCallback(() => {
    // 不再清空搜索值
    // setSearchValue("");
    setResults([]);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  // 搜索处理函数
  const handleSearch = useCallback(async (keyword: string) => {
    setCurrentPage(1); // 重置页码
    setHasMore(true); // 重置是否有更多数据
    setResults([]); // 清空现有结果

    if (!keyword.trim() && !allowEmptySearch) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await onSearch(keyword, 1, pageSize);
      if (keyword === searchValue) { // 确保仍在搜索相同关键词
        setResults(response.list);
        setHasMore(response.list.length < response.total);
      }
    } catch (error) {
      console.error("搜索失败:", error);
      if (keyword === searchValue) {
        setResults([]);
        setHasMore(false);
      }
    } finally {
      if (keyword === searchValue) {
        setIsSearching(false);
      }
    }
  }, [onSearch, pageSize, searchValue, allowEmptySearch]);

  // 加载更多结果
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || (!searchValue.trim() && !allowEmptySearch)) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await onSearch(searchValue, nextPage, pageSize);
      setResults(prevResults => [...prevResults, ...response.list]);
      setCurrentPage(nextPage);
      setHasMore(response.list.length > 0 && results.length + response.list.length < response.total);
    } catch (error) {
      console.error("加载更多失败:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, onSearch, pageSize, results.length, searchValue, allowEmptySearch]);

  // 选择项处理函数
  const handleSelect = useCallback((item: T) => {
    onChange(String(item.id), item);
    setInputFocused(false);
    // 不再清空搜索值，而是设置为选中项的主属性值
    const itemValue = item[labelField] as string;
    setSearchValue(itemValue);
    setLocalDisplayValue(itemValue); // 更新本地displayValue
    // 选择有效项后清除错误状态
    setLocalError(false);
    setLocalErrorMessage("");
  }, [onChange, labelField]);

  // 使用Effect处理搜索 - 添加防抖
  useEffect(() => {
    if (inputFocused) {
      const timer = setTimeout(() => {
        handleSearch(searchValue);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchValue, handleSearch, inputFocused]);

  // 滚动加载逻辑
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 滚动到底部附近时加载更多
      if (container.scrollHeight - container.scrollTop <= container.clientHeight + 50) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // 处理输入框聚焦
  const handleInputFocus = () => {
    setInputFocused(true);
    // 如果允许空值搜索或者有搜索值，且结果为空，触发搜索
    if ((allowEmptySearch || searchValue.trim()) && results.length === 0) {
      handleSearch(searchValue);
    }
  };

  // 处理输入框失去焦点
  const handleInputBlur = () => {
    // 延迟关闭下拉框，以便用户有时间点击选项
    setTimeout(() => {
      setInputFocused(false);
      
      // 检查是否强制从搜索结果中选择
      if (forceSearchSelect && searchValue) {
        // 检查当前输入值是否在结果中
        const isValueInResults = results.some(item => item[labelField] === searchValue);
        
        // 如果不在结果中，清空值并显示错误
        if (!isValueInResults) {
          // 无论是否有displayValue都清空值
          setSearchValue("");
          setLocalDisplayValue(""); // 清空本地displayValue
          onChange("", undefined);
          setLocalError(true);
          setLocalErrorMessage("请从搜索结果中选择值");
        } else {
          setLocalError(false);
          setLocalErrorMessage("");
        }
      }
    }, 200);
  };

  // 当displayValue变化时更新searchValue和localDisplayValue
  useEffect(() => {
    if (displayValue && displayValue !== searchValue) {
      setSearchValue(displayValue);
      setLocalDisplayValue(displayValue);
    }
  }, [displayValue]);
  
  // 组件挂载时和value变化时，如果允许空值搜索则自动触发一次搜索
  useEffect(() => {
    if (allowEmptySearch && inputFocused && results.length === 0) {
      handleSearch("");
    }
  }, [allowEmptySearch, handleSearch, inputFocused, results.length]);

  // 当外部error或errorMessage变化时更新本地状态
  useEffect(() => {
    setLocalError(error);
    setLocalErrorMessage(errorMessage || "");
  }, [error, errorMessage]);

  // 默认渲染项目
  const defaultRenderItem = (item: T, onSelect: (item: T) => void) => {
    // 构建显示字段数组，合并descriptionField和displayFields
    const mergedDisplayFields = [...displayFields];
    
    // 如果设置了descriptionField且不在displayFields中，添加到显示字段
    if (descriptionField && item[descriptionField]) {
      // 检查是否已经在displayFields中配置了相同的field
      const hasDescriptionField = mergedDisplayFields.some(
        field => typeof field === 'string' 
          ? field === descriptionField 
          : field.field === descriptionField
      );
      
      // 如果没有找到，添加到mergedDisplayFields
      if (!hasDescriptionField) {
        mergedDisplayFields.unshift({
          field: descriptionField,
          label: descriptionLabel || descriptionField
        });
      }
    }
    
    // 使用默认图标或传入的自定义图标
    const LabelIconComponent = labelIcon || <User2 className="h-4 w-4 text-blue-600" />;
    const DefaultFieldIcon = fieldIcon || <Info className="h-3.5 w-3.5 text-gray-400" />;
    
    return (
      <div
        key={item.id}
        className="group p-3 text-sm rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-blue-100 mb-1"
        onClick={() => onSelect(item)}
      >
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2">
            {LabelIconComponent}
            <div className="font-medium text-blue-600 group-hover:text-blue-700">
              {item[labelField]}
            </div>
          </div>
        </div>
        {mergedDisplayFields.length > 0 && (
          <>
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {mergedDisplayFields.map(fieldConfig => {
                // 获取字段名和标签名
                const field = typeof fieldConfig === 'string' ? fieldConfig : fieldConfig.field;
                const label = typeof fieldConfig === 'string' ? field : fieldConfig.label;
                
                // 获取字段图标 - 优先使用字段自己的图标，然后是全局图标，最后是默认图标
                const FieldIconComponent = typeof fieldConfig === 'string' 
                  ? DefaultFieldIcon 
                  : (fieldConfig.icon || DefaultFieldIcon);
                
                // 检查字段是否是字典类型
                const isDict = typeof fieldConfig !== 'string' && fieldConfig.isDict;
                const dictCode = typeof fieldConfig !== 'string' ? fieldConfig.dictCode : undefined;
                
                // 自定义渲染函数
                const renderValue = typeof fieldConfig !== 'string' ? fieldConfig.renderValue : undefined;
                
                // 不过滤descriptionField，只过滤labelField和id
                return item[field] && field !== labelField && field !== 'id' ? (
                  <div key={field} className="flex items-center">
                    <div className="w-24 flex items-center gap-1">
                      {FieldIconComponent}
                      <span className="text-gray-500">{label}：</span>
                    </div>
                    <span className="text-gray-700">
                      {isDict && dictCode ? (
                        <DictText dictCode={dictCode} value={item[field]} defaultText={String(item[field])} />
                      ) : renderValue ? (
                        renderValue(item[field])
                      ) : (
                        item[field]
                      )}
                    </span>
                  </div>
                ) : null;
              })}
              
              {mergedDisplayFields.length === 0 && (
                // 自动选择最多3个字段显示
                Object.keys(item).filter(key => 
                  key !== labelField && 
                  key !== 'id' && 
                  item[key]
                ).slice(0, 3).map(key => (
                  <div key={key} className="flex items-center">
                    <div className="w-24 flex items-center gap-1">
                      {DefaultFieldIcon}
                      <span className="text-gray-500">{key}：</span>
                    </div>
                    <span className="text-gray-700">{item[key]}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <Input
        value={searchValue}
        placeholder={!searchValue && localDisplayValue ? localDisplayValue : placeholder}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={disabled}
        className={localError ? "border-red-500" : ""}
      />
      
      {isSearching && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
      
      {inputFocused && results.length > 0 && (
        <div 
          ref={scrollContainerRef} 
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto p-1"
        >
          {results.map((item) => (
            renderItem 
              ? renderItem(item, handleSelect)
              : defaultRenderItem(item, handleSelect)
          ))}
          
          {isLoadingMore && (
            <div className="flex justify-center items-center p-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> 加载中...
            </div>
          )}
          
          {!hasMore && results.length > 0 && (
            <div className="text-center text-sm text-gray-500 p-2">没有更多结果了</div>
          )}
        </div>
      )}
      
      {localError && localErrorMessage && (
        <p className="text-red-500 text-xs mt-1">{localErrorMessage}</p>
      )}
      
      {/* 隐藏的输入框，用于保存实际值 */}
      <input 
        type="hidden" 
        value={value || ""}
      />
    </div>
  );
} 