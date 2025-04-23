"use client";

import dynamic from "next/dynamic";

// 使用dynamic导入并禁用SSR，确保组件只在客户端渲染
const TemplatesContent = dynamic(() => import("./client-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-500">加载中...</p>
      </div>
    </div>
  ),
});

export default function ClientPage() {
  return <TemplatesContent />;
} 