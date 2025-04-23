import { post, get } from '../api';

// 登录请求参数类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 用户角色类型
export interface Role {
  id: number | string;
  roleName: string;
  name?: string; // 添加name字段作为roleName的兼容字段
  code: string;
  description?: string;
}

// 用户信息类型
export interface User {
  id: number; // 用户ID
  username: string; // 用户名
  name: string; // 用户姓名
  avatar?: string; // 头像
  email?: string; // 邮箱
  phone?: string; // 手机号
  department?: string; // 部门
  position?: string; // 职位  
  roles: Role[]; // 角色列表
  currentRole?: Role; // 当前角色
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: User;
}

// 统一API返回结构
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 登录API
export async function login(data: LoginRequest): Promise<ApiResult<LoginResponse>> {
  try {
    // 使用any类型接收响应，以处理各种可能的响应格式
    const response = await post<any>('/login', data);
    
    // 处理可能的响应格式：
    // 1. 直接返回有效的LoginResponse: {token, user}
    // 2. 返回包装的响应: {code, message, data} 其中data是LoginResponse
    
    let loginData = response;
    
    // 检查是否是包装的响应格式
    if (response && typeof response === 'object' && 'code' in response) {
      // 如果是 {code, message, data} 格式，提取data
      if (response.code === 200 && response.data) {
        loginData = response.data;
      } else {
        // 服务器返回非200状态码，返回错误信息
        return {
          success: false,
          message: response.message || '登录失败，请检查用户名和密码'
        };
      }
    }
    
    // 验证登录数据格式
    if (!loginData || !loginData.token || !loginData.user) {
      return {
        success: false,
        message: '登录响应格式不正确，请联系管理员'
      };
    }
    
    // 处理角色信息，确保字段名称一致
    if (loginData.user) {
      const userData = loginData.user;
      
      // 处理用户名称
      if (!userData.name && userData.studentName) {
        userData.name = userData.studentName;
      } else if (!userData.name) {
        userData.name = userData.username;
      }
      
      // 处理角色列表
      if (userData.roles && Array.isArray(userData.roles)) {
        userData.roles = userData.roles.map((role: any) => ({
          id: role.id,
          roleName: role.roleName || role.name || '', // 添加roleName字段
          name: role.roleName || role.name || '', // 兼容两种字段名
          code: role.roleCode || role.code || '',
          description: role.description || ''
        }));
      } 
      // 从roleIds和roleNames构建角色列表
      else if (userData.roleIds && userData.roleNames && 
               Array.isArray(userData.roleIds) && Array.isArray(userData.roleNames)) {
        userData.roles = userData.roleIds.map((roleId: string | number, index: number) => ({
          id: roleId,
          roleName: userData.roleNames[index] || `角色${roleId}`, // 添加roleName字段
          name: userData.roleNames[index] || `角色${roleId}`,
          code: `ROLE_${roleId}`
        }));
      }
      
      // 处理当前角色
      if (userData.currentRole) {
        userData.currentRole = {
          id: userData.currentRole.id,
          roleName: userData.currentRole.roleName || userData.currentRole.name || '', // 添加roleName字段
          name: userData.currentRole.roleName || userData.currentRole.name || '', // 兼容两种字段名
          code: userData.currentRole.roleCode || userData.currentRole.code || '',
          description: userData.currentRole.description || ''
        };
      }
      // 如果没有当前角色但有角色列表，则默认使用第一个角色
      else if (userData.roles && userData.roles.length > 0) {
        userData.currentRole = userData.roles[0];
        console.log('登录用户未设置当前角色，自动设置为第一个角色:', userData.currentRole);
      }
    }
    
    // 保存认证信息
    saveAuthInfo(loginData.token, loginData.user);
    
    // 返回成功结果
    return {
      success: true,
      data: loginData
    };
  } catch (error) {
    // 记录详细错误信息
    console.error('登录处理失败:', error);
    
    // 返回友好的错误信息
    return {
      success: false,
      message: error instanceof Error 
        ? error.message 
        : '登录过程中发生未知错误，请稍后再试'
    };
  }
}

