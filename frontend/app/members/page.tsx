"use client"

import { useState, useMemo, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DataList from "@/components/data-management/data-list"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Search, FileUp, ChevronDown, Building2, GraduationCap } from "lucide-react"
import {
  quickFilters,
  personnelFilterCategories,
  organizationFilterCategories,
  expertFilterCategories,
  teamFilterCategories,
  advancedFilters,
  sortOptions,
  tableColumns,
  cardFields,
  personnelTableActions,
  teamTableActions,
  organizationTableActions,
  personnelCardActions,
  teamCardActions,
  organizationCardActions,
  batchActions,
  statusColors,
  teamTableColumns,
  teamCardFields,
  organizationTableColumns,
  organizationCardFields,
  teamTypeColors,
  organizationTypeColors,
  orgTypeNames,
  departments
} from "./config/members-config"
import { 
  expertTableColumns, 
  expertCardFields, 
  expertTableActions, 
  expertCardActions,
  mockExperts
} from "./experts/config/experts-config"
// import type { Member, Team, Organization } from "../../types/members"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { AddTeamDialog } from "./components/add-team-dialog"
import { AddMembersDialog } from "./components/add-members-dialog"
import { TeamDetailsDrawer } from "./components/team-details-drawer"
import { EditTeamDialog } from "./components/edit-team-dialog"
import { toast } from "@/components/ui/use-toast"
import { AddMemberDialog } from "./components/add-member-dialog"
import { EditMemberDialog } from "./components/edit-member-dialog"
import { MemberDetailsDrawer } from "./components/member-details-drawer"
import { AddOrganizationDialog } from "./components/add-organization-dialog"
import { OrganizationDetailsDrawer } from "./components/organization-details-drawer"
import { EditOrganizationDialog } from "./components/edit-organization-dialog"
import { AddExpertDialog } from "./experts/components/add-expert-dialog"
import { EditExpertDialog } from "./experts/components/edit-expert-dialog"
import { ExpertDetailsDrawer } from "./experts/components/expert-details-drawer"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { get, post, put, del, filterSearchPost } from "@/lib/api"
import { SelectCampusExpertDialog } from "./experts/components/select-campus-expert-dialog"
import { ImportExpertListDialog } from "./experts/components/import-expert-list-dialog"


type DataItem = Member | Team | Organization

interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  records?: T[];
}

type Member = any; // Temporary type
type Team = any;   // Temporary type
type Organization = any; // Temporary type

export default function MembersPage() {
  const router = useRouter()
  
  // 使用 Suspense 包裹 useSearchParams 使用部分
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MembersPageContent />
    </Suspense>
  )
}

