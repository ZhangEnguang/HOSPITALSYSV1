"use client"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import DataList, { type Action, type DataListProps } from "./data-list"
import DetailPageLayout, { type DetailPageLayoutProps } from "@/components/detail-page/detail-page-layout"

export interface DetailConfig {
  // 详情页配置函数，接收选中的项目数据，返回DetailPageLayoutProps
  getDetailProps: (item: any) => Omit<DetailPageLayoutProps, "onBack">
  // 自定义详情页渲染函数，如果提供则使用此函数而不是DetailPageLayout
  customDetailRenderer?: (item: any, onBack: () => void) => ReactNode
}

export interface DataListWithDetailProps extends Omit<DataListProps, "onAdd"> {
  detailConfig: DetailConfig
  // 是否使用路由导航到详情页，而不是在同一页面显示
  useRouteNavigation?: boolean
  // 如果使用路由导航，指定详情页路由的构建方式
  getDetailRoute?: (id: string | number) => string
  // 添加按钮回调
  onAdd?: () => void
}

export default function DataListWithDetail({
  data,
  columns,
  detailConfig,
  useRouteNavigation = false,
  getDetailRoute,
  cardRender: userCardRender,
  ...restProps
}: DataListWithDetailProps) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // 处理项目点击
  const handleItemClick = (item: any) => {
    console.log("DataListWithDetail: Item clicked", item.id || item.title)

    if (useRouteNavigation && getDetailRoute) {
      // 使用路由导航到详情页
      console.log("Navigating to:", getDetailRoute(item.id))
      router.push(getDetailRoute(item.id))
    } else {
      // 在当前页面显示详情
      console.log("Showing detail in current page")
      setSelectedItem(item)
      setShowDetail(true)
    }
  }

  // 处理返回到列表
  const handleBackToList = () => {
    setShowDetail(false)
    setSelectedItem(null)
  }

  // 包装用户提供的cardRender，添加点击事件
  const wrappedCardRender = userCardRender
    ? (item: any, actions: Action[], selected: boolean, toggleSelect: (id: string) => void) => {
        // 创建一个包装器div，添加点击事件
        const renderedCard = userCardRender(item, actions, selected, toggleSelect)

        return (
          <div
            onClick={(e) => {
              console.log("Card wrapper clicked:", item.id || item.title)
              // 防止事件冒泡到复选框等控件
              if ((e.target as HTMLElement).closest('button, [role="checkbox"], input')) {
                console.log("Clicked on interactive element, ignoring")
                return
              }
              e.stopPropagation()
              handleItemClick(item)
            }}
            className="cursor-pointer"
            style={{ height: "100%", width: "100%" }}
          >
            {renderedCard}
          </div>
        )
      }
    : (item: any, actions: Action[], selected: boolean, toggleSelect: (id: string) => void) => (
        <div
          onClick={(e) => {
            console.log("Default card clicked:", item.id || item.title)
            // 防止事件冒泡到复选框等控件
            if ((e.target as HTMLElement).closest('button, [role="checkbox"], input')) {
              console.log("Clicked on interactive element, ignoring")
              return
            }
            e.stopPropagation()
            handleItemClick(item)
          }}
          className="cursor-pointer h-[220px] border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all duration-300 flex flex-col"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg truncate">{item.title || item.name || `项目 ${item.id}`}</h3>
            {item.status && (
              <div className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">{item.status}</div>
            )}
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            {columns.slice(0, 4).map(
              (column) =>
                column.id !== "title" &&
                column.id !== "status" && (
                  <div key={column.id} className="flex justify-between">
                    <span>{column.header}:</span>
                    <span>{column.cell ? column.cell(item) : item[column.accessorKey]}</span>
                  </div>
                ),
            )}
          </div>

          <div className="mt-auto pt-3 flex justify-end gap-2">
            {actions.slice(0, 2).map((action) => (
              <button
                key={action.id}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick(item)
                }}
                className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )

  // 添加点击操作到每个项目
  const enhancedActions: Action[] = [
    ...(restProps.actions || []),
    {
      id: "view-detail",
      label: "查看详情",
      onClick: handleItemClick,
      primary: true,
    },
  ]

  // 如果显示详情页，则渲染详情页组件
  if (showDetail && selectedItem) {
    console.log("Rendering detail page for:", selectedItem.id || selectedItem.title)

    if (detailConfig.customDetailRenderer) {
      return detailConfig.customDetailRenderer(selectedItem, handleBackToList)
    }

    const detailProps = detailConfig.getDetailProps(selectedItem)
    console.log("Detail props:", detailProps)

    return <DetailPageLayout {...detailProps} onBack={handleBackToList} />
  }

  // 否则渲染数据列表
  return (
    <DataList data={data} columns={columns} actions={enhancedActions} {...restProps} cardRender={wrappedCardRender} />
  )
}

