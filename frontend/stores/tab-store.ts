import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TabItem } from '@/components/dynamic-tabs'

interface TabState {
  tabs: TabItem[]
  activeTab: string
  addTab: (tab: TabItem) => void
  removeTab: (key: string) => void
  setActiveTab: (key: string) => void
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [
        {
          key: '/',
          label: '首页',
          path: '/',
          closeable: false,
        },
      ],
      activeTab: '/',

      addTab: (tab: TabItem) => {
        const { tabs } = get()
        
        // 如果是一级菜单，检查是否已存在
        if (!tab.closeable) {
          const existingTab = tabs.find(t => t.path === tab.path)
          if (existingTab) {
            set({ activeTab: existingTab.key })
            return
          }
        }
        
        // 移除相同路径的旧页签（对于非一级菜单）
        const filteredTabs = tabs.filter(t => 
          !t.closeable || t.path !== tab.path
        )
        
        // 添加新页签
        set({
          tabs: [...filteredTabs, tab],
          activeTab: tab.key,
        })
      },

      removeTab: (key: string) => {
        const { tabs, activeTab } = get()
        const newTabs = tabs.filter(tab => tab.key !== key)
        
        // 如果关闭的是当前激活的标签，切换到相邻标签
        if (key === activeTab && newTabs.length > 0) {
          const index = tabs.findIndex(tab => tab.key === key)
          const nextTab = tabs[index - 1] || tabs[index + 1]
          set({
            tabs: newTabs,
            activeTab: nextTab ? nextTab.key : '/',
          })
        } else {
          set({ tabs: newTabs })
        }
      },

      setActiveTab: (key: string) => {
        set({ activeTab: key })
      },
    }),
    {
      name: 'tab-storage',
      skipHydration: true,
    }
  )
) 