'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";
import { useDictStore } from '@/stores/dictStore';

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// 错误提示动画变体
const errorVariants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.9,
    transition: { 
      duration: 0.2,
      ease: "easeOut" 
    }
  }
};

// 浮动提示动画变体
const floatingNotificationVariants = {
  hidden: { 
    opacity: 0, 
    y: -50, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    }
  },
  exit: { 
    opacity: 0, 
    y: -30,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
};

// 登录失败震动动画
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

// 背景线条动画
const BackgroundLines = () => {
  const [lines, setLines] = useState<Array<{
    id: string;
    type: 'horizontal' | 'vertical';
    position: string;
    opacity: number;
    delay: number;
  }>>([]);
  
  // 仅在客户端生成线条，避免hydration不匹配
  useEffect(() => {
    // 生成水平线
    const horizontalLines = Array.from({ length: 15 }, (_, i) => ({
      id: `h-${i}`,
      type: 'horizontal' as const,
      position: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.3 + 0.1,
      delay: Math.random() * 2
    }));
    
    // 生成垂直线
    const verticalLines = Array.from({ length: 10 }, (_, i) => ({
      id: `v-${i}`,
      type: 'vertical' as const,
      position: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.2 + 0.1,
      delay: Math.random() * 2
    }));
    
    setLines([...horizontalLines, ...verticalLines]);
  }, []);

  if (lines.length === 0) return null;
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className={
            line.type === 'horizontal'
              ? "absolute bg-gradient-to-r from-transparent via-blue-500/10 to-transparent h-[1px]"
              : "absolute bg-gradient-to-b from-transparent via-purple-500/10 to-transparent w-[1px]"
          }
          style={{
            top: line.type === 'horizontal' ? line.position : 0,
            left: line.type === 'vertical' ? line.position : 0,
            width: line.type === 'horizontal' ? '100%' : undefined,
            height: line.type === 'vertical' ? '100%' : undefined,
            opacity: line.opacity,
          }}
          initial={
            line.type === 'horizontal'
              ? { x: '-100%' }
              : { y: '-100%' }
          }
          animate={
            line.type === 'horizontal'
              ? { x: ['100%', '-100%'] }
              : { y: ['100%', '-100%'] }
          }
          transition={{
            duration: Math.random() * 20 + 40,
            repeat: Infinity,
            ease: "linear",
            delay: line.delay
          }}
        />
      ))}
    </div>
  );
};

// 科技感背景装饰
const TechBackground = () => {
  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* 左侧大圆形 */}
      <motion.div 
        className="absolute -left-40 top-1/4 w-80 h-80 rounded-full bg-blue-900/10 backdrop-blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* 右侧大圆形 */}
      <motion.div 
        className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-purple-900/10 backdrop-blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      />
      
      {/* 左上角装饰 */}
      <svg className="absolute left-4 top-4 w-20 h-20 text-blue-500/10" viewBox="0 0 100 100">
        <motion.circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="35" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
      
      {/* 右下角装饰 */}
      <svg className="absolute right-4 bottom-4 w-24 h-24 text-purple-500/10" viewBox="0 0 100 100">
        <motion.path 
          d="M10,10 L90,10 L90,90 L10,90 L10,10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path 
          d="M30,30 L70,30 L70,70 L30,70 L30,30" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        />
      </svg>
    </motion.div>
  );
};

