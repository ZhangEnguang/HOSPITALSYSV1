import React, { useEffect } from 'react';
import { useDictStore } from '@/stores/dictStore';

interface DictProviderProps {
  children: React.ReactNode;
  preloadDicts?: string[]; // 预加载的字典类型列表
  checkInterval?: number; // 检查字典更新的间隔时间（毫秒）
}

/**
 * 字典数据提供者组件
 * 用于在应用启动时预加载常用字典数据，并定期检查字典更新
 */
const DictProvider: React.FC<DictProviderProps> = ({
  children,
  preloadDicts = [],
  checkInterval = 30 * 60 * 1000 // 默认30分钟
}) => {
  const { fetchBatch, fetchIncremental } = useDictStore();

  useEffect(() => {
    // 初始化时预加载字典数据
    const initDictionaries = async () => {
      // 检查缓存版本
      const cacheVersion = typeof window !== 'undefined' ? localStorage.getItem('dict-cache-version') : null;
      const currentVersion = '1.0'; // 从配置或构建信息获取

      // 如果缓存版本不匹配，清除缓存
      if (cacheVersion !== currentVersion) {
        useDictStore.getState().clearCache();
        if (typeof window !== 'undefined') {
          localStorage.setItem('dict-cache-version', currentVersion);
        }
      }

      // 尝试增量更新
      await fetchIncremental();

      // 预加载字典
      if (preloadDicts.length > 0) {
        await fetchBatch(preloadDicts);
      }
    };

    initDictionaries();

    // 设置定期检查字典更新
    const intervalId = setInterval(() => {
      fetchIncremental();
    }, checkInterval);

    // 添加网络状态监听 - 仅在浏览器环境
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        fetchIncremental();
      };

      window.addEventListener('online', handleOnline);

      // 清理函数
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('online', handleOnline);
      };
    } else {
      // 服务端渲染环境下，只需清理定时器
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [fetchBatch, fetchIncremental, preloadDicts, checkInterval]);

  return <>{children}</>;
};

export default DictProvider; 