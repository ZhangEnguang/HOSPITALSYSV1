// 这是一个服务器组件
import { Suspense } from "react";
import ClientPage from "./client-page";

// 禁用此页面的静态生成
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-10 h-10 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-500">加载中...</p>
          </div>
        </div>
      }
    >
      <ClientPage />
    </Suspense>
  );
}

