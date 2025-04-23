import { useEffect } from 'react'

const BASE_TITLE = '高校科研创新管理平台'

export function useTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - ${BASE_TITLE}`
    } else {
      document.title = BASE_TITLE
    }
  }, [title])
} 