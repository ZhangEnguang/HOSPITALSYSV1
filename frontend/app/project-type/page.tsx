"use client";

import React, { useState, useEffect } from 'react';
import { ProjectType, ProjectTypeFormData, ProjectTypeQueryParams } from '@/types/project-type';
import { getProjectTypeList, deleteProjectType, createProjectType, updateProjectType, generateProjectTypeCode } from './api/index';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DataList from "@/components/data-management/data-list";
import { Badge } from "@/components/ui/badge";
import { Dict } from "@/components/dict";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 导入排序选项接口
interface SortOption {
  id: string;
  field: string;
  direction: "asc" | "desc";
  label: string;
}

export default function ProjectTypePage() {
  const [data, setData] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const router = useRouter();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProjectType | null>(null);
  const [formData, setFormData] = useState<ProjectTypeFormData>({
    name: '',
    category: '',
    feeCode: '',
    eduStatistics: '',
    projectSource: '',
    projectLevel: '',
    paymentSource: '',
    budgetControl: false,
    note: '',
    budgetStandards: []
  });
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 检查 cardFields 的有效性
  useEffect(() => {
    cardFields.forEach(field => {
      if (typeof field.value !== 'function') {
        console.error('字段的 value 不是函数类型:', field);
      }
    });
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: ProjectTypeQueryParams = {
        page: currentPage,
        pageSize: pageSize,
      };
      const result = await getProjectTypeList(params);
      // 确保数据符合 ProjectType 接口定义
      const processedData = result.records.map(item => ({
        ...item,
        budgetControl: item.budgetControl ?? false,
        category: item.category || '',
        code: item.code || '',
        feeCode: item.feeCode || '',
        eduStatistics: item.eduStatistics || '',
        projectSource: item.projectSource || '',
        projectLevel: item.projectLevel || '',
        paymentSource: item.paymentSource || '',
      }));
      setData(processedData);
      setTotalItems(result.total);
    } catch (error) {
      console.error('获取数据失败:', error);
      toast({
        title: "获取数据失败",
        description: "请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setFormData({
      name: '',
      category: '',
      code: '',
      feeCode: '',
      eduStatistics: '',
      projectSource: '',
      projectLevel: '',
      paymentSource: '',
      budgetControl: false,
      note: '',
      budgetStandards: []
    });
    setAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);
    if (!formData.name || formData.name.trim() === '') {
      toast({
        title: "验证错误",
        description: "项目分类名称不能为空",
        variant: "destructive",
      });
      return;
    }
    try {
      await createProjectType(formData);
      toast({
        title: "创建成功",
        description: "项目分类已创建",
      });
      setAddDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('创建失败:', error);
      toast({
        title: "创建失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 创建一个兼容Dict组件的setFormData函数
  const handleDictFormChange = (formData: React.SetStateAction<any>) => {
    setFormData(formData);
    
    // 自动生成编号的逻辑处理
    if (typeof formData === 'function') {
      // 如果是函数，无法预先知道结果，在下一个渲染周期中处理
      const updatedFormData = formData({...formData});
      
      // 检查是否更新了category字段
      if (updatedFormData && updatedFormData.category) {
        setTimeout(() => generateProjectCode(updatedFormData.category), 0);
      }
    } else if (typeof formData === 'object' && formData !== null) {
      // 如果是直接的对象更新
      if (formData.field === 'category' && formData.category) {
        generateProjectCode(formData.category);
      } else if (formData.category !== undefined && formData.category !== null && formData.category !== '') {
        generateProjectCode(formData.category);
      }
    }
  };
  
  // 封装编号生成逻辑为一个单独函数
  const generateProjectCode = async (category: string) => {
    try {
      // 调用后端接口生成编号
      const generatedCode = await generateProjectTypeCode(category, formData.parentId);
      
      // 更新表单数据，设置自动生成的编号
      setFormData(prev => ({
        ...prev,
        code: generatedCode
      }));
    } catch (error) {
      console.error('生成编号失败:', error);
      toast({
        title: "生成编号失败",
        description: "请重试或手动输入",
        variant: "destructive",
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    setFormData({
      ...formData,
      budgetControl: !!checked
    });
  };

  const handleFormChange = (attribute: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const handleEdit = (record: ProjectType) => {
    setEditingRecord(record);
    setFormData({
      id: record.id,
      name: record.name,
      category: record.category || '',
      code: record.code || '',
      feeCode: record.feeCode || '',
      eduStatistics: record.eduStatistics || '',
      projectSource: record.projectSource || '',
      projectLevel: record.projectLevel || '',
      paymentSource: record.paymentSource || '',
      budgetControl: record.budgetControl || false,
      note: record.note || '',
      parentId: record.parentId,
      budgetStandards: record.budgetStandards || []
    });
    setEditDialogOpen(true);
  };

  const handleAddChild = (record: ProjectType) => {
    console.log("Add Child:", record);
    // 设置父类ID和继承的信息
    const newFormData = {
      name: '',
      category: record.category || '',
      code: '',  // 会自动生成
      feeCode: '',
      eduStatistics: '',
      projectSource: record.projectSource || '',
      projectLevel: record.projectLevel || '',
      paymentSource: record.paymentSource || '',
      budgetControl: record.budgetControl || false,
      note: '',
      parentId: record.code,  // 设置父类ID
      budgetStandards: []
    };
    
    // 先更新表单状态
    setFormData(newFormData);
    
    // 使用setTimeout确保状态更新后再生成编号
    setTimeout(() => {
      if (record.category) {
        // 直接传入parentId而不依赖formData中的值
        generateProjectTypeCode(record.category, record.id).then(code => {
          setFormData(prev => ({
            ...prev,
            code: code
          }));
        }).catch(error => {
          console.error('生成编号失败:', error);
          toast({
            title: "生成编号失败",
            description: "请重试或手动输入",
            variant: "destructive",
          });
        });
      }
    }, 0);
    
    // 打开添加对话框
    setAddDialogOpen(true);
  };

  const handleDelete = async (record: ProjectType) => {
    // 添加删除确认
    if (!window.confirm(`确定要删除"${record.name}"吗？此操作不可撤销。`)) {
      return; // 用户取消删除
    }
    
    try {
      await deleteProjectType(record.id);
      toast({
        title: "删除成功",
        description: "项目分类已删除",
      });
      if (data.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast({
        title: "删除失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim() === '') {
      toast({
        title: "验证错误",
        description: "项目分类名称不能为空",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateProjectType(formData);
      toast({
        title: "更新成功",
        description: "项目分类已更新",
      });
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('更新失败:', error);
      toast({
        title: "更新失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const tableColumns = [
    {
      id: "name",
      header: "项目分类名称",
      accessorKey: "name",
      cell: (item: ProjectType) => <span className="font-medium">{item.name}</span>,
    },
    {
      id: "category",
      header: "类别",
      accessorKey: "category",
      cell: (item: ProjectType) => (
        <Dict
          dictCode="project_type"
          displayType="tag"
          value={item.category}
        />
      ),
    },
    {
      id: "code",
      header: "编号",
      accessorKey: "code",
    },
    {
      id: "feeCode",
      header: "财务编号",
      accessorKey: "feeCode",
    },
    {
      id: "eduStatistics",
      header: "教育部统计归属",
      accessorKey: "eduStatistics",
      cell: (item: ProjectType) => (
        <Dict
          dictCode="education_class"
          displayType="tag"
          value={item.eduStatistics}
        />
      ),
    },
    {
      id: "projectSource",
      header: "项目来源",
      accessorKey: "projectSource",
    },
    {
      id: "projectLevel",
      header: "项目级别",
      accessorKey: "projectLevel",
      cell: (item: ProjectType) => (
        <Dict
          dictCode="project_level"
          displayType="tag"
          value={item.projectLevel}
        />
      ),
    },
    {
      id: "paymentSource",
      header: "支付来源",
      accessorKey: "paymentSource",
    },
    {
      id: "budgetControl",
      header: "是否管控预算",
      accessorKey: "budgetControl",
      cell: (item: ProjectType) => (
        <Badge variant={item.budgetControl ? "default" : "secondary"}>
          {item.budgetControl ? '是' : '否'}
        </Badge>
      ),
    },
  ];

  const tableActions = [
    {
      id: "edit",
      label: "编辑",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      id: "addChild",
      label: "添加子类",
      icon: <Plus className="h-4 w-4" />,
      onClick: handleAddChild,
    },
    {
      id: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
    },
  ];

  // 在组件外部定义函数
  function createCardField(id: string, label: string, valueFn: (item: any) => React.ReactNode) {
    return {
      id,
      label,
      value: valueFn
    };
  }

  const cardFields = [
    { 
      id: "info", 
      label: "",
      value: (item: any) => (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">编号</div>
              <div className="text-sm font-medium text-primary">{item.code}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">财务编号</div>
              <div className="text-sm font-medium">{item.feeCode || "未设置"}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">类别</div>
              <Dict
                dictCode="project_type"
                displayType="tag"
                value={item.category}
              />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">项目级别</div>
              <Dict
                dictCode="project_level"
                displayType="tag"
                value={item.projectLevel}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">项目来源</div>
              <div className="text-sm">{item.projectSource || "未指定"}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">支付来源</div>
              <div className="text-sm">{item.paymentSource || "未指定"}</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const sortOptions: SortOption[] = [
    { id: "name_asc", field: "name", direction: "asc", label: "名称 (A-Z)" },
    { id: "name_desc", field: "name", direction: "desc", label: "名称 (Z-A)" },
    { id: "code_asc", field: "code", direction: "asc", label: "编号 (升序)" },
    { id: "code_desc", field: "code", direction: "desc", label: "编号 (降序)" },
  ];

  const quickFilters = [
    {
      id: "budgetControl",
      label: "预算管控",
      value: "all",
      options: [
        { id: "yes", label: "是", value: "true" },
        { id: "no", label: "否", value: "false" },
      ],
    },
  ];

  const batchActions = [
    {
      id: "delete",
      label: "批量删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: async (rows: any) => {
        try {
          // 直接使用selectedRows进行删除
          for (const id of selectedRows) {
            console.log(`正在删除ID: ${id}`);
            try {
              const result = await deleteProjectType(id);
              console.log(`删除ID ${id} 结果:`, result);
            } catch (err) {
              console.error(`删除ID ${id} 失败:`, err);
            }
          }
          
          // 添加成功提示和刷新逻辑
          toast({
            title: "批量删除成功",
            description: `已删除 ${selectedRows.length} 个项目分类`,
          });
          
          // 处理页码和刷新数据
          if (selectedRows.length === data.length && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchData();
          }
          
          // 清空选中行
          setSelectedRows([]);
        } catch (error) {
          console.error('批量删除失败:', error);
          toast({
            title: "批量删除失败",
            description: "请重试",
            variant: "destructive",
          });
        }
      },
    },
  ];

  const handleRowClick = (projectType: ProjectType) => {
    console.log('Clicked project type:', projectType);
    setSelectedProjectType(projectType);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 relative" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <DataList
        title="项目分类"
        data={data}
        addButtonLabel=""
        onAddNew={undefined}
        customActions={
          <Button
            className="gap-2 ml-2"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            新增项目分类
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={() => fetchData()}
        quickFilters={quickFilters}
        sortOptions={sortOptions}
        defaultViewMode="grid"
        tableColumns={tableColumns}
        tableActions={tableActions}
        cardFields={cardFields}
        cardActions={tableActions}
        titleField="name"
        descriptionField=""
        statusField="budgetControl"
        statusVariants={{
          "true": "default",
          "false": "secondary"
        }}
        getStatusName={(item) => item.budgetControl ? "预算管控" : "无管控"}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={batchActions}
        settingsButtonLabel={undefined}
        onOpenSettings={undefined}
        onItemClick={handleRowClick}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold text-black">新增项目分类</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              填写以下信息创建新的项目分类
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 py-6">
              {/* 基本信息区域 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-medium">基本信息</h3>
                </div>
                
                {/* 显示父类信息 */}
                {formData.parentId && (
                  <div className="p-4 bg-slate-100 rounded-md mb-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                      <h4 className="text-sm font-medium">父类信息</h4>
                    </div>
                    <p className="text-sm text-slate-600">当前添加的是 <span className="font-medium text-slate-800">"{data.find(item => item.code === formData.parentId)?.name || ''}"</span> 的子类</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center">
                      项目分类名称 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="输入项目分类名称"
                      required
                      className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium flex items-center">
                      类别 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Dict
                      dictCode="project_type"
                      displayType="select"
                      value={formData.category}
                      field="category"
                      setFormData={handleDictFormChange}
                      placeholder="请选择类别"
                      disabled={!!formData.parentId}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium flex items-center">
                      编号 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="系统自动生成"
                      readOnly
                      className="h-10 transition-all focus:ring-2 focus:ring-primary/30 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeCode" className="text-sm font-medium flex items-center">
                      财务编号 <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="feeCode"
                      name="feeCode"
                      value={formData.feeCode}
                      onChange={handleInputChange}
                      placeholder="输入财务编号"
                      required
                      className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
              
              {/* 附加信息区域 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-medium">附加信息</h3>
                </div>
                
                <div className="space-y-4 bg-slate-50 p-5 rounded-lg">
                  <Label htmlFor="eduStatistics" className="text-sm font-medium">教育部统计归属</Label>
                  <Dict
                    dictCode="education_class"
                    displayType="radio"
                    value={formData.eduStatistics}
                    field="eduStatistics"
                    setFormData={setFormData}
                    placeholder="请选择教育部统计归属"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectSource" className="text-sm font-medium">项目来源</Label>
                    <Input
                      id="projectSource"
                      name="projectSource"
                      value={formData.projectSource}
                      onChange={handleInputChange}
                      placeholder="输入项目来源"
                      className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectLevel" className="text-sm font-medium">项目级别</Label>
                    <Dict
                      dictCode="project_level"
                      displayType="select"
                      value={formData.projectLevel}
                      field="projectLevel"
                      setFormData={setFormData}
                      placeholder="请选择项目级别"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentSource" className="text-sm font-medium">支付来源</Label>
                    <Input
                      id="paymentSource"
                      name="paymentSource"
                      value={formData.paymentSource}
                      onChange={handleInputChange}
                      placeholder="输入支付来源"
                      className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-sm font-medium">备注</Label>
                  <Input
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="输入备注"
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              
              {/* 预算管控区域 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-medium">预算管控</h3>
                </div>
                
                <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 rounded-md border border-slate-200">
                  <Checkbox 
                    id="budgetControl" 
                    checked={formData.budgetControl}
                    onCheckedChange={(checked) => handleFormChange('budgetControl', !!checked)}
                    className="h-5 w-5 rounded transition-all data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="budgetControl" className="text-sm font-medium cursor-pointer">是否管控预算</Label>
                </div>

                {formData.budgetControl && (
                  <div className="space-y-4 border rounded-lg p-6 bg-slate-50 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                        预算标准
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newStandard = {
                            standard: '',
                            startDate: '',
                            endDate: '',
                            note: ''
                          };
                          handleFormChange('budgetStandards', [...(formData.budgetStandards || []), newStandard]);
                        }}
                        className="gap-2 hover:bg-primary hover:text-white transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        添加预算标准
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.budgetStandards?.length ? (
                        formData.budgetStandards.map((standard, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 items-end p-4 rounded-md bg-white border shadow-sm hover:shadow-md transition-all">
                            <div className="space-y-2">
                              <Label htmlFor={`standard-${index}`} className="text-sm font-medium">标准</Label>
                              <Input
                                id={`standard-${index}`}
                                value={standard.standard}
                                onChange={(e) => {
                                  const newStandards = [...(formData.budgetStandards || [])];
                                  newStandards[index] = { ...standard, standard: e.target.value };
                                  setFormData({ ...formData, budgetStandards: newStandards });
                                }}
                                placeholder="输入预算标准"
                                className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${index}`} className="text-sm font-medium">开始日期</Label>
                              <Input
                                id={`startDate-${index}`}
                                type="date"
                                value={standard.startDate}
                                onChange={(e) => {
                                  const newStandards = [...(formData.budgetStandards || [])];
                                  newStandards[index] = { ...standard, startDate: e.target.value };
                                  setFormData({ ...formData, budgetStandards: newStandards });
                                }}
                                className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${index}`} className="text-sm font-medium">结束日期</Label>
                              <Input
                                id={`endDate-${index}`}
                                type="date"
                                value={standard.endDate}
                                onChange={(e) => {
                                  const newStandards = [...(formData.budgetStandards || [])];
                                  newStandards[index] = { ...standard, endDate: e.target.value };
                                  setFormData({ ...formData, budgetStandards: newStandards });
                                }}
                                className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newStandards = (formData.budgetStandards || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, budgetStandards: newStandards });
                              }}
                              className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all hover:border-red-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          尚未添加预算标准，点击上方按钮添加
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="border-t pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} className="transition-all">
                取消
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 transition-all">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold text-black">编辑项目分类</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              修改项目分类信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center">
                    项目分类名称 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="输入项目分类名称"
                    required
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium flex items-center">
                    类别 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Dict
                    dictCode="project_type"
                    displayType="select"
                    value={formData.category}
                    field="category"
                    setFormData={handleDictFormChange}
                    placeholder="请选择类别"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium flex items-center">
                    编号 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="系统自动生成"
                    readOnly
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30 bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeCode" className="text-sm font-medium flex items-center">
                    财务编号 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="feeCode"
                    name="feeCode"
                    value={formData.feeCode}
                    onChange={handleInputChange}
                    placeholder="输入财务编号"
                    required
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eduStatistics" className="text-sm font-medium flex items-center">
                    教育部统计归属
                  </Label>
                  <Dict
                    dictCode="education_class"
                    displayType="radio"
                    value={formData.eduStatistics}
                    field="eduStatistics"
                    setFormData={setFormData}
                    placeholder="请选择教育部统计归属"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectSource" className="text-sm font-medium flex items-center">
                    项目来源
                  </Label>
                  <Input
                    id="projectSource"
                    name="projectSource"
                    value={formData.projectSource}
                    onChange={handleInputChange}
                    placeholder="输入项目来源"
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectLevel" className="text-sm font-medium flex items-center">
                    项目级别
                  </Label>
                  <Dict
                    dictCode="project_level"
                    displayType="select"
                    value={formData.projectLevel}
                    field="projectLevel"
                    setFormData={setFormData}
                    placeholder="请选择项目级别"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentSource" className="text-sm font-medium flex items-center">
                    支付来源
                  </Label>
                  <Input
                    id="paymentSource"
                    name="paymentSource"
                    value={formData.paymentSource}
                    onChange={handleInputChange}
                    placeholder="输入支付来源"
                    className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetControl" className="text-sm font-medium flex items-center">
                  是否管控预算
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="budgetControl"
                    checked={formData.budgetControl}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="budgetControl" className="text-sm font-normal">
                    启用预算管控
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium flex items-center">
                  备注
                </Label>
                <Input
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="输入备注信息"
                  className="h-10 transition-all focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isSidebarOpen && selectedProjectType && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeSidebar}
          />
          
          {/* 抽屉式侧边栏 */}
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">项目分类详情</h3>
                  <Badge variant="outline" className="bg-white">
                    {selectedProjectType.code}
                  </Badge>
                </div>
                <button 
                  onClick={closeSidebar} 
                  className="text-gray-400 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-sm font-medium text-gray-700">基本信息</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">项目分类名称</label>
                        <p className="mt-1 text-gray-900">{selectedProjectType.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">类别</label>
                        <div className="mt-1">
                          <Dict
                            dictCode="project_type"
                            displayType="tag"
                            value={selectedProjectType.category}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 财务信息 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-sm font-medium text-gray-700">财务信息</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">财务编号</label>
                        <p className="mt-1 text-gray-900">{selectedProjectType.feeCode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">教育部统计归属</label>
                        <div className="mt-1">
                          <Dict
                            dictCode="education_class"
                            displayType="tag"
                            value={selectedProjectType.eduStatistics}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 项目信息 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-sm font-medium text-gray-700">项目信息</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">项目来源</label>
                        <p className="mt-1 text-gray-900">{selectedProjectType.projectSource}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">项目级别</label>
                        <div className="mt-1">
                          <Dict
                            dictCode="project_level"
                            displayType="tag"
                            value={selectedProjectType.projectLevel}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">支付来源</label>
                        <p className="mt-1 text-gray-900">{selectedProjectType.paymentSource}</p>
                      </div>
                    </div>
                  </div>

                  {/* 预算信息 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-sm font-medium text-gray-700">预算信息</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">是否管控预算</label>
                        <div className="mt-1">
                          <Badge variant={selectedProjectType.budgetControl ? "default" : "secondary"}>
                            {selectedProjectType.budgetControl ? '是' : '否'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeSidebar}>
                    关闭
                  </Button>
                  <Button onClick={() => handleEdit(selectedProjectType)}>
                    编辑
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 