// 获取当前登录用户信息
export async function getCurrentUser(): Promise<User> {

  try {
    // 强制清除浏览器缓存，确保使用最新token
    const timestamp = new Date().getTime();
    const url = `/login/current-user?_t=${timestamp}`;
    
    // 尝试从localStorage中获取最新token和用户信息
    const latestToken = localStorage.getItem('auth-storage') ? 
      JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token : null;
    
    // 获取本地缓存的用户信息，在API请求失败时可以使用
    const cachedUserData = localStorage.getItem('user_info');
    let cachedUser: User | null = null;
    if (cachedUserData) {
      try {
        cachedUser = JSON.parse(cachedUserData);
        console.log('从本地缓存获取到用户数据', cachedUser?.name || '未知');
      } catch (e) {
        console.error('解析本地缓存的用户信息失败', e);
      }
    }
    
    if (latestToken) {
      console.log('使用最新token获取用户信息');
    }
    
    // 发起API请求获取最新用户信息
    const response = await get(url);
    console.log('获取当前用户信息返回原始数据：', JSON.stringify(response, null, 2));
    
    // 处理可能的响应包装
    let data = response;
    if (response && response.code !== undefined && response.data) {
      data = response.data;
      console.log('从响应中提取data字段:', data);
    }
    
    // 处理后端返回的SecurityUserInfo格式转换为前端User格式
    const user: User = {
      id: data.userId || data.id || 0,
      username: data.username || '',
      name: data.studentName || data.username || '', // 使用学生姓名或用户名
      email: data.email || '',
      phone: data.phone || '',
      department: data.unitName || '',
      position: '',
      roles: data.groups || [],
    };

    // 处理角色信息 - 注意字段名
    if (data.currentRole) {
      user.currentRole = {
        id: data.currentRole.id,
        roleName: data.currentRole.roleName || data.currentRole.name || '', // 兼容两种字段名
        name: data.currentRole.roleName || data.currentRole.name || '',
        code: data.currentRole.roleCode || data.currentRole.code || '',
        description: data.currentRole.description || ''
      };
      console.log('当前角色信息:', user.currentRole);
    }
    
    // 处理角色列表
    if (data.roles && Array.isArray(data.roles)) {
      console.log('后端返回角色列表:', data.roles);
      user.roles = data.roles.map((role: any) => ({
        id: role.id,
        roleName: role.roleName || role.name || '', // 将name字段映射为roleName
        name: role.roleName || role.name || '',     // 保留name字段，兼容两种写法
        code: role.roleCode || role.code || '',
        description: role.description || ''
      }));
    } 
    // 如果只有roleIds/roleNames数组
    else if (data.roleIds && data.roleNames && Array.isArray(data.roleIds) && Array.isArray(data.roleNames)) {
      console.log('从roleIds和roleNames构建角色列表:', {roleIds: data.roleIds, roleNames: data.roleNames});
        user.roles = data.roleIds.map((roleId: string | number, index: number) => ({
        id: roleId,
        roleName: data.roleNames[index] || `角色${roleId}`,
        name: data.roleNames[index] || `角色${roleId}`,
        code: `ROLE_${roleId}`
      }));
    }
    
    // 如果没有currentRole但有角色列表，设置第一个为当前角色
    if (!user.currentRole && user.roles && user.roles.length > 0) {
      user.currentRole = user.roles[0];
      console.log('未设置当前角色，自动设置为第一个角色:', user.currentRole);
    }
    
    console.log('转换后的用户信息:', {
      id: user.id,
      name: user.name,
      currentRole: user.currentRole,
      rolesCount: user.roles.length,
      roles: user.roles
    });
    
    // 保存到缓存中
    localStorage.setItem('user_info', JSON.stringify(user));
    console.log('已将最新用户信息保存到本地缓存');
    
    return user;
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    
    // 尝试从本地缓存获取用户信息
    try {
      const cachedUserData = localStorage.getItem('user_info');
      if (cachedUserData) {
        const cachedUser = JSON.parse(cachedUserData) as User;
        console.log('API请求失败，使用缓存的用户信息:', cachedUser.name);
        return cachedUser;
      }
    } catch (cacheError) {
      console.error('解析缓存用户信息失败:', cacheError);
    }
    
    // 如果没有缓存，返回基本用户对象
    return {
      id: 0,
      username: '未登录',
      name: '未登录用户',
      roles: [],
    } as User;
  }
}

