"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 0.5
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
}

// 粒子效果组件 - 使用useEffect确保只在客户端执行
const ParticleEffect = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: number;
    opacity: number;
    scale: number;
  }>>([]);
  
  // 仅在客户端生成粒子，避免hydration不匹配
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 10 + 5,
      opacity: Math.random() * 0.5 + 0.25,
      scale: Math.random() * 0.5 + 0.5
    }));
    
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: particle.scale,
            opacity: particle.opacity
          }}
          animate={{
            x: [
              particle.x,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              particle.y,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}
    </div>
  )
}

// 科技感装饰元素
const TechDecoration = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* 顶部水平线 */}
      <motion.div
        className="absolute top-[15%] left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      
      {/* 底部水平线 */}
      <motion.div
        className="absolute bottom-[15%] right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* 左侧垂直线 */}
      <motion.div
        className="absolute left-[10%] top-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
      />
      
      {/* 右侧垂直线 */}
      <motion.div
        className="absolute right-[10%] top-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 3, ease: "easeInOut", delay: 1.5 }}
      />

      {/* 圆圈装饰元素 */}
      <motion.div
        className="absolute top-[20%] left-[20%] w-40 h-40 rounded-full border border-blue-300/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute bottom-[20%] right-[20%] w-60 h-60 rounded-full border border-purple-300/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  )
}

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // 加载动画延迟
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      {/* 背景粒子 */}
      <ParticleEffect />
      
      {/* 科技感装饰 */}
      <TechDecoration />
      
      {/* 内容容器 */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center px-6 py-12 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-2xl max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* 标志 */}
        <motion.div 
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
          variants={itemVariants}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </motion.div>
        
        {/* 标题 */}
        <motion.h1 
          className="mt-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center"
          variants={itemVariants}
        >
          科研管理系统 <span className="text-purple-300">Alpha</span>
        </motion.h1>
        
        {/* 副标题 */}
        <motion.div 
          className="mt-4 mb-6 text-center"
          variants={itemVariants}
        >
          <p className="text-lg text-gray-300">
            驱动创新 · 连接未来 · 赋能科研
          </p>
          <p className="mt-2 text-sm text-gray-400">
            高效管理您的科研项目、成果与团队
          </p>
        </motion.div>
        
        {/* 动态分隔线 */}
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ delay: 1.5, duration: 0.8 }}
        />
        
        {/* 按钮 */}
        <motion.div variants={itemVariants}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/25"
            onClick={() => {
              // 清除认证状态
              const { clearAuth } = useAuthStore.getState();
              clearAuth();
              // 清除本地存储中的token和用户信息
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-storage');
                sessionStorage.removeItem('redirectUrl');
              }
              // 跳转到登录页
              router.push('/login');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            进入系统
          </Button>
        </motion.div>
        
        {/* 版本信息 */}
        <motion.p 
          className="absolute bottom-2 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
        >
          Beta Version 0.1.0
        </motion.p>
      </motion.div>
    </div>
  )
}

