import React from "react";
import ClientOnly from "@/components/client-only";
import DataList from "@/components/data-management/data-list";

// 定义自己的DataTableColumn接口
interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function ProjectList() {
  // 定义必要的状态和变量
  const projects: Project[] = []; // 替换为实际项目数据
  const tabs = [
    { id: "all", label: "全部" },
    { id: "ongoing", label: "进行中" },
    { id: "completed", label: "已完成" }
  ];
  const activeTab = "all"; // 替换为实际激活的标签
  
  const tableColumns: DataTableColumn<Project>[] = [
    {
      id: "title",
      header: "项目名称",
      accessorKey: "title"
    },
    {
      id: "status",
      header: "状态",
      accessorKey: "status"
    }
  ];
  
  const cardActions = [
    {
      id: "view",
      label: "查看",
      onClick: (item: Project) => console.log("查看项目", item)
    },
    {
      id: "edit",
      label: "编辑",
      onClick: (item: Project) => console.log("编辑项目", item)
    }
  ];
  
  const tableActions = [
    {
      id: "view",
      label: "查看详情",
      onClick: (item: Project) => console.log("查看项目详情", item)
    }
  ];
  
  const pageSize = 10;
  const currentPage = 1;
  const totalItems = 0;

  // 处理函数
  const handleTabChange = (value: string) => {
    console.log("Tab changed:", value);
  };
  
  const handleItemClick = (item: Project) => {
    console.log("Item clicked:", item);
  };
  
  const handlePageChange = (page: number) => {
    console.log("Page changed:", page);
  };
  
  const handlePageSizeChange = (size: number) => {
    console.log("Page size changed:", size);
  };

  return (
    <div className="space-y-4">
      <ClientOnly>
        <DataList
          title="项目管理"
          data={projects}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tableColumns={tableColumns}
          tableActions={tableActions}
          cardActions={cardActions}
          onItemClick={handleItemClick}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          titleField="title"
          descriptionField="description"
          statusField="status"
        />
      </ClientOnly>
    </div>
  );
} 