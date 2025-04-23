"use client"

import { useState } from "react"
import { Bell, Globe, Mail, FileText, AlertCircle, CheckCircle2, Clock, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export interface NotificationItem {
  id: string
  type: "notification" | "todo"
  icon?: "globe" | "mail" | "file" | "alert" | "check" | "clock"
  title: string
  time: string
  read: boolean
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  unreadCount: number
  onMarkAllAsRead: () => void
}

const getIcon = (type: NotificationItem["icon"], itemType: "notification" | "todo") => {
  if (itemType === "notification") {
    return {
      icon: <Bell className="h-4 w-4 text-primary" />,
      bgColor: "bg-primary/10 rounded-md"
    }
  }
  
  // 待办事项使用不同的图标和颜色
  switch (type) {
    case "globe":
      return {
        icon: <Globe className="h-4 w-4 text-blue-500" />,
        bgColor: "bg-blue-50 rounded-md"
      }
    case "mail":
      return {
        icon: <Mail className="h-4 w-4 text-purple-500" />,
        bgColor: "bg-purple-50 rounded-md"
      }
    case "file":
      return {
        icon: <FileText className="h-4 w-4 text-green-500" />,
        bgColor: "bg-green-50 rounded-md"
      }
    case "alert":
      return {
        icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
        bgColor: "bg-amber-50 rounded-md"
      }
    case "check":
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        bgColor: "bg-emerald-50 rounded-md"
      }
    case "clock":
      return {
        icon: <Clock className="h-4 w-4 text-rose-500" />,
        bgColor: "bg-rose-50 rounded-md"
      }
    default:
      return {
        icon: <Bell className="h-4 w-4 text-gray-500" />,
        bgColor: "bg-gray-50 rounded-md"
      }
  }
}

export default function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const notificationItems = notifications.filter(item => item.type === "notification")
  const todoItems = notifications.filter(item => item.type === "todo")
  const allItems = notifications

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-2 w-2 p-0 rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 border-0 shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)] bg-white/80 backdrop-blur-[12px]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="text-sm font-medium">通知消息</div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary h-auto py-1 px-2 flex items-center gap-1"
            onClick={onMarkAllAsRead}
          >
            <Check className="h-3.5 w-3.5" />
            标为已读
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="px-4 py-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-sm">
                全部 ({allItems.length})
              </TabsTrigger>
              <TabsTrigger value="notification" className="text-sm">
                通知 ({notificationItems.length})
              </TabsTrigger>
              <TabsTrigger value="todo" className="text-sm">
                待办 ({todoItems.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="h-[400px] overflow-y-auto px-4">
            <TabsContent value="all" className="m-0">
              {allItems.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">暂无消息</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {allItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-start gap-3 py-4 cursor-pointer -mx-4 px-4 transition-colors hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                        getIcon(item.icon, item.type).bgColor
                      )}>
                        {getIcon(item.icon, item.type).icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {!item.read && (
                            <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notification" className="m-0">
              {notificationItems.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">暂无通知</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {notificationItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-start gap-3 py-4 cursor-pointer -mx-4 px-4 transition-colors hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                        getIcon(item.icon, item.type).bgColor
                      )}>
                        {getIcon(item.icon, item.type).icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {!item.read && (
                            <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="todo" className="m-0">
              {todoItems.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">暂无待办</div>
              ) : (
                <div className="divide-y divide-border/40">
                  {todoItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex items-start gap-3 py-4 cursor-pointer -mx-4 px-4 transition-colors hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 flex items-center justify-center",
                        getIcon(item.icon, item.type).bgColor
                      )}>
                        {getIcon(item.icon, item.type).icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          {!item.read && (
                            <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>

          <div className="p-2 border-t border-border/40">
            <Button 
              variant="ghost" 
              className="w-full text-sm hover:bg-muted/50" 
              onClick={() => setOpen(false)}
            >
              查看全部
            </Button>
          </div>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 