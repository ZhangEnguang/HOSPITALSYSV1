"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, UserCog } from "lucide-react"
import { cn } from "@/lib/utils"
import { Role } from "@/lib/api/auth"

interface RoleSwitcherProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRole?: string
  onRoleChange: (roleId: number | string) => void
  availableRoles: Role[]
}

export default function RoleSwitcher({
  open,
  onOpenChange,
  currentRole,
  onRoleChange,
  availableRoles = []
}: RoleSwitcherProps) {
  const [hoveredRole, setHoveredRole] = useState<string | number | null>(null)
  
  // 调试日志
  useEffect(() => {
    if (open) {
      console.log('角色切换器打开，可用角色:', JSON.stringify(availableRoles));
      console.log('当前选中角色:', currentRole);
      
      // 检查是否有匹配当前角色名称的角色
      const currentRoleExists = availableRoles.some(role => role.roleName === currentRole || role.name === currentRole);
      console.log('当前角色是否存在于角色列表中:', currentRoleExists);
      
      if (!currentRoleExists && availableRoles.length > 0) {
        console.log('警告: 当前角色不在可用角色列表中');
      }
    }
  }, [open, availableRoles, currentRole]);
  
  // 检查角色数组是否有效
  const hasValidRoles = Array.isArray(availableRoles) && availableRoles.length > 0;
  
  // 如果没有可用角色，显示提示信息
  if (!hasValidRoles) {
    console.log('没有可用角色或角色格式不正确');
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-lg p-0 overflow-hidden">
          <DialogHeader className="bg-gray-50 p-4 border-b">
            <DialogTitle className="text-xl font-semibold">角色切换</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">无可用角色</h3>
            <p className="text-gray-500">
              您的账户当前没有可用的角色，请联系管理员添加相应权限。
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // 处理角色选择
  const handleRoleSelect = (role: Role) => {
    console.log('选择角色:', JSON.stringify(role));
    if (role.id) {
      console.log(`触发角色切换，ID: ${role.id}`);
      onRoleChange(role.id);
    } else {
      console.error('选择的角色缺少ID:', role);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-0 overflow-auto max-h-[80vh]">
        <DialogHeader className="bg-gray-50 p-4 border-b sticky top-0 z-10">
          <DialogTitle className="text-xl font-semibold">角色切换</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-4">
            您的账号共有 <span className="font-medium text-primary">{availableRoles.length}</span> 个角色，
            当前使用: <span className="font-medium text-primary">{currentRole || "未设置"}</span>。
            请选择要切换的角色：
          </p>
          
          <div className="space-y-2">
            {availableRoles.map((role: Role, index: number) => {
              const isCurrentRole = role.roleName === currentRole || role.name === currentRole;
              return (
                <div
                  key={`role-${role.id || index}`}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                    isCurrentRole
                      ? "bg-primary/5 border-primary/30"
                      : "hover:bg-gray-50 border-gray-200",
                    hoveredRole === role.id && "border-primary/30 shadow-sm"
                  )}
                  onClick={() => handleRoleSelect(role)}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isCurrentRole ? "bg-primary/10" : "bg-gray-100"
                      )}
                    >
                      <UserCog
                        className={cn(
                          "h-5 w-5",
                          isCurrentRole ? "text-primary" : "text-gray-600"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{role.roleName || role.name || '未命名角色'}</div>
                      <div className="text-xs text-gray-500 truncate">{role.description || `角色ID: ${role.id}`}</div>
                    </div>
                  </div>
                  {isCurrentRole && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

