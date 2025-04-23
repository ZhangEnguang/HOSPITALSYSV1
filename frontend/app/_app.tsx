"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // 处理iframe中的导航
  useEffect(() => {
    // 检查是否在iframe中
    const isInIframe = window !== window.parent

    // 如果在iframe中且URL包含_openInTab参数
    if (isInIframe && router.query._openInTab === "true") {
      // 通知父窗口打开新标签页
      window.parent.postMessage(
        {
          type: "OPEN_NEW_TAB",
          url: window.location.href,
        },
        "*",
      )

      // 阻止在iframe中继续加载
      router.replace("/blank")
    }
  }, [router])

  return <Component {...pageProps} />
}

export default MyApp

