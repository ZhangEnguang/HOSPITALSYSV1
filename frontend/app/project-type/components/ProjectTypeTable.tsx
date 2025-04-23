import React from 'react';
import { ProjectType } from '@/types/project-type';
import { deleteProjectType } from '../api/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectTypeTableProps {
  data: ProjectType[];
  loading: boolean;
  onEdit: (record: ProjectType) => void;
  onAddChild: (record: ProjectType) => void;
  onRefresh: () => void;
}

const ProjectTypeTable: React.FC<ProjectTypeTableProps> = ({
  data,
  loading,
  onEdit,
  onAddChild,
  onRefresh,
}) => {
  const handleDelete = async (id: string) => {
    try {
      await deleteProjectType(id);
      toast({
        title: "删除成功",
        description: "项目分类已删除",
      });
      onRefresh();
    } catch (error) {
      console.error('删除失败:', error);
      toast({
        title: "删除失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>项目分类名称</TableHead>
            <TableHead>类别</TableHead>
            <TableHead>编号</TableHead>
            <TableHead>财务编号</TableHead>
            <TableHead>教育部统计归属</TableHead>
            <TableHead>项目来源</TableHead>
            <TableHead>项目级别</TableHead>
            <TableHead>支付来源</TableHead>
            <TableHead>是否管控预算</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.category}</TableCell>
              <TableCell>{record.code}</TableCell>
              <TableCell>{record.financialCode}</TableCell>
              <TableCell>{record.educationStatistics}</TableCell>
              <TableCell>{record.projectSource}</TableCell>
              <TableCell>{record.projectLevel}</TableCell>
              <TableCell>{record.paymentSource}</TableCell>
              <TableCell>{record.isBudgetControl ? '是' : '否'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(record)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddChild(record)}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加子类
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTypeTable; 