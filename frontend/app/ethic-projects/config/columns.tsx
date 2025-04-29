import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star, StarOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EthicProject } from "../types"

export const columns: ColumnDef<EthicProject>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全选"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="选择行"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "favorite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="收藏" />
    ),
    cell: ({ row }) => {
      const project = row.original
      return (
        <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
          {project.favorite ? (
            <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
          ) : (
            <StarOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "projectNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="项目编号" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("projectNumber")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="项目名称" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="类型" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "动物伦理" ? "outline" : "secondary"}>
          {type}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      return (
        <Badge
          variant={
            status === "进行中"
              ? "default"
              : status === "已完成"
              ? "success"
              : status === "规划中"
              ? "outline"
              : "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "auditStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="审核状态" />
    ),
    cell: ({ row }) => {
      const auditStatus = row.getValue("auditStatus") as string
      
      return (
        <Badge
          variant={
            auditStatus === "审核中"
              ? "default"
              : auditStatus === "已通过"
              ? "success"
              : auditStatus === "未提交"
              ? "outline"
              : "destructive"
          }
        >
          {auditStatus}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "leader",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="负责人" />
    ),
    cell: ({ row }) => {
      const leader = row.getValue("leader") as {
        name: string
        avatar: string
        department?: string
      }
      
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={leader.avatar} alt={leader.name} />
            <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{leader.name}</span>
            {leader.department && (
              <span className="text-xs text-muted-foreground">
                {leader.department}
              </span>
            )}
          </div>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="进度" />
    ),
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number
      
      return (
        <div className="flex w-full items-center gap-2">
          <Progress value={progress} className="h-2 w-full" />
          <span className="w-10 text-xs text-muted-foreground">
            {progress}%
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="开始日期" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("startDate")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="结束日期" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("endDate")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              复制项目ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>查看详情</DropdownMenuItem>
            <DropdownMenuItem>编辑项目</DropdownMenuItem>
            <DropdownMenuItem>查看文件</DropdownMenuItem>
            <DropdownMenuItem>查看审批进度</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">删除项目</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 