import React from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  
  // 重定向到主登录页面
  React.useEffect(() => {
    router.push('/login');
  }, [router]);
  
  // 返回一个简单的加载组件
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">重定向到登录页面...</h1>
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 