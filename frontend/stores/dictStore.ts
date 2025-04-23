import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DictDataDTO, DictCacheItem } from '../types/dict';
import { dictService } from '../services/dictService';
import { DictItem } from '@/types/dict';

// 缓存时间配置（毫秒）
const CACHE_DURATION = {
  SHORT: 30 * 60 * 1000, // 30分钟
  MEDIUM: 2 * 60 * 60 * 1000, // 2小时
  LONG: 24 * 60 * 60 * 1000, // 1天
};

// 不同字典类型的缓存时间
const DICT_CACHE_POLICY: Record<string, number> = {
  'default': CACHE_DURATION.MEDIUM,
  // 根据业务需要配置特定字典的缓存时间
};

interface DictState {
  // 字典数据缓存
  dictionaries: Record<string, DictCacheItem>;
  // 加载状态
  loading: Record<string, boolean>;
  // 获取字典数据
  fetch: (dictType: string) => Promise<DictDataDTO[]>;
  // 批量获取字典数据
  fetchBatch: (dictTypes: string[]) => Promise<void>;
  // 增量更新字典数据
  fetchIncremental: () => Promise<void>;
  // 清除缓存
  clearCache: () => void;
  // 获取字典标签
  getDictLabel: (dictType: string, value: string | number) => string;
  // 检查缓存是否有效
  isCacheValid: (dictType: string) => boolean;
  dictCache: Record<string, {
    data: DictItem[];
    timestamp: number;
    expireTime: number; // 毫秒
  }>;
  fetchDict: (dictCode: string) => Promise<DictItem[]>;
  
  // 性能监控相关
  loadMetrics: {
    startTime: number;
    endTime: number;
    duration: number;
    successCount: number;
    errorCount: number;
    errors: Array<{
      dictType: string;
      error: string;
      timestamp: number;
    }>;
  };
  
  // 批量加载字典（带性能监控）
  loadAllDicts: () => Promise<void>;
  
  // 重置性能指标
  resetMetrics: () => void;
}

