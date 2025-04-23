"use client"

// hooks/use-previous.ts
import { useRef, useEffect } from "react"

// 保存前一个状态的自定义 hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

