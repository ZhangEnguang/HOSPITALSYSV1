import type { ApiResponse } from '@/lib/api';
import { DictDTO, DictDataDTO } from '../types/dict';
import { get } from '@/lib/api';

/**
 * 字典服务，封装与后端字典API的交互
 */
export const dictService = {
  /**
   * 获取字典数据列表
   * @param dictCode 字典编码
   */
  getDictDataByCode: async (dictCode: string): Promise<DictDataDTO[]> => {
    try {
      console.log(`[dictService] 开始请求字典数据: ${dictCode}`);
      const response = await get<ApiResponse<DictDataDTO[]> | DictDataDTO[]>(`/api/dict/data/list/${dictCode}`);
      console.log(`[dictService] 字典数据请求成功: ${dictCode}`, {
        responseData: response,
        dataType: typeof response,
        isResponseArray: Array.isArray(response)
      });
      
      // 判断响应类型，处理直接返回数组的情况
      let dictData: DictDataDTO[] = [];
      if (Array.isArray(response)) {
        // API直接返回了数组
        dictData = response;
        console.log(`[dictService] API直接返回数组数据，长度: ${dictData.length}`);
      } else {
        // API返回了ApiResponse对象
        dictData = response.data || [];
        console.log(`[dictService] API返回ApiResponse对象，data长度: ${dictData.length}`);
      }
      
      // 记录最终处理的数据
      console.log(`[dictService] 最终处理后的字典数据:`, {
        dictCode,
        dataLength: dictData.length,
        firstFewItems: dictData.slice(0, 3)
      });
      
      return dictData;
    } catch (error) {
      console.error(`[dictService] 获取字典数据异常: ${dictCode}`, error);
      return [];
    }
  },

  /**
   * 获取自指定时间戳后更新的字典数据
   * @param timestamp 时间戳
   */
  getDictChanges: async (timestamp?: number): Promise<Record<string, DictDataDTO[]>> => {
    try {
      const response = await get<ApiResponse<Record<string, DictDataDTO[]>>>('/api/dict/changes', {
        params: timestamp ? { timestamp } : {}
      });
      return response.data || {};
    } catch (error) {
      console.error('获取字典变更失败:', error);
      return {};
    }
  },

  /**
   * 根据字典编码和字典值获取字典标签
   * @param dictCode 字典编码
   * @param dictValue 字典值
   */
  getDictLabel: async (dictCode: string, dictValue: string): Promise<string> => {
    try {
      const response = await get<ApiResponse<string>>('/api/dict/label', {
        params: { dictCode, dictValue }
      });
      return response.data || '';
    } catch (error) {
      console.error('获取字典标签失败:', error);
      return '';
    }
  },

  /**
   * 获取所有字典类型列表
   */
  getAllDictTypes: async (): Promise<string[]> => {
    try {
      const response = await get<string[] | ApiResponse<string[]>>('/api/dict/types');
      
      // 判断响应类型，处理直接返回数组的情况
      if (Array.isArray(response)) {
        return response;
      }
      
      if (!response || !response.data) {
        console.error('获取字典类型失败：响应数据为空');
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('获取字典类型失败:', error);
      return [];
    }
  },

  /**
   * 批量获取字典数据
   * @param dictTypes 字典类型数组
   */
  getBatchDictData: async (dictTypes: string[]): Promise<Record<string, DictDataDTO[]>> => {
    try {
      // 使用批量接口一次性获取所有字典数据
      const response = await get<Record<string, DictDataDTO[]>>('/api/dict/data/batch', {
        params: { types: dictTypes.join(',') }
      });
      
      // 确保返回的数据格式正确
      if (!response || typeof response !== 'object') {
        console.error('批量获取字典数据失败：响应数据格式不正确');
        return {};
      }
      
      return response;
    } catch (error) {
      console.error('批量获取字典数据失败:', error);
      return {};
    }
  }
}; 