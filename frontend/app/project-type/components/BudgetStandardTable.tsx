"use client";

import React from 'react';
import { BudgetStandard } from '@/types/project-type';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface BudgetStandardTableProps {
  budgetStandards: BudgetStandard[];
  onChange: (index: number, field: keyof BudgetStandard, value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

const BudgetStandardTable: React.FC<BudgetStandardTableProps> = ({
  budgetStandards,
  onChange,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标准</TableHead>
              <TableHead>开始日期</TableHead>
              <TableHead>结束日期</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetStandards.map((standard, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={standard.standard}
                    onChange={(e) => onChange(index, 'standard', e.target.value)}
                    placeholder="请输入标准"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={standard.startDate}
                    onChange={(e) => onChange(index, 'startDate', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={standard.endDate}
                    onChange={(e) => onChange(index, 'endDate', e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={onAdd} variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        添加预算标准
      </Button>
    </div>
  );
};

export default BudgetStandardTable; 