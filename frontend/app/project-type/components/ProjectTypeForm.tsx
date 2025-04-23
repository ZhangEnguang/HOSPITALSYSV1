"use client";

import React, { useState, useEffect } from 'react';
import { ProjectTypeFormData, BudgetStandard } from '@/types/project-type';
import BudgetStandardTable from './BudgetStandardTable';
import { createProjectType, updateProjectType } from '../api/index';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ProjectTypeFormProps {
  initialValues?: Partial<ProjectTypeFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectTypeForm: React.FC<ProjectTypeFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectTypeFormData>({
    name: '',
    category: '',
    financialCode: '',
    educationStatistics: '',
    projectSource: '',
    projectLevel: '',
    paymentSource: '',
    isBudgetControl: false,
    remark: '',
    parentId: '',
    budgetStandards: [],
  });
  const [budgetStandards, setBudgetStandards] = useState<BudgetStandard[]>(
    initialValues?.budgetStandards || []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
      }));
      setBudgetStandards(initialValues.budgetStandards || []);
    }
  }, [initialValues]);

  const handleInputChange = (field: keyof ProjectTypeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBudgetStandardChange = (
    index: number,
    field: keyof BudgetStandard,
    value: string
  ) => {
    const newBudgetStandards = [...budgetStandards];
    newBudgetStandards[index] = {
      ...newBudgetStandards[index],
      [field]: value,
    };
    setBudgetStandards(newBudgetStandards);
  };

  const handleAddBudgetStandard = () => {
    setBudgetStandards([
      ...budgetStandards,
      { standard: '', startDate: '', endDate: '' },
    ]);
  };

  const handleDeleteBudgetStandard = (index: number) => {
    const newBudgetStandards = budgetStandards.filter((_, i) => i !== index);
    setBudgetStandards(newBudgetStandards);
  };

  const validateForm = () => {
    if (!formData.name) {
      toast({
        title: "验证失败",
        description: "请输入项目分类名称",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category) {
      toast({
        title: "验证失败",
        description: "请选择类别",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.educationStatistics) {
      toast({
        title: "验证失败",
        description: "请选择教育部统计归属",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.projectSource) {
      toast({
        title: "验证失败",
        description: "请选择项目来源",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.projectLevel) {
      toast({
        title: "验证失败",
        description: "请选择项目级别",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.paymentSource) {
      toast({
        title: "验证失败",
        description: "请选择支付来源",
        variant: "destructive",
      });
      return false;
    }
    if (formData.isBudgetControl && budgetStandards.length === 0) {
      toast({
        title: "验证失败",
        description: "请至少添加一个预算标准",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        budgetStandards,
      };

      if (initialValues?.id) {
        await updateProjectType(initialValues.id, submitData);
        toast({
          title: "更新成功",
          description: "项目分类已更新",
        });
      } else {
        await createProjectType(submitData);
        toast({
          title: "创建成功",
          description: "项目分类已创建",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('表单提交失败:', error);
      toast({
        title: "操作失败",
        description: "请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">项目分类名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="请输入项目分类名称"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">类别</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="科研项目">科研项目</SelectItem>
              <SelectItem value="教学项目">教学项目</SelectItem>
              <SelectItem value="其他项目">其他项目</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="financialCode">财务编号</Label>
          <Input
            id="financialCode"
            value={formData.financialCode}
            onChange={(e) => handleInputChange('financialCode', e.target.value)}
            placeholder="请输入财务编号"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationStatistics">教育部统计归属</Label>
          <Select
            value={formData.educationStatistics}
            onValueChange={(value) => handleInputChange('educationStatistics', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择教育部统计归属" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="国家级">国家级</SelectItem>
              <SelectItem value="省级">省级</SelectItem>
              <SelectItem value="市级">市级</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectSource">项目来源</Label>
          <Select
            value={formData.projectSource}
            onValueChange={(value) => handleInputChange('projectSource', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择项目来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="国家">国家</SelectItem>
              <SelectItem value="省部级">省部级</SelectItem>
              <SelectItem value="市级">市级</SelectItem>
              <SelectItem value="校级">校级</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectLevel">项目级别</Label>
          <Select
            value={formData.projectLevel}
            onValueChange={(value) => handleInputChange('projectLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择项目级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="重点">重点</SelectItem>
              <SelectItem value="一般">一般</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentSource">支付来源</Label>
          <Select
            value={formData.paymentSource}
            onValueChange={(value) => handleInputChange('paymentSource', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择支付来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="财政拨款">财政拨款</SelectItem>
              <SelectItem value="自筹资金">自筹资金</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>是否管控预算</Label>
          <RadioGroup
            value={formData.isBudgetControl ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('isBudgetControl', value === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="isBudgetControl-true" />
              <Label htmlFor="isBudgetControl-true">是</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="isBudgetControl-false" />
              <Label htmlFor="isBudgetControl-false">否</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {formData.isBudgetControl && (
        <div className="space-y-2">
          <Label>预算标准</Label>
          <BudgetStandardTable
            budgetStandards={budgetStandards}
            onChange={handleBudgetStandardChange}
            onAdd={handleAddBudgetStandard}
            onDelete={handleDeleteBudgetStandard}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="remark">备注</Label>
        <Textarea
          id="remark"
          value={formData.remark}
          onChange={(e) => handleInputChange('remark', e.target.value)}
          placeholder="请输入备注"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? '提交中...' : '提交'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectTypeForm; 