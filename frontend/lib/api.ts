/**
 * API工具类，提供统一的API请求配置和方法
 */

// API基础URL配置
// 在生产环境中，可以通过环境变量来配置
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8700';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
}

/**
 * 处理API响应
 */
async function handleResponse<T>(response: Response, responseType?: string): Promise<T> {
  // 无论状态码如何，先尝试解析响应内容
  let responseData;
  try {
    if (responseType === 'blob') {
      responseData = await response.blob();
    } else if (responseType === 'arrayBuffer') {
      responseData = await response.arrayBuffer();
    } else if (responseType === 'text') {
      responseData = await response.text();
    } else {
      // 默认处理JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log(`API响应(${response.url}):`, responseData);
      } else {
        responseData = await response.text();
        console.log(`API文本响应(${response.url}):`, responseData.substring(0, 100) + '...');
      }
    }
  } catch (e) {
    console.error(`解析响应失败(${response.url}):`, e);
    throw new Error(`解析响应失败: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 检查是否为自定义错误格式: {code: number, message: string, data: any}
  if (typeof responseData === 'object' && responseData !== null && 'code' in responseData) {
    // 后端自定义响应格式处理
    const { code, message, data } = responseData as {code: number, message: string, data: any};
    
    // 直接返回整个响应对象，让上层处理提取data
    return responseData as T;
  }

  // 如果不是自定义格式，则按照HTTP状态码处理
  if (!response.ok) {
    // 处理HTTP错误状态码
    console.error('HTTP错误:', { url: response.url, status: response.status, statusText: response.statusText, data: responseData });
    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
      const error = new Error(responseData.message || `请求失败，状态码: ${response.status}`);
      (error as any).status = response.status;
      (error as any).responseData = responseData;
      throw error;
    } else {
      const error = new Error(`请求失败，状态码: ${response.status}`);
      (error as any).status = response.status;
      (error as any).responseData = responseData;
      throw error;
    }
  }

  // 返回解析后的数据
  return responseData as T;
}

/**
 * 基础请求函数
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, responseType, ...fetchOptions } = options;
  
  // 构建URL，处理查询参数
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  // 默认请求头
  const headers = new Headers(fetchOptions.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
  }
  
  // 获取存储的认证token
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  if (token && !headers.has('Authorization')) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  // 发送请求
  const response = await fetch(url, {
    ...fetchOptions,
    headers
  });
  
  return handleResponse<T>(response, responseType);
}

/**
 * HTTP GET请求
 */
export function get<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'GET'
  });
}

/**
 * HTTP POST请求
 */
export function post<T = any>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });
}

// 定义通用的分页结果类型
export interface PageResult<T> {
  records?: T[];   // 或 records
  total: number;
  pageNum: number;
  pageSize: number;
  pages?: number; // 可选的总页数
}


export function filterSearchPost<T = any>(
  url: string,//后台请求地址
  pageNum: number,//当前页码
  pageSize: number,//每页条数
  searchTerm: string,//搜索关键字
  searchTermParams: string,//搜索字段
  filterValues:Record<string, any>,//高级筛选条件
  seniorFilterValues:Record<string, any>,//高级筛选条件
): Promise<ApiResponse<PageResult<T>>> { // 返回具体的类型
    const params: Record<string, any> = {
        pageNum: pageNum,
        pageSize: pageSize,
        searchTerm: searchTerm || undefined, // Send name for searching
        searchTermParams: searchTermParams,
      };
    // 动态添加 filterValues 的键值对到 params
    for (const key in filterValues) {
      if (filterValues[key] !== 'all') { // 跳过 'all' 的情况
        params[key] = filterValues[key];
      }
    }
  
    let response = post<ApiResponse<PageResult<any>>>(url, {
      ...params,
      seniorFilterValues: seniorFilterValues
    });
    // 直接调用 post 函数，传递 URL、请求体和选项
    return response;
}

/**
 * HTTP PUT请求
 */
export function put<T = any>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });
}

/**
 * HTTP DELETE请求
 */
export function del<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'DELETE'
  });
}

/**
 * 表单提交请求（支持文件上传）
 * 专门用于处理同时包含文件和JSON数据的表单提交
 * 
 * @param endpoint API端点
 * @param formData FormData对象，包含文件和其他表单数据
 * @param jsonData 需要作为JSON字符串添加到formData中的数据对象
 * @param jsonFieldName 指定JSON数据在formData中的字段名
 * @param options 请求选项
 * @returns 
 */
export function submitForm<T = any>(
  endpoint: string,
  formData?: FormData,
  jsonData?: Record<string, any>,
  jsonFieldName: string = 'jsonData',
  options: FetchOptions = {}
): Promise<T> {

  // 如果没有提供FormData，创建一个新的
  const form = formData || new FormData();
  
  // 如果提供了jsonData，将其添加到FormData中
  if (jsonData) {
    form.append(jsonFieldName, JSON.stringify(jsonData));
  }
  
  // 确保不手动设置Content-Type，让浏览器自动处理
  return fetchApi<T>(endpoint, {
    ...options,
    method: 'POST',
    body: form
  });
}

/**
 * 带文件的PUT请求（用于更新资源）
 */
export function updateWithFile<T = any>(
  endpoint: string,
  formData?: FormData,
  jsonData?: Record<string, any>,
  jsonFieldName: string = 'jsonData',
  options: FetchOptions = {}
): Promise<T> {
  // 如果没有提供FormData，创建一个新的
  const form = formData || new FormData();
  
  // 如果提供了jsonData，将其添加到FormData中
  if (jsonData) {
    form.append(jsonFieldName, JSON.stringify(jsonData));
  }
  
  // 构造请求选项
  const requestOptions = {
    ...options,
    method: 'POST', // 改为POST请求
    body: form,
    headers: {
      // 不要设置Content-Type，让浏览器自动处理
      ...options.headers,
    }
  };
  
  // 添加_method=PUT参数，指示后端这是一个PUT请求
  return fetchApi<T>(`${endpoint}?_method=PUT`, requestOptions);
}

/**
 * 档案归档编辑专用函数
 * 专门处理档案归档的PUT请求，符合后端ArchiveFilingController的要求
 * 
 * @param id 档案归档ID
 * @param formData FormData对象，用于上传文件
 * @param archiveFilingData 档案归档数据
 * @param options 请求选项
 * @returns 请求响应
 */
export function updateArchiveFiling<T = any>(
  id: string | number,
  formData?: FormData,
  archiveFilingData?: Record<string, any>,
  options: FetchOptions = {}
): Promise<T> {
  // 如果没有提供FormData，创建一个新的
  const form = formData || new FormData();
  
  // 如果提供了档案归档数据，将其添加到FormData中
  if (archiveFilingData) {
    form.append('archiveFiling', JSON.stringify(archiveFilingData));
  }
  
  // 使用已封装的fetchApi函数
  return fetchApi<T>(`/api/archive/filing/${id}`, {
    ...options,
    method: 'PUT',
    body: form,
    // 确保不设置Content-Type，让浏览器自动处理multipart/form-data
    headers: {
      ...options.headers
    }
  });
}

// API状态类型
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

/**
 * 获取文件URL
 * @param endpoint 文件API端点
 * @param params 请求参数
 */
export function getFileUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  return url;
}

export function triggerFileDownload(endpoint: string, params?: Record<string, any>, fileName?: string): void {
  // 确保下载参数存在
  const downloadParams = { ...(params || {}), download: 1 };
  const url = getFileUrl(endpoint, downloadParams);
  
  const link = document.createElement('a');
  link.href = url;
  if (fileName) {
    link.setAttribute('download', fileName);
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 处理流式响应的函数类型
 */
export type StreamHandler<T> = {
  onMessage?: (data: T) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  onOpen?: (response: Response) => void;
};

/**
 * HTTP 流式请求
 * 支持 SSE(Server-Sent Events) 和其他流式响应
 * @param endpoint API端点
 * @param data 请求数据
 * @param handler 流处理器
 * @param options 请求选项
 */
export async function streamRequest<T = any>(
  endpoint: string,
  data?: any,
  handler?: StreamHandler<T>,
  options: FetchOptions = {}
): Promise<void> {
  const { params, ...fetchOptions } = options;
  
  // 构建URL，处理查询参数
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  // 默认请求头
  const headers = new Headers(fetchOptions.headers || {});
  
  // 不设置Content-Type为application/json，因为可能需要其他格式
  if (data && !(data instanceof FormData) && !headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  
  // 设置接受流式响应
  if (!headers.has('Accept')) {
    headers.append('Accept', 'text/event-stream');
  }
  
  // 获取存储的认证token
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  if (token && !headers.has('Authorization')) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method: fetchOptions.method || 'POST',
      headers,
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `请求失败: ${response.status}`);
    }
    
    if (handler?.onOpen) {
      handler.onOpen(response);
    }
    
    // 处理SSE流
    if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('无法获取响应流');
      }
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (handler?.onComplete) {
            handler.onComplete();
          }
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        
        // 处理接收到的消息
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() && !line.startsWith(':')) {
            try {
              const message = line.replace(/^data: /, '');
              if (message === '[DONE]') {
                if (handler?.onComplete) {
                  handler.onComplete();
                }
                return;
              }
              
              if (handler?.onMessage) {
                const parsedData = JSON.parse(message) as T;
                handler.onMessage(parsedData);
              }
            } catch (error) {
              if (handler?.onError) {
                handler.onError(error instanceof Error ? error : new Error(String(error)));
              }
            }
          }
        }
      }
    } 
    // 处理普通流响应
    else if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (handler?.onComplete) {
            handler.onComplete();
          }
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        
        if (handler?.onMessage) {
          try {
            // 尝试解析JSON，如果失败则传递原始文本
            try {
              const parsedData = JSON.parse(chunk) as T;
              handler.onMessage(parsedData);
            } catch {
              handler.onMessage(chunk as unknown as T);
            }
          } catch (error) {
            if (handler?.onError) {
              handler.onError(error instanceof Error ? error : new Error(String(error)));
            }
          }
        }
      }
    }
  } catch (error) {
    if (handler?.onError) {
      handler.onError(error instanceof Error ? error : new Error(String(error)));
    } else {
      throw error;
    }
  }
}

/**
 * 获取二进制文件流
 * @param endpoint API端点
 * @param data 请求数据
 * @param options 请求选项
 * @returns 二进制Blob对象
 */
export async function getBinaryStream(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<Blob> {
  const { params, ...fetchOptions } = options;
  
  // 构建URL，处理查询参数
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  // 默认请求头
  const headers = new Headers(fetchOptions.headers || {});
  
  if (data && !(data instanceof FormData) && !headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  
  // 获取存储的认证token
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  if (token && !headers.has('Authorization')) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, {
    ...fetchOptions,
    method: fetchOptions.method || 'POST',
    headers,
    body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `请求失败: ${response.status}`);
  }
  
  return await response.blob();
}

/**
 * 附件下载函数
 * @param attachmentId 附件ID或文件名
 * @param fileName 下载后的文件名，可选
 * @param options 其他请求选项，可选
 * @returns Promise，下载成功时解析为true，否则为false
 */
export async function downloadAttachment(
  attachmentId: string,
  fileName?: string,
  options: FetchOptions = {}
): Promise<boolean> {
  try {
    // 使用getBinaryStream获取附件的二进制数据
    // 确保使用GET方法并携带认证信息
    
    const fileBlob = await getBinaryStream(
      `/api/todos/attachment/download`, 
      null, 
      {
        ...options,
        method: 'GET', // 明确指定使用GET方法
        params: {
          ...(options.params || {}),
          fileName: attachmentId
        }
      }
    );
    
    // 创建下载链接
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // 如果提供了文件名，使用提供的文件名，否则使用默认文件名
    link.download = fileName || `附件_${attachmentId}`;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理资源
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('附件下载失败', error);
    return false;
  }
} 