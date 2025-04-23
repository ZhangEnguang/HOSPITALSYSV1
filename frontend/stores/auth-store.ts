import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, LoginResponse, login, logout, switchRole, getCurrentUser, saveAuthInfo, ApiResult } from '@/lib/api/auth';

// 登录结果类型
export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  error?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // 动作
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  switchRole: (roleId: number) => Promise<void>;
  refreshUserInfo: () => Promise<User | null | undefined>;
  
  // 用户信息相关操作
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      // 登录
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await login({ username, password });
          
          if (!response.success || !response.data) {
            // 登录失败
            const errorMessage = response.message || '登录失败，请检查用户名和密码';
            set({ 
              isLoading: false, 
              error: errorMessage,
              isAuthenticated: false 
            });
            return { success: false, error: errorMessage };
          }
          
          // 登录成功
          const loginData = response.data;
          
          // 添加日志，查看登录返回的用户信息
          console.log('登录成功，用户信息：', JSON.stringify(loginData.user));
          set({
            user: loginData.user,
            token: loginData.token,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return { success: true, data: loginData };
        } catch (err) {
          // 格式化错误信息
          let errorMessage = '登录失败，请检查网络连接';
          
          if (err instanceof Error) {
            // 如果是用户名密码错误，使用更友好的提示
            if (err.message.includes('用户名或密码错误')) {
              errorMessage = '用户名或密码不正确，请重新输入';
            } else if (err.message.includes('登录响应格式不正确')) {
              errorMessage = '服务器响应异常，请联系管理员';
            } else {
              errorMessage = err.message;
            }
          }
          
          // 更新状态
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false 
          });
          
          // 返回错误信息而不是抛出异常
          return { success: false, error: errorMessage };
        }
      },
      
      // 退出登录
      logout: async () => {
        set({ isLoading: true });
        try {
          await logout();
          get().clearAuth();
        } catch (err) {
          console.error('退出登录失败', err);
          // 即使API请求失败，也要清除本地状态
          get().clearAuth();
        } finally {
          set({ isLoading: false });
        }
      },
      
      // 切换角色
      switchRole: async (roleId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await switchRole(roleId);
          
          if (!response || !response.user || !response.token) {
            set({ isLoading: false, error: '角色切换失败，返回数据格式不正确' });
            return;
          }
          
          // 确保response.user包含正确的currentRole
          const user = response.user;
          
          // 如果没有currentRole，但有角色ID，则从角色列表中查找
          if (!user.currentRole && user.roles && Array.isArray(user.roles)) {
            const targetRole = user.roles.find(role => String(role.id) === String(roleId));
            if (targetRole) {
              user.currentRole = targetRole;
              console.log('Store中设置当前角色:', targetRole);
            }
          }
          
          // 更新状态
          set({
            user: user,
            token: response.token,
            isLoading: false,
          });
          
          // 为调试目的记录日志
          console.log('角色切换后的用户状态:', user);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '切换角色失败';
          console.error('角色切换失败:', err);
          set({ isLoading: false, error: errorMessage });
          // 不再抛出错误
        }
      },
      
      // 刷新用户信息
      refreshUserInfo: async () => {
        if (!get().isAuthenticated) {
          console.log('未登录，不刷新用户信息');
          return undefined;
        }
        
        console.log('开始刷新用户信息，当前认证状态:', get().isAuthenticated);
        set({ isLoading: true, error: null });
        
        // 获取最新token
        const token = get().token;
        console.log('刷新用户信息，使用token:', token?.substring(0, 10) + '...');
        
        // 添加缓存控制 - 避免短时间内重复刷新
        const CACHE_KEY = 'user_info_last_refresh';
        const now = new Date().getTime();
        const lastRefresh = parseInt(localStorage.getItem(CACHE_KEY) || '0', 10);
        const CACHE_DURATION = 30 * 1000; // 30秒缓存
        
        // 如果30秒内已经刷新过，直接返回当前用户
        const currentUser = get().user;
        if (now - lastRefresh < CACHE_DURATION && currentUser && currentUser.id) {
          console.log('使用缓存的用户信息，距上次刷新:', (now - lastRefresh) / 1000, '秒');
          set({ isLoading: false });
          return currentUser;
        }
        
        // 设置请求超时
        const timeoutPromise = new Promise<undefined>((_, reject) => {
          setTimeout(() => reject(new Error('获取用户信息超时')), 8000);
        });
        
        try {
          // 强制清除API请求缓存，确保使用最新token
          localStorage.removeItem('user_info_cache');
          
          // 使用Promise.race实现超时控制
          const userPromise = getCurrentUser();
          const user = await Promise.race([userPromise, timeoutPromise]);
          
          // 更新最后刷新时间
          localStorage.setItem(CACHE_KEY, now.toString());
          
          console.log('刷新用户信息成功:', JSON.stringify(user));
          
          // 确保用户对象包含必要的字段
          if (!user || !user.id) {
            console.warn('获取到的用户信息不完整');
            set({ isLoading: false, error: '获取到的用户信息不完整' });
            return;
          }
          
          // 确保用户有角色设置
          if (user.roles && user.roles.length > 0 && !user.currentRole) {
            console.log('刷新用户信息 - 未设置当前角色，自动设置为第一个角色:', user.roles[0]);
            user.currentRole = user.roles[0];
          }
          
          set({ user, isLoading: false });
          
          // 保存到localStorage
          if (token) {
            saveAuthInfo(token, user);
          }
          
          return user;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '获取用户信息失败';
          console.error('刷新用户信息失败:', err);
          
          // 如果是超时错误，不清除认证状态
          if (err instanceof Error && err.message === '获取用户信息超时') {
            console.log('获取用户信息超时，维持当前认证状态');
            set({ isLoading: false, error: '网络请求超时，使用缓存信息' });
            return get().user; // 返回当前缓存的用户信息
          }
          
          set({ isLoading: false, error: errorMessage });
          
          // 如果获取用户信息失败，可能是token已过期，清除认证状态
          if (err instanceof Error && 
              (err.message.includes('401') || 
               err.message.includes('未登录') || 
               err.message.includes('认证失败'))) {
            console.log('认证过期，清除认证状态');
            get().clearAuth();
          }
          
          // 不再抛出错误
          return undefined;
        }
      },
      
      // 设置用户信息
      setUser: (user: User) => {
        set({ user });
      },
      
      // 设置token
      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },
      
      // 清除认证信息
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);