// 浮动通知组件
const FloatingNotification = ({ 
  message, 
  type = 'error', 
  isVisible, 
  onClose 
}: { 
  message: string, 
  type: 'success' | 'error' | 'warning', 
  isVisible: boolean,
  onClose: () => void
}) => {
  const notificationDuration = type === 'success' ? 1500 : 2500; // 成功提示1.5秒，错误提示2.5秒
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible) {
      // 自动关闭定时器
      timer = setTimeout(() => {
        onClose();
      }, notificationDuration);
    }
    
    // 清理函数，确保组件卸载或isVisible改变时清除之前的计时器
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, onClose, type, notificationDuration]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-400" />;
      case 'error':
      default:
        return <XCircle className="h-6 w-6 text-red-400" />;
    }
  };
  
  const getContainerClass = () => {
    switch (type) {
      case 'success':
        return "bg-green-950/90 border-green-500/40 text-green-100";
      case 'warning':
        return "bg-amber-950/90 border-amber-500/40 text-amber-100";
      case 'error':
      default:
        return "bg-red-950/90 border-red-500/40 text-red-100";
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-6 inset-x-0 mx-auto z-50 max-w-md w-[90%]"
          variants={floatingNotificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={`flex items-center p-4 rounded-xl shadow-xl backdrop-blur-md border ${getContainerClass()}`}>
            <div className="mr-3 flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">
                {type === 'success' ? '登录成功' : type === 'warning' ? '警告' : '登录失败'}
              </h3>
              <p className="text-sm opacity-90 mt-1">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors flex-shrink-0"
              aria-label="关闭提示"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [shakeForm, setShakeForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  }>({
    message: '',
    type: 'error',
    isVisible: false
  });
  
  const attemptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const router = useRouter();
  const { login, user, isAuthenticated, error, refreshUserInfo } = useAuthStore();
  const { showLoading, hideLoading, showToast, showError } = toast;
  const { loadAllDicts, loadMetrics } = useDictStore.getState();

  // 清除登录错误提示
  const clearLoginError = () => {
    setLoginError(null);
  };

  // 触发表单震动效果
  const triggerShakeEffect = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 600);
  };
  
  // 显示通知
  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };
  
  // 隐藏通知
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  useEffect(() => {
    // 加载动画延迟
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // 如果用户已经登录，重定向到工作台
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/workbench');
    }
  }, [isAuthenticated, user, router]);

  // 检查是否有记住的用户名和密码
  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // 监听输入变化，清除错误提示
  useEffect(() => {
    if (loginError) {
      clearLoginError();
    }
  }, [username, password, loginError]);

  // 处理登录尝试次数
  useEffect(() => {
    return () => {
      // 组件卸载时清除定时器
      if (attemptTimerRef.current) {
        clearTimeout(attemptTimerRef.current);
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清除之前的错误和通知
    clearLoginError();
    hideNotification();
    
    // 验证表单
    if (!username || !password) {
      setLoginError("请输入用户名和密码");
      showNotification("请输入用户名和密码", "error");
      triggerShakeEffect();
      return;
    }
    
    // 登录尝试次数限制
    if (loginAttempts >= 5) {
      const errorMsg = "登录失败次数过多，请稍后再试";
      setLoginError(errorMsg);
      showNotification(errorMsg, "warning");
      triggerShakeEffect();
      // 30秒后重置尝试次数
      attemptTimerRef.current = setTimeout(() => {
        setLoginAttempts(0);
        clearLoginError();
      }, 30000);
      return;
    }
    
    // 开始登录操作
    setIsLoggingIn(true);
    
    try {
      // 执行登录
      let result: any;
      
      if (username === 'test') {
        // 对于test用户，直接模拟登录成功，无需发送请求
        console.log('使用测试账号登录，无需验证');
        // 模拟登录操作延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 伪造登录成功结果 - 使用类型断言避免类型错误
        const testUser = {
          id: 9999,
          username: 'test',
          name: '测试用户',
          roles: ['admin']
        } as any; // 使用 any 类型断言
        
        // 执行自定义登录成功处理
        // 1. 手动设置本地存储
        localStorage.setItem('user', JSON.stringify(testUser));
        localStorage.setItem('token', 'fake-jwt-token-for-test-user');
        
        // 2. 通过 useAuthStore 更新状态
        useAuthStore.setState({
          user: testUser,
          token: 'fake-jwt-token-for-test-user',
          isAuthenticated: true,
          error: null,
          isLoading: false
        });
        
        result = {
          success: true,
          user: testUser
        };
      } else {
        // 正常登录流程
        result = await login(username, password);
      }
      
      // 登录是否成功
      if (result && result.success) {
        // 登录成功，重置尝试次数
        setLoginAttempts(0);
        
        // 如果选择了记住密码，保存用户名
        if (rememberMe) {
          localStorage.setItem('remembered_username', username);
        } else {
          localStorage.removeItem('remembered_username');
        }
        
        // 确保用户信息和角色信息已加载
        try {
          // 不使用解构的refreshUserInfo，而是通过钩子直接调用
          const updatedUser = await useAuthStore.getState().refreshUserInfo();
          console.log('登录后已刷新用户信息', updatedUser);
          
          // 特别检查角色信息是否加载
          if (updatedUser && (!updatedUser.currentRole || !updatedUser.currentRole.roleName)) {
            console.log('检测到角色信息不完整，再次刷新');
            await useAuthStore.getState().refreshUserInfo();
          }
          
          // 显示成功通知，使用更新后的用户信息
          showNotification(`登录成功，欢迎回来${updatedUser?.name ? '，' + updatedUser.name : ''}！`, "success");
        } catch (e) {
          console.error('登录后刷新用户信息失败', e);
          // 使用可能不完整的用户信息显示通知
          showNotification(`登录成功，欢迎回来${user?.name ? '，' + user.name : ''}！`, "success");
        }
        
        // 延迟跳转，给用户一个视觉反馈
        setTimeout(() => {
          router.push('/workbench');
        }, 1500); // 缩短跳转延迟，与提示显示时间对应

        // 处理字典加载逻辑
        await handleLoginSuccess();
      } else {
        // 登录失败
        // 增加登录尝试次数
        setLoginAttempts(prev => prev + 1);
        
        // 设置友好的错误信息
        const errorMsg = result.error || "登录失败，请重试";
        setLoginError(errorMsg);
        
        // 显示浮动错误通知
        showNotification(errorMsg, "error");
        
        // 触发震动效果
        triggerShakeEffect();
      }
    } catch (error) {
      // 意外错误，可能是网络问题或其他未处理的异常
      console.error("登录过程中发生意外错误:", error);
      let errorMessage = "登录失败，系统异常";
      
      if (error instanceof Error) {
        // 根据错误类型提供友好提示
        if (error.message.includes("用户名") || error.message.includes("密码")) {
          errorMessage = "用户名或密码不正确，请重新输入";
        } else if (error.message.includes("network") || error.message.includes("连接")) {
          errorMessage = "网络连接错误，请检查您的网络";
        } else if (error.message.includes("超时")) {
          errorMessage = "服务器响应超时，请稍后再试";
        } else if (error.message.includes("服务器")) {
          errorMessage = "服务器暂时不可用，请稍后再试";
        } else {
          errorMessage = error.message || "登录失败，请稍后再试";
        }
      }
      
      // 增加登录尝试次数
      setLoginAttempts(prevAttempts => prevAttempts + 1);
      
      // 设置错误信息
      setLoginError(errorMessage);
      
      // 显示浮动错误通知
      showNotification(errorMessage, "error");
      
      // 触发震动效果
      triggerShakeEffect();
    } finally {
      // 无论成功或失败，都结束登录状态
      setIsLoggingIn(false);
    }
  };

  const handleLoginSuccess = async () => {
    // 显示加载提示
    const toastId = toast.loading('正在加载字典数据...');
    
    // 异步加载字典数据
    useDictStore.getState().loadAllDicts().then(() => {
      // 隐藏加载提示
      toast.dismiss(toastId);
      
      // 显示加载结果
      const metrics = useDictStore.getState().loadMetrics;
      toast.success(`字典加载完成，耗时 ${metrics.duration}ms，成功 ${metrics.successCount} 个，失败 ${metrics.errorCount} 个`);
      
      // 如果有失败的字典，提供重试选项
      if (metrics.errorCount > 0) {
        const shouldRetry = confirm(`有 ${metrics.errorCount} 个字典加载失败，是否重试？`);
        if (shouldRetry) {
          retryFailedDicts();
        }
      }
    }).catch(error => {
      // 隐藏加载提示
      toast.dismiss(toastId);
      toast.error('字典加载失败，请刷新页面重试');
    });
  };

  const retryFailedDicts = async () => {
    const failedDicts = useDictStore.getState().loadMetrics.errors.map(e => e.dictType);
    if (failedDicts.length > 0) {
      toast.loading(`正在重试加载 ${failedDicts.length} 个失败的字典...`);
      await useDictStore.getState().fetchBatch(failedDicts);
      toast.dismiss();
    }
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      {/* 背景动画 */}
      <BackgroundLines />
      <TechBackground />
      
      {/* 浮动通知 */}
      <FloatingNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      {/* 返回按钮 */}
      <motion.div 
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回
          </Button>
        </Link>
      </motion.div>
      
      {/* 登录卡片 */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <Card className="backdrop-blur-md bg-black/30 border border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-2 pb-2">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-medium text-white text-center">
                系统登录
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-gray-400 text-center">
                请输入您的账号和密码进入系统
              </CardDescription>
            </motion.div>
            
            {/* 装饰线 */}
            <motion.div 
              className="w-16 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </CardHeader>
          
          {/* 登录尝试次数过多提示 */}
          <AnimatePresence>
            {loginAttempts >= 3 && loginAttempts < 5 && (
              <motion.div 
                className="px-6 pt-2"
                key="attempts-alert"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Alert variant="default" className="bg-amber-900/30 border-amber-500/50 text-amber-100 backdrop-blur-sm">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription className="text-amber-200">
                      您已尝试登录 {loginAttempts} 次，还有 {5 - loginAttempts} 次尝试机会
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.form 
            ref={formRef}
            onSubmit={handleLogin}
            animate={shakeForm ? "shake" : ""}
            variants={shakeVariants}
          >
            <CardContent className="grid gap-6 pt-5">
              {/* 用户名输入框 */}
              <motion.div className="grid gap-2" variants={itemVariants}>
                <Label htmlFor="username" className="text-gray-300">用户名</Label>
                <div className="relative">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${loginError && !username ? 'border-red-500' : ''}`}
                  />
                </div>
              </motion.div>
              
              {/* 密码输入框 */}
              <motion.div className="grid gap-2" variants={itemVariants}>
                <Label htmlFor="password" className="text-gray-300">密码</Label>
                <div className="relative">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${loginError && !password ? 'border-red-500' : ''}`}
                  />
                </div>
              </motion.div>
              
              {/* 记住密码/忘记密码 */}
              <motion.div className="flex justify-between items-center text-sm" variants={itemVariants}>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/5"
                  />
                  <label htmlFor="remember" className="text-gray-400">记住用户名</label>
                </div>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  忘记密码？
                </a>
              </motion.div>
            </CardContent>
            
            {/* 登录按钮 */}
            <CardFooter className="pb-6">
              <motion.div className="w-full" variants={itemVariants}>
                <Button 
                  type="submit"
                  disabled={isLoggingIn || loginAttempts >= 5}
                  className={`w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium rounded-xl shadow-lg transition-all duration-300 ${isLoggingIn ? 'opacity-80' : 'hover:shadow-purple-500/25'}`}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </div>
                  ) : loginAttempts >= 5 ? '请稍后再试' : '登录系统'}
                </Button>
              </motion.div>
            </CardFooter>
          </motion.form>
        </Card>
        
        {/* 提示信息 */}
        <motion.p 
          className="text-center text-gray-500 text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          首次使用系统请联系管理员获取账号
        </motion.p>
      </motion.div>
    </div>
  );
} 