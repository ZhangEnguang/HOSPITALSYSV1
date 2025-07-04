"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LineChart,
  Medal,
  Users,
  Wallet,
  Layers,
  BarChart2,
  MoreHorizontal,
  ChevronDown,
  Microscope,
  ClipboardCheck,
  FlaskConical,
  ShieldCheck,
  Gavel,
  Dna,
  Rabbit,
  TestTube,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface MenuItem {
  name: string
  icon: React.ReactNode
  path: string
  subMenus?: SubMenuItem[]
  shortName?: string
}

interface SubMenuItem {
  name: string
  path: string
}

export default function HorizontalMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("")
  const [activeSubItem, setActiveSubItem] = useState("")
  const [visibleMenuItems, setVisibleMenuItems] = useState<MenuItem[]>([])
  const [overflowMenuItems, setOverflowMenuItems] = useState<MenuItem[]>([])
  const [menuContainerWidth, setMenuContainerWidth] = useState(0)
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({})

  const getThemeColor = () => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim() || "#2156FF"
    }
    return "#2156FF"
  }

  // 将菜单名称映射为两个字的简称
  const getShortName = (name: string): string => {
    switch(name) {
      case "仪表盘": return "仪表";
      case "待办事项": return "待办";
      case "申报管理": return "申报";
      case "项目管理": return "项目";
      case "伦理项目": return "伦理";
      case "伦理审查": return "审查";
      case "人遗专项": return "人遗";
      case "动物中心": return "动物";
      case "实验室": return "实验";
      case "进度管理": return "进度";
      case "日历": return "日历";
      case "经费管理": return "经费";
      case "成果管理": return "成果";
      case "考核奖励": return "考核";
      case "成员管理": return "成员";
      case "文档共享": return "文档";
      case "辅助管理": return "辅助";
      default: return name.substring(0, 2); // 默认取前两个字
    }
  }

  const menuItems: MenuItem[] = [
    { 
      name: "仪表盘", 
      shortName: "仪表",
      icon: <BarChart2 className="h-5 w-5" />, 
      path: "/workbench",
      subMenus: [
        { name: "工作台", path: "/workbench?tab=overview" },
        { name: "项目分析", path: "/workbench?tab=project-analysis" },
        { name: "经费统计", path: "/workbench?tab=budget-statistics" },
        { name: "成果统计", path: "/workbench?tab=achievement-statistics" },
      ]
    },
    { 
      name: "待办事项", 
      shortName: "待办",
      icon: <CheckSquare className="h-5 w-5" />, 
      path: "/todos" 
    },
    { 
      name: "申报管理", 
      shortName: "申报",
      icon: <ClipboardList className="h-5 w-5" />, 
      path: "/applications",
      subMenus: [
        { name: "申报批次", path: "/applications?tab=application" },
        { name: "评审批次", path: "/applications?tab=review" },
      ]
    },
    { 
      name: "项目管理", 
      shortName: "项目",
      icon: <FolderOpen className="h-5 w-5" />, 
      path: "/projects",
      subMenus: [
        { name: "纵向项目", path: "/projects?tab=vertical" },
        { name: "横向项目", path: "/projects?tab=horizontal" },
        { name: "校级项目", path: "/projects?tab=schoolLevel" },
        { name: "出账合同", path: "/projects?tab=disbursement" },
      ]
    },
    { 
      name: "伦理项目", 
      shortName: "伦理",
      icon: <ShieldCheck className="h-5 w-5" />, 
      path: "/ethic-projects",
      subMenus: [
        { name: "动物伦理", path: "/ethic-projects?tab=animal" },
        { name: "人体伦理", path: "/ethic-projects?tab=human" },
      ]
    },
    { 
      name: "伦理审查", 
      shortName: "审查",
      icon: <ClipboardCheck className="h-5 w-5" />, 
      path: "#",
      subMenus: [
        { name: "初始审查", path: "/ethic-review/initial-review" },
        { name: "跟踪报告", path: "/ethic-review/track-review" },
      ]
    },
    { 
      name: "人遗专项", 
      shortName: "人遗",
      icon: <Dna className="h-5 w-5" />, 
      path: "#",
      subMenus: [
        { name: "人遗资源", path: "/ethic-review/human-genetics-review" },
      ]
    },
    { 
      name: "动物中心", 
      shortName: "动物",
      icon: <Rabbit className="h-5 w-5" />, 
      path: "#",
      subMenus: [
        { name: "动物房", path: "/laboratory/animal-rooms" },
        { name: "笼位预约", path: "/laboratory/cage-booking" },
        { name: "动物档案", path: "/laboratory/animal-files" },
      ]
    },
    { 
      name: "实验室", 
      shortName: "实验",
      icon: <FlaskConical className="h-5 w-5" />, 
      path: "#",
      subMenus: [
        { name: "仪器", path: "/laboratory/equipment" },
        { name: "仪器预约", path: "/laboratory/equipment-booking" },
        { name: "仪器预约配置", path: "/laboratory/equipment-booking-config" },
        { name: "试剂", path: "/laboratory/reagent" },
        { name: "试剂申领", path: "/laboratory/reagent-application" },
        { name: "耗材", path: "/laboratory/consumables" },
        { name: "耗材申领", path: "/laboratory/consumables-application" },
      ]
    },
    { 
      name: "进度管理", 
      shortName: "进度",
      icon: <LineChart className="h-5 w-5" />, 
      path: "/progress",
      subMenus: [
        { name: "项目变更", path: "/progress?tab=projectChange" },
        { name: "合同认定", path: "/progress?tab=contractRecognition" },
        { name: "项目中检", path: "/progress?tab=projectInspection" },
        { name: "项目结项", path: "/progress?tab=projectCompletion" },
      ]
    },
    { 
      name: "日历", 
      shortName: "日历",
      icon: <Calendar className="h-5 w-5" />, 
      path: "/calendar" 
    },
    { 
      name: "经费管理", 
      shortName: "经费",
      icon: <Wallet className="h-5 w-5" />, 
      path: "/funds",
      subMenus: [
        { name: "经费入账", path: "/funds?tab=income" },
        { name: "经费外拨", path: "/funds?tab=outbound" },
        { name: "经费报销", path: "/funds?tab=reimbursement" },
        { name: "经费结转", path: "/funds?tab=carryover" },
      ]
    },
    { 
      name: "成果管理", 
      shortName: "成果",
      icon: <FileText className="h-5 w-5" />, 
      path: "/achievements",
      subMenus: [
        { name: "学术论文", path: "/achievements?tab=academic-papers" },
        { name: "学术著作", path: "/achievements?tab=academic-works" },
        { name: "鉴定成果", path: "/achievements?tab=evaluated-achievements" },
        { name: "成果获奖", path: "/achievements?tab=achievement-awards" },
        { name: "专利", path: "/achievements?tab=patents" },
      ]
    },
    { 
      name: "考核奖励", 
      shortName: "考核",
      icon: <Medal className="h-5 w-5" />, 
      path: "/rewards",
      subMenus: [
        { name: "成员考核", path: "/rewards?tab=evaluation-members" },
        { name: "部门考核", path: "/rewards?tab=evaluation-statistics" },
        { name: "考核标准", path: "/rewards?tab=scoring-report" },
      ]
    },
    { 
      name: "成员管理", 
      shortName: "成员",
      icon: <Users className="h-5 w-5" />, 
      path: "/members",
      subMenus: [
        { name: "科研人员", path: "/members?tab=personnel" },
        { name: "专家库", path: "/members?tab=experts" },
        { name: "科研团队", path: "/members?tab=teams" },
        { name: "组织结构", path: "/members?tab=organization" },
      ]
    },
    { 
      name: "文档共享", 
      shortName: "文档",
      icon: <FileText className="h-5 w-5" />, 
      path: "/documents" 
    },
    { 
      name: "辅助管理", 
      shortName: "辅助",
      icon: <Layers className="h-5 w-5" />, 
      path: "/auxiliary",
      subMenus: [
        { name: "项目分类", path: "/auxiliary?tab=projectCategory" },
        { name: "预算标准", path: "/auxiliary?tab=budgetStandard" },
        { name: "管理费提取方案", path: "/auxiliary?tab=managementFeeScheme" },
        { name: "评审方案", path: "/auxiliary?tab=reviewWorksheet" },
        { name: "刊物级别", path: "/auxiliary?tab=journalLevel" },
        { name: "用章类型", path: "/auxiliary?tab=sealType" },
      ]
    },
  ]

  // 监听窗口大小变化，动态调整可见菜单项
  useEffect(() => {
    const handleResize = () => {
      const menuContainer = document.getElementById('horizontal-menu-container');
      if (menuContainer) {
        setMenuContainerWidth(menuContainer.offsetWidth);
      }
    };

    if (typeof window !== 'undefined') {
      handleResize(); // 初始化时获取一次宽度
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 根据容器宽度计算可见菜单项和溢出菜单项
  useEffect(() => {
    if (menuContainerWidth === 0) return;
    
    // 假设每个菜单项平均宽度约为100px，为右侧留出300px的空间
    const MENU_ITEM_WIDTH = 100; // 每个菜单项的估计宽度
    const RIGHT_SPACE = 260; // 右侧需要保留的空间
    
    // 根据可用空间计算可显示的菜单项数量
    const availableWidth = menuContainerWidth - RIGHT_SPACE;
    let maxVisibleItems = Math.floor(availableWidth / MENU_ITEM_WIDTH);
    
    // 确保至少显示1个菜单项
    maxVisibleItems = Math.max(1, maxVisibleItems);
    // 不要超过菜单总数
    maxVisibleItems = Math.min(maxVisibleItems, menuItems.length);
    
    const visibleItems = menuItems.slice(0, maxVisibleItems);
    const overflowItems = menuItems.slice(maxVisibleItems);
    
    setVisibleMenuItems(visibleItems);
    setOverflowMenuItems(overflowItems);
  }, [menuContainerWidth]);

  useEffect(() => {
    if (!pathname) return
    
    const safePathname = pathname || "/"
    const currentPath = safePathname === "/" ? "/" : `/${safePathname.split("/")[1]}`
    const tabParam = new URLSearchParams(safePathname.split("?")[1] || "").get("tab")
    
    const currentMenuItem = menuItems.find((item) => 
      item.path === currentPath || safePathname.startsWith(item.path)
    )
    
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.name)
      
      if (currentMenuItem.subMenus && currentMenuItem.subMenus.length > 0) {
        if (tabParam) {
          const activeSubMenu = currentMenuItem.subMenus.find(subItem => 
            subItem.path.includes(tabParam)
          )
          
          if (activeSubMenu) {
            setActiveSubItem(activeSubMenu.name)
          } else {
            setActiveSubItem("")
          }
        } else {
          const activeSubMenu = currentMenuItem.subMenus.find(subItem => 
            safePathname.startsWith(subItem.path)
          )
          
          if (activeSubMenu) {
            setActiveSubItem(activeSubMenu.name)
          } else {
            setActiveSubItem("")
          }
        }
      } else {
        setActiveSubItem("")
      }
    }
  }, [pathname, menuItems])
  
  const handleItemClick = (name: string, path: string) => {
    setActiveItem(name)
    router.push(path)
  }
  
  const handleSubItemClick = (parentName: string, name: string, path: string) => {
    setActiveItem(parentName)
    setActiveSubItem(name)
    router.push(path)
  }
  
  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  // 渲染溢出菜单
  const renderOverflowMenu = () => {
    if (overflowMenuItems.length === 0) return null;
    
    const primaryColor = getThemeColor();
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center h-9 w-9 px-2 py-1.5 rounded-md text-[14px] font-medium text-gray-700 hover:bg-primary/10 hover:text-primary menu-button">
            <MoreHorizontal className="h-5 w-5 menu-icon" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 overflow-menu p-2">
          <DropdownMenuGroup>
            {overflowMenuItems.map((item) => {
              const isActive = activeItem === item.name;
              const hasSubMenus = item.subMenus && item.subMenus.length > 0;
              
              if (hasSubMenus) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary my-1">
                      <div className={cn(
                        "flex items-center w-full gap-2",
                        isActive ? "text-primary" : "text-gray-700"
                      )}>
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.name}</span>
                        <ChevronDown className="ml-auto h-4 w-4 menu-icon" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      side="right" 
                      align="start" 
                      sideOffset={8}
                      className="min-w-[200px] dropdown-menu-nested p-2"
                    >
                      {item.subMenus?.map((subItem) => {
                        const isSubActive = activeSubItem === subItem.name;
                        
                        return (
                          <DropdownMenuItem 
                            key={subItem.name}
                            onClick={() => handleSubItemClick(item.name, subItem.name, subItem.path)}
                            className={cn(
                              "px-3 py-2 my-1 rounded-md",
                              isSubActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                            )}
                          >
                            {subItem.name}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              } else {
                return (
                  <DropdownMenuItem 
                    key={item.name}
                    onClick={() => handleItemClick(item.name, item.path)}
                    className={cn(
                      "px-3 py-2 my-1 rounded-md",
                      isActive ? "text-primary" : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("menu-icon", isActive ? "text-primary" : "text-gray-700")}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </DropdownMenuItem>
                );
              }
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 自定义渲染一级菜单和二级菜单
  const renderMenu = () => {
    return (
      <div className="flex items-center gap-2">
        {visibleMenuItems.map((item) => {
          const isActive = activeItem === item.name;
          const hasSubMenus = item.subMenus && item.subMenus.length > 0;
          const primaryColor = getThemeColor();
          const isOpen = openMenus[item.name];
          
          if (hasSubMenus) {
            return (
              <div key={item.name} className="relative hover-dropdown-container">
                <Button
                  variant="ghost"
                  className={cn(
                    "h-9 px-4 py-1.5 text-[14px] font-medium rounded-md flex items-center gap-1.5 menu-button",
                    isActive ? "text-white bg-primary" : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                  )}
                  style={isActive ? { backgroundColor: primaryColor } : {}}
                >
                  <span className={cn("menu-icon transition-all", isActive ? "text-white" : "text-gray-700")}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform menu-icon",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </Button>
                <div className="dropdown-content">
                  <div className="w-[200px] p-3 rounded-md shadow-lg border border-gray-200 bg-white mt-1">
                    {item.subMenus?.map((subItem) => {
                      const isSubActive = activeSubItem === subItem.name;
                      
                      return (
                        <div
                          key={subItem.name}
                          onClick={() => handleSubItemClick(item.name, subItem.name, subItem.path)}
                          className={cn(
                            "block w-full px-3 py-2.5 rounded-md text-[14px] cursor-pointer mb-1 last:mb-0",
                            isSubActive 
                              ? "text-white bg-primary" 
                              : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                          )}
                          style={isSubActive ? { backgroundColor: primaryColor } : {}}
                        >
                          {subItem.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => handleItemClick(item.name, item.path)}
                className={cn(
                  "flex items-center h-9 px-4 py-1.5 rounded-md text-[14px] gap-1.5 font-medium menu-button",
                  isActive 
                    ? "text-white bg-primary" 
                    : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                )}
                style={isActive ? { backgroundColor: primaryColor } : {}}
              >
                <span className={cn("menu-icon transition-all", isActive ? "text-white" : "text-gray-700")}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Button>
            );
          }
        })}
        
        {overflowMenuItems.length > 0 && renderOverflowMenu()}
      </div>
    );
  };

  return (
    <div id="horizontal-menu-container" className="mx-2 flex-grow flex justify-start max-w-full">
      {renderMenu()}
      
      <style jsx global>{`
        /* 确保二级菜单正确定位 */
        [data-radix-popper-content-wrapper] {
          z-index: 9999 !important;
        }
        
        /* 防止菜单重叠 */
        .overflow-menu [data-radix-popper-content-wrapper] {
          z-index: 10000 !important;
        }
        
        /* 为二级菜单添加间距 */
        .dropdown-menu-nested {
          margin-left: 8px !important;
        }
        
        /* 防止菜单闪烁 */
        [data-state="open"] > [data-radix-popper-content-wrapper] {
          animation: none !important;
        }

        /* 优化溢出菜单的子菜单样式 */
        .overflow-menu .dropdown-menu-nested {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          border-radius: 8px !important;
        }

        /* 悬停下拉菜单样式 */
        .hover-dropdown-container {
          position: relative;
        }
        
        .hover-dropdown-container .dropdown-content {
          display: none;
          position: absolute;
          left: 0;
          top: 100%;
          z-index: 1000;
          min-width: 180px;
        }
        
        .hover-dropdown-container:hover .dropdown-content {
          display: block;
        }

        /* 菜单项悬停时图标变色 */
        .menu-button:hover .menu-icon {
          color: var(--primary-color, #2156FF) !important;
        }
        
        /* 大屏幕下优化菜单项间距 */
        @media (min-width: 1280px) {
          #horizontal-menu-container > div > button,
          #horizontal-menu-container > div > div > button {
            margin: 0 4px !important;
          }
        }
        
        /* 超大屏幕下进一步调整菜单项间距 */
        @media (min-width: 1536px) {
          #horizontal-menu-container > div > button,
          #horizontal-menu-container > div > div > button {
            margin: 0 6px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
} 