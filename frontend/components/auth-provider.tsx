'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, refreshUserInfo } = useAuthStore();
  const pathname = usePathname() || '/';
  const router = useRouter();
  // 添加状态变量来跟踪认证检查是否完成
  const [authChecked, setAuthChecked] = useState(false);
  
  // 首次加载时检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      console.log('检查认证状态开始，当前认证状态:', isAuthenticated);

      try {
        // 先根据localStorage检查是否有token和用户信息
        if (isAuthenticated) {
          console.log('发现本地认证信息，尝试刷新用户信息');
          await refreshUserInfo();
        }
      } catch (error) {
        console.error('认证检查过程出错:', error);
      } finally {
        // 无论认证成功或失败，标记认证检查已完成
        console.log('认证检查完成');
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // 当认证状态检查完成后，再处理路由重定向
  useEffect(() => {
    // 只有在认证检查完成后才执行路由逻辑
    if (!authChecked) {
      console.log('认证检查尚未完成，暂不执行路由逻辑');
      return;
    }

    console.log('执行路由逻辑，当前认证状态:', isAuthenticated, '当前路径:', pathname);
    
    // 如果用户未登录且当前路径不是公开路径，重定向到登录页面
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    if (!isAuthenticated && !isPublicPath) {
      console.log('未认证，非公开路径，重定向到登录页面');
      // 保存当前URL，以便登录后可以返回
      sessionStorage.setItem('redirectUrl', pathname);
      router.push('/login');
      return;
    }
    
    // 如果用户已登录并且当前路径是登录页，重定向到工作台
    if (isAuthenticated && pathname === '/login') {
      console.log('已认证，当前是登录页，重定向到应用页面');
      // 检查是否有保存的重定向URL
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        router.push(redirectUrl);
      } else {
        router.push('/workbench');
      }
    }
  }, [isAuthenticated, pathname, router, authChecked]);

  return <>{children}</>;
} 