export const useDictStore = create<DictState>()(
  persist(
    (set, get) => ({
      dictionaries: {},
      loading: {},
      dictCache: {},

      // 检查缓存是否有效
      isCacheValid: (dictType: string): boolean => {
        const cache = get().dictionaries[dictType];
        if (!cache) return false;

        const now = Date.now();
        const cacheTime = DICT_CACHE_POLICY[dictType] || DICT_CACHE_POLICY.default;
        return now - cache.timestamp < cacheTime;
      },

      // 获取字典数据
      fetch: async (dictType: string): Promise<DictDataDTO[]> => {
        // 如果已经有缓存数据，直接返回
        const cachedData = get().dictionaries[dictType];
        if (cachedData) {
          return cachedData.data;
        }

        // 如果正在加载，等待加载完成
        if (get().loading[dictType]) {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              const data = get().dictionaries[dictType];
              if (data) {
                clearInterval(checkInterval);
                resolve(data.data);
              }
            }, 100);
          });
        }

        // 设置加载状态
        set(state => ({ loading: { ...state.loading, [dictType]: true } }));

        try {
          const data = await dictService.getDictDataByCode(dictType);
          set(state => ({
            dictionaries: {
              ...state.dictionaries,
              [dictType]: {
                data,
                timestamp: Date.now()
              }
            },
            loading: { ...state.loading, [dictType]: false }
          }));
          return data;
        } catch (error) {
          set(state => ({ loading: { ...state.loading, [dictType]: false } }));
          console.error(`获取字典[${dictType}]失败:`, error);
          return [];
        }
      },

      // 批量获取字典数据
      fetchBatch: async (dictTypes: string[]): Promise<void> => {
        // 过滤出需要加载的字典类型
        const typesToFetch = dictTypes.filter(type => !get().dictionaries[type]);

        if (typesToFetch.length === 0) return;

        // 设置加载状态
        set(state => {
          const newLoading = { ...state.loading };
          typesToFetch.forEach(type => {
            newLoading[type] = true;
          });
          return { loading: newLoading };
        });

        try {
          const result = await dictService.getBatchDictData(typesToFetch);
          set(state => ({
            dictionaries: {
              ...state.dictionaries,
              ...Object.entries(result).reduce((acc, [type, data]) => ({
                ...acc,
                [type]: {
                  data,
                  timestamp: Date.now()
                }
              }), {})
            },
            loading: { ...state.loading, ...Object.fromEntries(typesToFetch.map(type => [type, false])) }
          }));
        } catch (error) {
          set(state => {
            const newLoading = { ...state.loading };
            typesToFetch.forEach(type => {
              newLoading[type] = false;
            });
            return { loading: newLoading };
          });
          console.error('批量获取字典失败:', error);
        }
      },

      // 增量更新字典数据
      fetchIncremental: async (): Promise<void> => {
        // 获取最后一次同步时间
        const lastSync = typeof window !== 'undefined' ? localStorage.getItem('dict-last-sync') : null;
        const timestamp = lastSync ? parseInt(lastSync, 10) : undefined;

        try {
          const changes = await dictService.getDictChanges(timestamp);
          
          if (Object.keys(changes).length > 0) {
            // 更新状态
            set(state => {
              const newDictionaries = { ...state.dictionaries };
              
              Object.entries(changes).forEach(([type, data]) => {
                newDictionaries[type] = {
                  data,
                  timestamp: Date.now()
                };
              });
              
              // 更新同步时间
              if (typeof window !== 'undefined') {
                localStorage.setItem('dict-last-sync', Date.now().toString());
              }
              
              return {
                dictionaries: newDictionaries
              };
            });
          }
        } catch (error) {
          console.error('增量更新字典失败:', error);
        }
      },

      // 清除缓存
      clearCache: (): void => {
        set({ dictionaries: {} });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dict-last-sync');
        }
      },

      // 获取字典标签
      getDictLabel: (dictType: string, value: string | number): string => {
        const cache = get().dictionaries[dictType];
        if (!cache) return String(value);

        const dictItem = cache.data.find(item => 
          item.dictValue === String(value)
        );
        
        return dictItem ? dictItem.dictLabel : String(value);
      },

      fetchDict: async (dictCode: string): Promise<DictItem[]> => {
        const { dictCache } = get();
        const cached = dictCache[dictCode];
        
        // 检查缓存是否存在且未过期
        if (cached) {
          const expireTime = cached.expireTime;
          if (Date.now() - cached.timestamp < expireTime) {
            return cached.data;
          }
        }

        try {
          const data = await dictService.getDictDataByCode(dictCode);
          const dictItems = data as unknown as DictItem[];
          
          // 只有可缓存的字典才存入缓存
          if (dictItems[0]?.cacheable === 1) {
            const expireTime = (dictItems[0]?.cacheExpireTime || 24) * 60 * 60 * 1000; // 转换为毫秒
            set(state => ({
              ...state,
              dictCache: {
                ...state.dictCache,
                [dictCode]: {
                  data: dictItems,
                  timestamp: Date.now(),
                  expireTime
                }
              }
            }));
          }
          return dictItems;
        } catch (error) {
          console.error(`Failed to fetch dictionary ${dictCode}:`, error);
          return [];
        }
      },

      loadMetrics: {
        startTime: 0,
        endTime: 0,
        duration: 0,
        successCount: 0,
        errorCount: 0,
        errors: []
      },
      
      resetMetrics: () => set({
        loadMetrics: {
          startTime: 0,
          endTime: 0,
          duration: 0,
          successCount: 0,
          errorCount: 0,
          errors: []
        }
      }),
      
      loadAllDicts: async () => {
        const startTime = Date.now();
        
        // 重置性能指标
        set({ 
          loadMetrics: {
            startTime,
            endTime: 0,
            duration: 0,
            successCount: 0,
            errorCount: 0,
            errors: []
          }
        });
        
        try {
          // 清除现有缓存
          get().clearCache();
          
          // 获取所有字典类型列表
          const dictTypes = await dictService.getAllDictTypes();
          
          // 确保 dictTypes 是数组
          if (!Array.isArray(dictTypes)) {
            throw new Error('获取字典类型失败：返回的数据格式不正确');
          }
          
          // 如果没有字典类型，直接返回
          if (dictTypes.length === 0) {
            console.log('没有需要加载的字典类型');
            return;
          }
          
          // 异步加载字典数据，不等待结果
          dictService.getBatchDictData(dictTypes).then(dictData => {
            // 更新状态
            set(state => ({
              dictionaries: {
                ...state.dictionaries,
                ...Object.entries(dictData).reduce((acc, [type, data]) => ({
                  ...acc,
                  [type]: {
                    data,
                    timestamp: Date.now()
                  }
                }), {})
              },
              loadMetrics: {
                ...state.loadMetrics,
                successCount: Object.keys(dictData).length,
                endTime: Date.now(),
                duration: Date.now() - startTime
              }
            }));
            
            // 记录性能日志
            console.log('字典加载性能指标:', {
              totalDicts: dictTypes.length,
              successCount: Object.keys(dictData).length,
              errorCount: dictTypes.length - Object.keys(dictData).length,
              duration: Date.now() - startTime
            });
          }).catch(error => {
            console.error('字典加载失败:', error);
            set(state => ({
              loadMetrics: {
                ...state.loadMetrics,
                errorCount: dictTypes.length,
                errors: [...state.loadMetrics.errors, {
                  dictType: 'all',
                  error: error?.message || '未知错误',
                  timestamp: Date.now()
                }]
              }
            }));
          });
          
        } catch (error) {
          console.error('获取字典类型失败:', error);
          throw error;
        }
      }
    }),
    {
      name: 'dict-storage',
      partialize: (state) => ({
        dictionaries: state.dictionaries,
        dictCache: state.dictCache
      })
    }
  )
); 