// 创建一个内部组件，将所有逻辑移到这里
function MembersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  const currentUserId = 1 // 模拟当前用户ID

  // 状态管理
  const [members, setMembers] = useState<Member[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [experts, setExperts] = useState<Member[]>([])
  const [activeTab, setActiveTab] = useState<"personnel" | "teams" | "organization" | "experts">(
    (tabParam as "personnel" | "teams" | "organization" | "experts") || "personnel"
  )
  
  // 监听URL参数变化，更新激活标签页
  useEffect(() => {
    if (tabParam && ["personnel", "teams", "organization", "experts"].includes(tabParam)) {
      setActiveTab(tabParam as "personnel" | "teams" | "organization" | "experts");
    }
  }, [tabParam]);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [seniorFilterValues, setSeniorFilterValues] = useState<Record<string, any>>({})
  const [sortOption, setSortOption] = useState("name_asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    role: true,
    department: true,
    status: true,
    joinDate: true,
    contact: true,
    type: true,
    leader: true,
    memberCount: true,
    researchFields: true,
    code: true,
    linkMan: true,
    tel: true,
    achievements: false,
    projects: false,
    metrics: false,
    foundDate: false,
    orderId: false,
    intro: false,
    standBy1: false,
  })

  // 在 MembersPage 组件中添加状态管理
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false)

  // 添加成员对话框状态
  const [addMembersDialogOpen, setAddMembersDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string } | null>(null)

  // 团队详情抽屉状态
  const [teamDetailsDrawerOpen, setTeamDetailsDrawerOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // 添加编辑团队对话框状态
  const [editTeamDialogOpen, setEditTeamDialogOpen] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null)

  // 在 MembersPage 组件中添加状态管理
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  // 在 MembersPage 组件中添加状态管理
  const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false)
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null)

  // 添加成员详情抽屉状态
  const [memberDetailsDrawerOpen, setMemberDetailsDrawerOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // 添加组织相关状态
  const [addOrganizationDialogOpen, setAddOrganizationDialogOpen] = useState(false)
  const [organizationDetailsDrawerOpen, setOrganizationDetailsDrawerOpen] = useState(false)
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null)
  const [editOrganizationDialogOpen, setEditOrganizationDialogOpen] = useState(false)
  const [organizationToEdit, setOrganizationToEdit] = useState<Organization | null>(null)

  // 添加专家模态框状态
  const [addExpertDialogOpen, setAddExpertDialogOpen] = useState(false)
  const [editExpertDialogOpen, setEditExpertDialogOpen] = useState(false)
  const [expertToEdit, setExpertToEdit] = useState<Member | null>(null)

  // 添加专家详情抽屉状态
  const [expertDetailsDrawerOpen, setExpertDetailsDrawerOpen] = useState(false)
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null)
  
  // 添加遴选校内专家和导入专家清单对话框状态
  const [selectCampusExpertDialogOpen, setSelectCampusExpertDialogOpen] = useState(false)
  const [importExpertListDialogOpen, setImportExpertListDialogOpen] = useState(false)

  // --- Data Fetching ---
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      // 角色ID和前端选项映射
      const roleValueMap: Record<string, string> = {
        'researcher': 'researcher',
        'student': 'student', 
        'expert': 'expert',
        'consultant': 'consultant',
        'other': 'other',
        '研究员': 'researcher',
        '学生': 'student',
        '评审专家': 'expert',
        '独立顾问': 'consultant',
        '其他': 'other'
      };
      
      // 状态ID和前端选项映射
      const statusValueMap: Record<string, string> = {
        'active': 'active',
        'retired': 'retired',
        'left': 'left',
        '在职': 'active',
        '退休': 'retired',
        '离职': 'left'
      };
      
      
      let response = await filterSearchPost<any>(
        '/api/teamInfo/person/page',
        currentPage,
        pageSize,
        searchTerm,
        "name,account",
        filterValues,
        seniorFilterValues
      );


      // 如果API返回的数据不符合预期格式，返回错误
      if (response.code !== 200 || !response.data) {
        console.error('API返回的数据格式不正确:', response);
        toast({ title: "获取人员列表失败", description: "API返回的数据格式不正确", variant: "destructive" });
        setMembers([]);
        setTotalItems(0);
        setLoading(false);
        return;
      }
      
      console.log('人员数据结构:', JSON.stringify(response.data));
      
      // 确保返回的数据中包含人员列表
      const records = response.data.records || [];
      const personList = Array.isArray(records) ? records : [];
      console.log('处理的人员列表:', personList);
      
      // 将后端返回的Person实体转换为前端需要的Member格式
      const transformedMembers = personList.map((person: any) => {
        // 如果person为null或undefined，提供默认空对象
        if (!person) {
          console.warn('人员数据中存在null或undefined项');
          return {
            id: `empty-${Math.random()}`,
            name: "未知",
            role: "未知",
            department: { id: "", name: "未知部门" },
            status: "未知",
            avatar: "/placeholder.svg?height=32&width=32",
          };
        }
        
        // 角色ID转换为角色显示名称
        const roleMap: Record<string, string> = {
          'researcher': '研究员',
          'student': '学生',
          'expert': '评审专家',
          'consultant': '独立顾问',
          'other': '其他'
        };
        
        // 状态ID转换为状态显示名称
        const statusMap: Record<string, string> = {
          'active': '在职',
          'retired': '退休',
          'left': '离职'
        };
        
        // 根据unitId查找部门信息
        // const department = departments.find(dept => dept.id === person.unitId) || { 
        //   id: person.unitId || "", 
        //   name: "未知部门" 
        // };
        
        return {
          id: person.id,
          name: person.name,
          nameEn: person.nameEn,
          account: person.account,
          // 转换roleId为前端显示的role字符串
          role: person.roleId,
          // 保存原始roleId以便编辑时使用
          roleId: person.roleId,
          // 转换unitId为department对象
          department: person.unitId,
          unitId: person.unitId,
          // 转换status为前端显示的状态字符串
          status: statusMap[person.status] || person.status,
          // 处理日期格式
          joinDate: person.workDate,
          workDate: person.workDate,
          // 处理联系方式
          email: person.email,
          phone: person.mobile,
          mobile: person.mobile,
          telOffice: person.telOffice,
          // 其他字段
          avatar: "/placeholder.svg?height=32&width=32", // 默认头像
          sexId: person.sexId,
          bio: person.intro,
          intro: person.intro,
          birthday: person.birthday,
          idCard: person.idCard,
          // 保留原始数据，以便编辑时使用
          _original: person
        };
      });
      
      setMembers(transformedMembers || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.error('获取人员列表错误:', error);
      toast({ title: "获取人员列表失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
      setMembers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterValues,seniorFilterValues, sortOption]);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      // Extract sort field and direction
      const [sortField, sortDirection] = sortOption.split("_");

      let response = await filterSearchPost<any>(
        '/api/teamInfo/unit/page',
        currentPage,
        pageSize,
        searchTerm,
        "name,code",
        filterValues,
        seniorFilterValues
      );
     
      
      if (response.code === 200 && response.data) {
        console.log('Organizations data:', response.data.records);
        setOrganizations(response.data.records || []);
        setTotalItems(response.data.total || 0);
      } else {
        toast({ title: "获取组织列表失败", description: response.message, variant: "destructive" });
        setOrganizations([]); // Clear data on error
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({ title: "获取组织列表失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
      setOrganizations([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterValues,seniorFilterValues, sortOption]);

  // 添加专家获取方法
  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      // 暂时使用模拟数据
      setExperts(mockExperts);
      setTotalItems(mockExperts.length);
    } catch (error) {
      console.error('获取专家库列表错误:', error);
      toast({ title: "获取专家库列表失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
      setExperts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterValues, sortOption]);

  useEffect(() => {
    // 根据激活的选项卡获取数据
    if (activeTab === 'personnel') {
      fetchMembers()
    } else if (activeTab === 'organization') {
      fetchOrganizations()
    } else if (activeTab === 'experts') {
      fetchExperts()
    }
    // 重置选择
    setSelectedRows([])
  }, [fetchMembers, fetchOrganizations, fetchExperts])


  useEffect(() => {
    // 重置选择
    setSeniorFilterValues({});
    setFilterValues({});
    setSearchTerm("");
    // 根据激活的选项卡获取数据
    if (activeTab === 'personnel') {
      fetchMembers()
     
    } else if (activeTab === 'organization') {
      fetchOrganizations()
    } else if (activeTab === 'experts') {
      fetchExperts()
    }
    
  }, [activeTab])

  useEffect(() => {
    // 仅在当前选项卡相关的获取函数变更时重新获取
    if (activeTab === 'personnel') {
      fetchMembers()
    } else if (activeTab === 'organization') {
      fetchOrganizations()
    } else if (activeTab === 'experts') {
      fetchExperts()
    }
  }, [currentPage, pageSize, searchTerm, filterValues, sortOption, activeTab, fetchMembers, fetchOrganizations, fetchExperts])

  // --- Memos and Data Processing ---

  // Sort organizations locally (if API doesn't sort perfectly or for display adjustments)
   const sortedOrganizations = useMemo(() => {
        // API should handle sorting primarily. This is a fallback or for client-side adjustments.
        return organizations // Assuming API returns sorted data based on sortOption
   }, [organizations])

  // Get current data based on active tab
  const getCurrentData = (): DataItem[] => {
    switch (activeTab) {
      case "personnel":
        return members
      case "teams":
        return teams
      case "organization":
        console.log("Returning organizations for display:", sortedOrganizations);
        return sortedOrganizations
      case "experts":
        return experts
      default:
        return members
    }
  }

  // Get current quick filters based on active tab
  const getCurrentQuickFilters = () => {
    let baseFilters: any[] = [];
    if (activeTab === "personnel") {
        baseFilters = quickFilters.filter(f => ["roleId", "status"].includes(f.id));
    }
    if (activeTab === "teams") {
        baseFilters = quickFilters.filter(f => ["teamType"].includes(f.id));
    }
    if (activeTab === "organization") {
        baseFilters = quickFilters.filter(f => ["unitTypeId"].includes(f.id));
    }
    if (activeTab === "experts") {
        baseFilters = quickFilters.filter(f => ["status"].includes(f.id)); // Experts use status filter
    }
    
    // Ensure all filters have 'options' (even if empty) and 'category'
    return baseFilters.map(f => ({
        ...f,
        options: f.options || [], // Add empty array if options are missing
        category: f.category || 'default' // Add a default category if missing
    }));
  }

  // Filtered data (client-side filtering is removed as API handles it)
  const paginatedItems = getCurrentData()

  // --- Event Handlers ---

  // 处理批量删除人员
  const handleBatchDeleteMembers = async () => {
    if (selectedRows.length === 0) return
    setLoading(true)
    try {
      // 执行删除操作 - 后端需要实现批量删除端点
      // 这里可能需要调整API调用，根据后端具体实现
      // 假设需要循环调用单个删除API
      for (const id of selectedRows) {
        await del<ApiResponse<boolean>>(`/api/teamInfo/person/${id}`)
      }
      
      toast({ title: "批量删除成功", description: `已删除 ${selectedRows.length} 名人员` })
      setSelectedRows([])
      fetchMembers()
    } catch (error) {
      toast({ title: "批量删除失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Handle Batch Delete for Organizations
    const handleBatchDeleteOrganizations = async () => {
        if (selectedRows.length === 0) return
        setLoading(true)
        try {
            // Backend expects RequestBody String[] - need to ensure api.ts handles this
            // Adjusting the del function call: Send data in the body
            const response = await del<ApiResponse<boolean>>('/api/teamInfo/unit/batch', {
                 headers: { 'Content-Type': 'application/json' }, // Ensure correct Content-Type
                 body: JSON.stringify(selectedRows) // Send IDs in the body
            })

            if (response.code === 200 && response.data) {
                toast({ title: "批量删除成功", description: `已删除 ${selectedRows.length} 个组织` })
                setSelectedRows([]) // Clear selection
                fetchOrganizations() // Refetch data
            } else {
                toast({ title: "批量删除失败", description: response.message, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "批量删除失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

  // Update handleBatchDelete to call specific handlers
  const handleBatchDelete = () => {
    if (activeTab === "organization") {
      handleBatchDeleteOrganizations()
    } else if (activeTab === "personnel" || activeTab === "experts") {
      handleBatchDeleteMembers()
    }
  }

  // Configured Batch Actions (Update delete action)
   const configuredBatchActions = [
    {
      ...batchActions[0], // setAdmin (Personnel only)
      onClick: () => { /* Implement batchSetAdmin for personnel API */ },
      disabled: () => activeTab !== 'personnel' || selectedRows.length === 0 || /* Add logic based on selection */ false,
      hidden: () => activeTab !== "personnel",
    },
    {
      ...batchActions[1], // delete
      onClick: handleBatchDelete, // Use the updated handler
      disabled: () => selectedRows.length === 0,
    },
  ]

  // Tabs configuration - 添加专家库标签
  const tabs = [
    { id: "personnel", label: "科研人员", count: totalItems },
    { id: "experts", label: "专家库", count: totalItems },
    { id: "teams", label: "科研团队", count: totalItems },
    { id: "organization", label: "组织结构", count: totalItems },
  ]

  // Get current table columns
  const getCurrentTableColumns = () => {
    switch (activeTab) {
      case "personnel": return tableColumns as any[];
      case "teams":
        return [
          teamTableColumns.find(col => col.id === 'name'),
          teamTableColumns.find(col => col.id === 'type'),
          teamTableColumns.find(col => col.id === 'leader'),
          teamTableColumns.find(col => col.id === 'memberCount'),
          teamTableColumns.find(col => col.id === 'researchFields'),
        ].filter(Boolean) as any[];
      case "organization": return organizationTableColumns as any[];
      case "experts": return expertTableColumns as any[];
      default: return tableColumns as any[];
    }
  }

  // Handle Table Actions
  const handleTableAction = async (action: string, item: DataItem) => {
    // 检查item是否存在
    if (!item) {
      console.error('尝试对空数据执行操作:', action);
      toast({ title: "操作失败", description: "找不到数据项", variant: "destructive" });
      return;
    }
    
    if (action === "view") {
        if (activeTab === 'teams' && 'teamType' in item) {
             setSelectedTeamId(item.id)
             setTeamDetailsDrawerOpen(true)
        } else if (activeTab === 'personnel' && 'account' in item) {
            setSelectedMemberId(item.id)
            setMemberDetailsDrawerOpen(true)
        } else if (activeTab === 'experts' && 'account' in item) {
            setSelectedExpertId(item.id)
            setExpertDetailsDrawerOpen(true)
        } else if (activeTab === 'organization' && 'unitTypeId' in item) {
            setSelectedOrganizationId(item.id)
            setOrganizationDetailsDrawerOpen(true)
        }
    } else if (action === "addMembers" && activeTab === "teams" && 'teamType' in item) {
        setSelectedTeam({ id: item.id, name: item.name })
        setAddMembersDialogOpen(true)
    } else if (action === "edit") {
        if (activeTab === 'teams' && 'teamType' in item) { 
          setTeamToEdit(item as Team); 
          setEditTeamDialogOpen(true); 
        }
        else if (activeTab === 'personnel' && 'account' in item) { 
          console.log('编辑人员，原始数据:', item);
          // 在设置编辑数据前先重新获取最新数据
          try {
            const response = await get<ApiResponse<any>>(`/api/teamInfo/person/${item.id}`);
            if (response.code === 200 && response.data) {
              console.log('获取到最新人员数据:', response.data);
              // 合并最新数据和本地显示格式
              const updatedMember = {
                ...item,
                ...response.data,
                _original: response.data
              };
              setMemberToEdit(updatedMember as Member);
            } else {
              // 如果获取失败，使用当前数据
              console.warn('获取最新人员数据失败，使用当前数据');
              setMemberToEdit(item as Member);
            }
          } catch (error) {
            console.error('获取人员数据出错:', error);
            // 出错时使用当前数据
            setMemberToEdit(item as Member);
          }
          setEditMemberDialogOpen(true); 
        }
        else if (activeTab === 'experts' && 'account' in item) {
          console.log('编辑专家，原始数据:', item);
          // 在设置编辑数据前先重新获取最新数据
          try {
            const response = await get<ApiResponse<any>>(`/api/teamInfo/person/${item.id}`);
            if (response.code === 200 && response.data) {
              console.log('获取到最新专家数据:', response.data);
              // 合并最新数据和本地显示格式
              const updatedExpert = {
                ...item,
                ...response.data,
                _original: response.data
              };
              setExpertToEdit(updatedExpert as Member);
            } else {
              // 如果获取失败，使用当前数据
              console.warn('获取最新专家数据失败，使用当前数据');
              setExpertToEdit(item as Member);
            }
          } catch (error) {
            console.error('获取专家数据出错:', error);
            // 出错时使用当前数据
            setExpertToEdit(item as Member);
          }
          setEditExpertDialogOpen(true); 
        }
        else if (activeTab === 'organization' && 'unitTypeId' in item) { 
          setOrganizationToEdit(item as Organization); 
          setEditOrganizationDialogOpen(true); 
        }
    } else if (action === "delete") {
        if (activeTab === "organization" && 'unitTypeId' in item) {
            setLoading(true)
            try {
                const response = await del<ApiResponse<boolean>>(`/api/teamInfo/unit/${item.id}`)
                if (response.code === 200 && response.data) {
                    toast({ title: "删除成功", description: `已删除 ${item.name}` })
                    fetchOrganizations() // 重新获取列表
                    setSelectedRows(prev => prev.filter(rowId => rowId !== item.id))
                } else {
                    toast({ title: "删除失败", description: response.message, variant: "destructive" })
                }
            } catch (error) {
                toast({ title: "删除失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
            } finally {
                setLoading(false)
            }
        } else if ((activeTab === "personnel" || activeTab === "experts") && 'account' in item) {
            setLoading(true)
            try {
                const response = await del<ApiResponse<boolean>>(`/api/teamInfo/person/${item.id}`)
                if (response.code === 200) {
                    toast({ title: "删除成功", description: `已删除 ${item.name}` })
                    if (activeTab === "personnel") {
                        fetchMembers() // 重新获取列表
                    } else if (activeTab === "experts") {
                        fetchExperts() // 重新获取专家列表
                    }
                    setSelectedRows(prev => prev.filter(rowId => rowId !== item.id))
                } else {
                    toast({ title: "删除失败", description: response.message, variant: "destructive" })
                }
            } catch (error) {
                toast({ title: "删除失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
            } finally {
                setLoading(false)
            }
        }
    }
  }

  // Get Current Table Actions
  const getCurrentTableActions = () => {
    const actions = {
        personnel: personnelTableActions,
        teams: teamTableActions,
        organization: organizationTableActions,
        experts: personnelTableActions, // 专家库使用科研人员的操作
    }[activeTab] || personnelTableActions;

    // Add type assertion for actions to include optional hidden/disabled
    type ActionDefinition = {
        id: string;
        label: string;
        icon: React.ReactNode;
        onClick?: (item: DataItem) => void; // onClick is assigned later
        hidden?: (item: DataItem) => boolean;
        disabled?: (item: DataItem) => boolean;
        variant?: string;
    };

    return (actions as ActionDefinition[]).map((action) => ({
        ...action,
        onClick: (item: DataItem) => handleTableAction(action.id, item),
        // Check if hidden/disabled functions exist before calling
        hidden: action.hidden ? (item: DataItem) => action.hidden!(item) : undefined,
        disabled: action.disabled ? (item: DataItem) => action.disabled!(item) : undefined,
    }));
  };

  // Get Current Card Fields
  const getCurrentCardFields = () => {
    switch (activeTab) {
      case "personnel": return cardFields;
      case "experts": return expertCardFields;
      case "teams": return teamCardFields;
      case "organization": return organizationCardFields;
      default: return cardFields;
    }
  }

  // Handle Card Actions (reuse handleTableAction logic)
  const handleCardAction = (action: string, item: DataItem) => {
     handleTableAction(action, item) // Delegate to table action handler
  }

  // Get Current Card Actions
  const getCurrentCardActions = () => {
    const actions = {
        personnel: personnelCardActions,
        teams: teamCardActions,
        organization: organizationCardActions,
        experts: personnelCardActions, // 专家库使用科研人员的卡片操作
    }[activeTab] || personnelCardActions;

     // Add type assertion for actions to include optional hidden/disabled
    type ActionDefinition = {
        id: string;
        label: string;
        icon: React.ReactNode;
        onClick?: (item: DataItem) => void; // onClick is assigned later
        hidden?: (item: DataItem) => boolean;
        disabled?: (item: DataItem) => boolean;
        variant?: string;
    };

    return (actions as ActionDefinition[]).map((action) => ({
        ...action,
        onClick: (item: DataItem) => handleCardAction(action.id, item),
         // Check if hidden/disabled functions exist before calling
        hidden: action.hidden ? (item: DataItem) => action.hidden!(item) : undefined,
        disabled: action.disabled ? (item: DataItem) => action.disabled!(item) : undefined,
    }));
  };

  // Get Current Status Colors/Field (logic remains the same)
    const getCurrentStatusColors = (): Record<string, BadgeProps['variant']> => {
        switch (activeTab) {
            case "personnel": return statusColors
            case "teams": return teamTypeColors
            case "organization": return organizationTypeColors
            default: return statusColors
        }
    }
    const getCurrentStatusField = () => {
        switch (activeTab) {
            case "personnel": return "status"
            case "teams": return "teamType"
            case "organization": return "unitTypeId"
            default: return "status"
        }
    }

    // 添加组织类型名称映射函数
    const getOrganizationStatusName = (item: DataItem): string => {
        if (activeTab === 'organization' && 'unitTypeId' in item) {
            return orgTypeNames[item.unitTypeId] || item.unitTypeId;
        }
        return '';
    }

  // --- Add/Edit Handlers ---

  // Handle Add Organization
  const handleAddOrganization = async (newOrganizationData: Omit<Organization, 'id'>) => { // Expect data without ID
    setLoading(true)
    try {
      // Backend expects the full Unit object
      const response = await post<ApiResponse<string>>('/api/teamInfo/unit', newOrganizationData) // Assuming API returns the new ID

      if (response.code === 200 && response.data) {
        toast({ title: "创建成功", description: `组织 "${newOrganizationData.name}" 已成功创建` })
        fetchOrganizations() // Refetch the list
        setAddOrganizationDialogOpen(false) // Close dialog
      } else {
        toast({ title: "创建失败", description: response.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "创建失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Handle Edit Organization
  const handleEditOrganization = async (editedOrganization: Organization) => {
    setLoading(true)
    try {
      const { id, ...updateData } = editedOrganization // Separate ID from data
      const response = await put<ApiResponse<boolean>>(`/api/teamInfo/unit/${id}`, updateData) // Send data without ID in body

      if (response.code === 200 && response.data) {
        toast({ title: "更新成功", description: `组织 "${editedOrganization.name}" 已成功更新` })
        fetchOrganizations() // Refetch the list
        setEditOrganizationDialogOpen(false) // Close dialog
      } else {
        toast({ title: "更新失败", description: response.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "更新失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

    // --- Implement similar Add/Edit handlers for Members and Teams ---
    const handleAddMember = async (newMemberData: any) => {
      setLoading(true)
      try {
        // 转换前端数据格式为后端所需的PersonDTO
        const personDTO = {
          // 基本资料
          name: newMemberData.name,
          nameEn: newMemberData.nameEn,
          account: newMemberData.account,
          roleId: newMemberData.roleId,
          unitId: newMemberData.unitId,
          // 个人信息
          sexId: newMemberData.sexId,
          birthday: newMemberData.birthday,
          idCard: newMemberData.idCard,
          // 联系方式
          mobile: newMemberData.mobile,
          telOffice: newMemberData.telOffice,
          email: newMemberData.email,
          // 其他信息
          status: newMemberData.status,
          intro: newMemberData.intro,
          workDate: newMemberData.workDate
        };

        const response = await post<ApiResponse<void>>('/api/teamInfo/person', personDTO)

        if (response.code === 200) {
          toast({ title: "创建成功", description: `人员 "${newMemberData.name}" 已成功创建` })
          fetchMembers() // 重新获取列表
          setAddMemberDialogOpen(false) // 关闭对话框
        } else {
          toast({ title: "创建失败", description: response.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "创建失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    // 处理编辑人员
    const handleEditMember = async (editedMember: any) => {
      setLoading(true)
      try {
        // 如果存在原始数据，合并修改
        const originalData = editedMember._original || {};
        
        // 构建要更新的数据对象 - 确保所有字段都有默认值，避免undefined
        const personDTO = {
          id: editedMember.id || '',
          // 基本资料
          name: editedMember.name || '',
          nameEn: editedMember.nameEn || '',
          account: editedMember.account || '',
          roleId: editedMember.roleId || '',
          unitId: editedMember.unitId || '',
          // 个人信息
          sexId: editedMember.sexId || '',
          birthday: editedMember.birthday || null,
          idCard: editedMember.idCard || '',
          // 联系方式
          mobile: editedMember.mobile || editedMember.phone || '',
          telOffice: editedMember.telOffice || '',
          email: editedMember.email || '',
          // 其他信息
          status: editedMember.status || 'active',
          intro: editedMember.intro || editedMember.bio || '',
          workDate: editedMember.workDate || editedMember.joinDate || null,
          // 保留原始数据中的其他字段
          userId: originalData.userId || ''
        };

        const response = await put<ApiResponse<void>>('/api/teamInfo/person', personDTO)

        if (response.code === 200) {
          toast({ title: "更新成功", description: `人员 "${editedMember.name}" 已成功更新` })
          fetchMembers() // 重新获取列表
          setEditMemberDialogOpen(false) // 关闭对话框
        } else {
          toast({ title: "更新失败", description: response.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "更新失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    const handleAddTeam = async (newTeamData: Omit<Team, 'id'>) => {
       console.log("Adding team:", newTeamData);
       toast({ title: "功能待实现", description: "新增团队API调用待实现" });
     };
    const handleEditTeam = async (editedTeam: Team) => {
       console.log("Editing team:", editedTeam);
       toast({ title: "功能待实现", description: "编辑团队API调用待实现" });
     };
    const handleAddMembers = async (teamId: string, memberIds: string[]) => {
      console.log(`Adding members ${memberIds.join(", ")} to team ${teamId}`);
      toast({ title: "功能待实现", description: "添加团队成员API调用待实现" });
    };

  // Get selected item data for drawers (logic remains the same)
  const selectedMember = members.find((member) => member.id === selectedMemberId)
  const selectedOrganization = organizations.find((org) => org.id === selectedOrganizationId)
  const selectedTeamData = teams.find((t) => t.id === selectedTeamId)

  // 获取选中的专家数据
  const selectedExpert = experts.find((expert) => expert.id === selectedExpertId)

  // 处理添加专家
  const handleAddExpert = async (expertData: any) => {
    try {
      // 暂时使用模拟数据
      const newExpert = {
        ...expertData,
        id: `exp${String(Date.now()).slice(-6)}`,
        avatar: `/placeholder.svg?height=32&width=32`,
        role: "expert",
        roleId: "expert",
        departmentName: departments.find(d => d.id === expertData.unitId)?.name || "未知单位",
        department: { id: expertData.unitId, name: departments.find(d => d.id === expertData.unitId)?.name || "未知单位" },
      };
      
      setExperts(prev => [newExpert, ...prev]);
      setTotalItems(prev => prev + 1);
      toast({ title: "添加成功", description: `已添加专家 ${expertData.name}` });
    } catch (error) {
      console.error('添加专家错误:', error);
      toast({ title: "添加专家失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
      throw error;
    }
  };

  // 处理编辑专家提交
  const handleEditExpert = async (editedExpertData: any) => {
    setLoading(true)
    try {
      // 构建要更新的数据对象
      const personDTO = {
        id: editedExpertData.id || '',
        // 基本资料
        name: editedExpertData.name || '',
        nameEn: editedExpertData.nameEn || '',
        account: editedExpertData.account || '',
        roleId: "expert", // 确保角色为专家
        unitId: editedExpertData.unitId || '',
        // 个人信息
        sexId: editedExpertData.sexId || '',
        birthday: editedExpertData.birthday || null,
        idCard: editedExpertData.idCard || '',
        // 联系方式
        mobile: editedExpertData.mobile || editedExpertData.phone || '',
        telOffice: editedExpertData.telOffice || '',
        email: editedExpertData.email || '',
        // 其他信息
        status: editedExpertData.status || 'active',
        intro: editedExpertData.intro || editedExpertData.bio || '',
        workDate: editedExpertData.workDate || editedExpertData.joinDate || null,
        // 专家特有字段
        expertLevel: editedExpertData.expertLevel || '',
        specialty: editedExpertData.specialty || [],
        title: editedExpertData.title || '',
        education: editedExpertData.education || ''
      };

      const response = await put<ApiResponse<void>>('/api/teamInfo/person', personDTO)

      if (response.code === 200) {
        toast({ title: "更新成功", description: `专家 "${editedExpertData.name}" 已成功更新` })
        fetchExperts() // 重新获取专家列表
        setEditExpertDialogOpen(false) // 关闭对话框
      } else {
        toast({ title: "更新失败", description: response.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "更新失败", description: error instanceof Error ? error.message : String(error), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  };

  // 处理遴选校内专家
  const handleSelectCampusExperts = async (expertIds: string[]) => {
    try {
      // 模拟API调用，将选中的专家转换为专家库成员
      console.log("选中的专家IDs:", expertIds);
      
      // 假设我们将这些校内人员转化为专家
      const selectedMembers = members.filter(member => expertIds.includes(member.id));
      
      // 将校内人员转换为专家格式
      const newExperts = selectedMembers.map(member => {
        // 根据职称和单位分配专家级别
        let expertLevel = "校级";
        if (member.role?.includes("教授") && member.role?.includes("博导")) {
          expertLevel = "国家级";
        } else if (member.role?.includes("研究员")) {
          expertLevel = "省级";
        } else if (member.role?.includes("副教授") || member.role?.includes("副研究员")) {
          expertLevel = "市级";
        }
        
        // 假设职称就是现有的role
        const title = member.role || "讲师";
        
        // 假设学历是博士（实际上应该从人员数据中获取）
        const education = "博士";
        
        // 为专家分配专业特长（模拟数据）
        const specialties = ["人工智能", "计算机科学", "电子信息"].slice(0, Math.floor(Math.random() * 3) + 1);
        
        return {
          ...member,
          id: `exp${String(Date.now()).slice(-6)}_${member.id}`, // 生成新的专家ID
          expertLevel,
          title,
          education,
          specialty: specialties,
          roleId: "expert", // 确保角色设置为专家
        };
      });
      
      // 将新专家添加到专家列表
      setExperts(prev => [...newExperts, ...prev]);
      setTotalItems(prev => prev + newExperts.length);
      
      toast({
        title: "遴选成功",
        description: `已成功添加 ${newExperts.length} 位校内专家`,
      });
    } catch (error) {
      console.error("遴选专家失败:", error);
      toast({
        title: "遴选专家失败",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      throw error;
    }
  };

  // 处理导入专家清单
  const handleImportExpertSuccess = async (importedExperts: any[]) => {
    try {
      // 将导入的专家添加到专家列表
      const formattedExperts = importedExperts.map(expert => ({
        ...expert,
        id: `import_${String(Date.now()).slice(-6)}_${expert.id}`, // 生成新的专家ID
        roleId: "expert", // 确保角色设置为专家
      }));
      
      setExperts(prev => [...formattedExperts, ...prev]);
      setTotalItems(prev => prev + formattedExperts.length);
      
      toast({
        title: "导入成功",
        description: `已成功导入 ${formattedExperts.length} 位专家`,
      });
    } catch (error) {
      console.error("导入专家失败:", error);
      toast({
        title: "导入专家失败",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
      throw error;
    }
  };

  // 获取当前标签页对应的高级筛选分类
  const getCurrentFilterCategories = () => {
    switch (activeTab) {
      case "personnel":
        return personnelFilterCategories;
      case "teams":
        return teamFilterCategories;
      case "organization":
        return organizationFilterCategories;
      case "experts":
        return expertFilterCategories;
      default:
        return personnelFilterCategories;
    }
  };

  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "calc(100vh - 64px)" }}>
      {/* Background Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[250px] -z-10"
        style={{ background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)" }}
      ></div>

      <DataList
        title={activeTab === "personnel" ? "人员管理" : 
              activeTab === "teams" ? "团队管理" : 
              activeTab === "organization" ? "组织管理" : 
              activeTab === "experts" ? "专家库" : "成员管理"}
        // Pass fetched data
        data={paginatedItems}
        // loading={loading} // Removed loading prop
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => {
          setActiveTab(value as "personnel" | "teams" | "organization" | "experts")
          setCurrentPage(1) // Reset page on tab change
          setSelectedRows([])
          setFilterValues({})
          setSortOption("name_asc") // Reset sort
        }}
        searchPlaceholder={activeTab === "personnel" ? "搜索人员姓名或工号..." : activeTab === "teams" ? "搜索团队名称..." : "搜索组织名称或编号..."}
        addButtonLabel="" // No default add button
        customActions={
          activeTab === "experts" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="shadow-sm flex gap-1 items-center" onClick={() => {}}>
                  <UserPlus className="h-4 w-4" />
                  <span>添加专家</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setAddExpertDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>新增校外专家</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSelectCampusExpertDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>遴选校内专家</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setImportExpertListDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  <span>导入专家清单</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="shadow-sm"
              onClick={() => {
                if (activeTab === "personnel") setAddMemberDialogOpen(true)
                else if (activeTab === "teams") setAddTeamDialogOpen(true)
                else if (activeTab === "organization") setAddOrganizationDialogOpen(true)
              }}
              disabled={loading} // Disable button while loading
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "personnel" ? "新增人员" : 
              activeTab === "teams" ? "新增团队" : "新增组织"}
            </Button>
          )
        }
        // Search and Filter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        quickFilters={getCurrentQuickFilters()}
        quickFilterValues={filterValues}
        onQuickFilterChange={(filterId: string, value: string) => {
            console.log('快速过滤条件变更:', filterId, value);
            setFilterValues(prev => ({
                ...prev,
                [filterId]: value
            }));
            setCurrentPage(1); // Reset page on filter change
        }}
        // Sort
        sortOptions={sortOptions.filter(opt => {
            const field = opt.field
            if (activeTab === 'personnel') return ['name', 'joinDate'].includes(field)
            if (activeTab === 'teams') return ['name', 'foundDate', 'memberCount'].includes(field)
             if (activeTab === 'organization') return ['name', 'unitCreateDate', 'orderId'].includes(field)
            return false
        })}
        activeSortOption={sortOption}
        onSortChange={(newSort) => {
            setSortOption(newSort)
            setCurrentPage(1) // Reset page on sort change
        }}
        // View Mode
        defaultViewMode={viewMode}
        // onViewModeChange={setViewMode} // Temporarily commented out
        // Table View
        tableColumns={getCurrentTableColumns()}
        tableActions={getCurrentTableActions()}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        // Card View
        cardFields={getCurrentCardFields()}
        cardActions={getCurrentCardActions()}
        titleField="name"
        descriptionField={activeTab === 'organization' ? 'intro' : 'description'}
        statusField={getCurrentStatusField()}
        statusVariants={getCurrentStatusColors() as Record<string, "default" | "destructive" | "outline" | "secondary">}
        getStatusName={activeTab === 'organization' ? getOrganizationStatusName : undefined}
        // Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems} // Use totalItems from API state
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        // Selection & Batch Actions
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        batchActions={configuredBatchActions}
        // Click Action
        onItemClick={(item) => handleTableAction('view', item)}
        // 高级筛选分类
        categories={getCurrentFilterCategories()}
        seniorFilterValues={seniorFilterValues}
        onAdvancedFilter={(filterValues) => {
          console.log('接收到高级筛选值:', filterValues);
          setSeniorFilterValues(prev => ({
            ...prev,
            ...filterValues
          }));
          setCurrentPage(1); // 重置页码，应用新筛选
        }}
      />

      {/* Dialogs and Drawers */}
      {/* Pass API handlers to dialogs */}

      {/* Add Team Dialog */}
      <AddTeamDialog
        open={addTeamDialogOpen}
        onOpenChange={setAddTeamDialogOpen}
        onAddTeam={handleAddTeam /* Implement handleAddTeam with API call */}
      />

      {/* Add Members Dialog */}
      <AddMembersDialog
        open={addMembersDialogOpen}
        onOpenChange={setAddMembersDialogOpen}
        teamId={selectedTeam?.id || ""}
        teamName={selectedTeam?.name || ""}
        onAddMembers={handleAddMembers /* Implement handleAddMembers with API call */}
      />

      {/* Team Details Drawer */}
      <TeamDetailsDrawer
        isOpen={teamDetailsDrawerOpen}
        onClose={() => setTeamDetailsDrawerOpen(false)}
        team={selectedTeamData}
      />

      {/* Edit Team Dialog */}
      {teamToEdit && (
        <EditTeamDialog
          open={editTeamDialogOpen}
          onOpenChange={setEditTeamDialogOpen}
          team={teamToEdit}
          onEditTeam={handleEditTeam /* Implement handleEditTeam with API call */}
        />
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={addMemberDialogOpen}
        onOpenChange={setAddMemberDialogOpen}
        onAddMember={handleAddMember /* Implement handleAddMember with API call */}
      />

      {/* Edit Member Dialog */}
      {memberToEdit && (
        <EditMemberDialog
          open={editMemberDialogOpen}
          onOpenChange={setEditMemberDialogOpen}
          member={memberToEdit}
          onEditMember={handleEditMember /* Implement handleEditMember with API call */}
        />
      )}

      {/* Member Details Drawer */}
      <MemberDetailsDrawer
        isOpen={memberDetailsDrawerOpen}
        onClose={() => setMemberDetailsDrawerOpen(false)}
        member={selectedMember}
      />

      {/* --- Organization Dialogs/Drawer using new API handlers --- */}
      <AddOrganizationDialog
        open={addOrganizationDialogOpen}
        onOpenChange={setAddOrganizationDialogOpen}
        onAddOrganization={handleAddOrganization} // Pass the API handler
      />

      <OrganizationDetailsDrawer
        isOpen={organizationDetailsDrawerOpen}
        onClose={() => setOrganizationDetailsDrawerOpen(false)}
        organization={selectedOrganization} // Pass data from state
      />

      {organizationToEdit && (
        <EditOrganizationDialog
          open={editOrganizationDialogOpen}
          onOpenChange={setEditOrganizationDialogOpen}
          organization={organizationToEdit}
          onEditOrganization={handleEditOrganization} // Pass the API handler
        />
      )}

      {/* 专家详情抽屉 */}
      <ExpertDetailsDrawer
        isOpen={expertDetailsDrawerOpen}
        onClose={() => setExpertDetailsDrawerOpen(false)}
        expert={selectedExpert}
      />

      {/* 添加专家对话框 */}
      {addExpertDialogOpen && (
        <AddExpertDialog
          open={addExpertDialogOpen}
          onOpenChange={setAddExpertDialogOpen}
          onAddExpert={handleAddExpert}
        />
      )}

      {/* 添加编辑专家对话框组件 */}
      {expertToEdit && (
        <EditExpertDialog
          open={editExpertDialogOpen}
          onOpenChange={setEditExpertDialogOpen}
          expertData={expertToEdit}
          onUpdateExpert={handleEditExpert}
        />
      )}

      {/* 遴选校内专家对话框 */}
      <SelectCampusExpertDialog
        open={selectCampusExpertDialogOpen}
        onOpenChange={setSelectCampusExpertDialogOpen}
        onSelectExperts={handleSelectCampusExperts}
      />
      
      {/* 导入专家清单对话框 */}
      <ImportExpertListDialog
        open={importExpertListDialogOpen}
        onOpenChange={setImportExpertListDialogOpen}
        onImportSuccess={handleImportExpertSuccess}
      />
    </div>
  )
}