// 切换用户角色
export async function switchRole(roleId: number | string): Promise<LoginResponse> {
  try {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    const response = await post(`/login/switch-role/${roleId}?_t=${timestamp}`);
    console.log('角色切换返回原始数据：', response);
    
    // 处理后端可能的数据包装格式
    let result = response;
    
    // 处理可能的 {code, data, message} 格式
    if (response && response.code !== undefined && response.data) {
      result = response.data;
      console.log('从响应中提取data字段:', result);
    }
    
    // 处理后端返回的数据转换
    if (result && result.user) {
      const userData = result.user;
      
      // 转换角色信息
      if (userData.roles && Array.isArray(userData.roles)) {
        userData.roles = userData.roles.map((role: any) => ({
          id: role.id,
          roleName: role.roleName || role.name || '', // 使用roleName字段
          name: role.roleName || role.name || '',     // 同时保留name字段以兼容
          code: role.roleCode || role.code || '',
          description: role.description || ''
        }));
      }
      
      // 处理当前角色
      if (userData.currentRole) {
        userData.currentRole = {
          id: userData.currentRole.id,
          roleName: userData.currentRole.roleName || userData.currentRole.name || '', // 兼容两种字段
          name: userData.currentRole.roleName || userData.currentRole.name || '',     // 同时保留name字段以兼容
          code: userData.currentRole.roleCode || userData.currentRole.code || '',
          description: userData.currentRole.description || ''
        };
      }
      
      // 如果没有设置当前角色，尝试从角色列表中找到对应角色
      if (!userData.currentRole && userData.roles && Array.isArray(userData.roles)) {
        // 确保roleId可以与角色ID进行比较（将两边都转换为字符串）
        const targetRoleId = String(roleId);
        const targetRole = userData.roles.find((role: Role) => String(role.id) === targetRoleId);
        if (targetRole) {
          userData.currentRole = targetRole;
          console.log('已自动设置当前角色为:', targetRole);
        }
      }
      
      // 如果是原始User格式，添加name字段
      if (userData.studentName && !userData.name) {
        userData.name = userData.studentName || userData.username;
      }
    }
    
    // 保存最新的认证信息到localStorage
    if (result && result.token && result.user) {
      saveAuthInfo(result.token, result.user);
      console.log('角色切换后已保存最新认证信息');
    }
    
    return result;
  } catch (error) {
    console.error('切换角色失败:', error);
    throw error;
  }
}

// 退出登录
export async function logout(): Promise<void> {
  try {
    await post('/login/logout');
    // 无论服务端是否成功，都清除本地存储
    clearAuthInfo();
  } catch (error) {
    console.error('退出登录API调用失败:', error);
    // 即使API调用失败，也清除本地存储
    clearAuthInfo();
  }
}

// 保存用户认证信息到本地存储
export function saveAuthInfo(token: string, user: User): void {
  // 添加调试日志
  console.log('保存认证信息到本地存储:', { token: token?.substring(0, 10) + '...', user });
  
  try {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_info', JSON.stringify(user));
    
    // 验证存储是否成功
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_info');
    
    console.log('验证存储:', { 
      tokenSaved: !!savedToken, 
      userSaved: !!savedUser, 
      userParsed: savedUser ? JSON.parse(savedUser) : null 
    });
  } catch (error) {
    console.error('保存认证信息失败:', error);
  }
}

// 从本地存储获取用户信息
export function getUserInfo(): User | null {
  try {
    const userInfo = localStorage.getItem('user_info');
    if (!userInfo) return null;
    
    const user = JSON.parse(userInfo) as User;
    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 从本地存储获取认证token
export function getToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('获取token失败:', error);
    return null;
  }
}

// 清除认证信息
export function clearAuthInfo(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
}

// 检查用户是否已登录
export function isAuthenticated(): boolean {
  const token = getToken();
  console.log('检查认证状态:', { hasToken: !!token });
  return !!token;
} 