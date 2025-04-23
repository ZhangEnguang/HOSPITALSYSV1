"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2, MoveVertical, AlertCircle, Check, X, InfoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface IndicatorProps {
  id: string;
  name: string;
  weight: number;
  subIndicators: SubIndicatorProps[];
}

interface SubIndicatorProps {
  id: string;
  name: string;
  score: number;
}

interface ReviewSchemeFormData {
  name: string;
  code: string;
  projectType: string;
  description: string;
  businessScope: string;
  type: "indicatorScoring" | "directScore10" | "directScore100" | "directGrade" | "directPassFail";
  indicators: IndicatorProps[];
  minPassingScore?: number;
  grades?: {
    id: string;
    name: string;
    description: string;
    order: number;
  }[];
  passingCriteria?: string;
  requireComments: boolean;
  isEnabled: boolean;
}

interface BasicInfoFormProps {
  data?: Partial<ReviewSchemeFormData>;
  onUpdate: (data: ReviewSchemeFormData) => void;
  validationErrors?: Record<string, string>;
}

export default function BasicInfoForm({ data, onUpdate, validationErrors }: BasicInfoFormProps) {
  const defaultGrades = [
    { id: "grade-1", name: "A", description: "优秀：项目整体表现极为出色，具有显著优势和创新性", order: 1 },
    { id: "grade-2", name: "B", description: "良好：项目整体表现良好，达到预期目标，有一定亮点", order: 2 },
    { id: "grade-3", name: "C", description: "合格：项目基本满足要求，存在一些改进空间", order: 3 }
  ];

  const [formValues, setFormValues] = useState<ReviewSchemeFormData>({
    name: data?.name || "",
    code: data?.code || "",
    projectType: data?.projectType || "",
    description: data?.description || "",
    businessScope: data?.businessScope || "",
    type: data?.type || "indicatorScoring",
    indicators: data?.indicators || [
      {
        id: "indicator-1",
        name: "技术方案",
        weight: 30,
        subIndicators: [
          { id: "sub-1-1", name: "技术创新性", score: 10 },
          { id: "sub-1-2", name: "技术可行性", score: 10 }
        ]
      },
      {
        id: "indicator-2",
        name: "项目可行性",
        weight: 30,
        subIndicators: [
          { id: "sub-2-1", name: "市场前景", score: 10 }
        ]
      },
      {
        id: "indicator-3",
        name: "团队能力",
        weight: 40,
        subIndicators: [
          { id: "sub-3-1", name: "团队经验", score: 10 },
          { id: "sub-3-2", name: "团队结构", score: 10 }
        ]
      }
    ],
    minPassingScore: data?.minPassingScore || 60,
    grades: data?.grades || defaultGrades,
    passingCriteria: data?.passingCriteria || "申请项目符合所有基本要求且无重大问题即可通过",
    requireComments: data?.requireComments ?? true,
    isEnabled: data?.isEnabled ?? true
  });

  // 校验权重总和是否为100
  const totalWeight = formValues.indicators.reduce((sum, ind) => sum + ind.weight, 0);
  const [weightError, setWeightError] = useState(totalWeight !== 100);

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Only update parent when form values actually change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onUpdate(formValues);
    setWeightError(formValues.indicators.reduce((sum, ind) => sum + ind.weight, 0) !== 100);
  }, [formValues, onUpdate]);

  const handleChange = (field: keyof ReviewSchemeFormData, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 添加一级指标
  const addIndicator = () => {
    const newId = `indicator-${Date.now()}`;
    setFormValues((prev) => ({
      ...prev,
      indicators: [
        ...prev.indicators,
        {
          id: newId,
          name: "",
          weight: 0,
          subIndicators: []
        }
      ]
    }));
  };

  // 删除一级指标
  const removeIndicator = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      indicators: prev.indicators.filter(indicator => indicator.id !== id)
    }));
  };

  // 更新一级指标
  const updateIndicator = (id: string, field: keyof IndicatorProps, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      indicators: prev.indicators.map(indicator => 
        indicator.id === id ? { ...indicator, [field]: value } : indicator
      )
    }));
  };

  // 添加二级指标
  const addSubIndicator = (indicatorId: string) => {
    const newId = `sub-${indicatorId}-${Date.now()}`;
    setFormValues((prev) => ({
      ...prev,
      indicators: prev.indicators.map(indicator => 
        indicator.id === indicatorId 
          ? { 
              ...indicator, 
              subIndicators: [
                ...indicator.subIndicators,
                { id: newId, name: "", score: 10 }
              ] 
            } 
          : indicator
      )
    }));
  };

  // 删除二级指标
  const removeSubIndicator = (indicatorId: string, subIndicatorId: string) => {
    setFormValues((prev) => ({
      ...prev,
      indicators: prev.indicators.map(indicator => 
        indicator.id === indicatorId 
          ? { 
              ...indicator, 
              subIndicators: indicator.subIndicators.filter(sub => sub.id !== subIndicatorId)
            } 
          : indicator
      )
    }));
  };

  // 更新二级指标
  const updateSubIndicator = (indicatorId: string, subIndicatorId: string, field: keyof SubIndicatorProps, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      indicators: prev.indicators.map(indicator => 
        indicator.id === indicatorId 
          ? { 
              ...indicator, 
              subIndicators: indicator.subIndicators.map(sub =>
                sub.id === subIndicatorId ? { ...sub, [field]: value } : sub
              )
            } 
          : indicator
      )
    }));
  };

  // 添加评分等级
  const addGrade = () => {
    const newId = `grade-${Date.now()}`;
    const newOrder = formValues.grades ? Math.max(...formValues.grades.map(g => g.order)) + 1 : 1;
    
    setFormValues((prev) => ({
      ...prev,
      grades: [
        ...(prev.grades || []),
        { id: newId, name: "", description: "", order: newOrder }
      ]
    }));
  };

  // 删除评分等级
  const removeGrade = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      grades: prev.grades?.filter(grade => grade.id !== id)
    }));
  };

  // 更新评分等级
  const updateGrade = (id: string, field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      grades: prev.grades?.map(grade => 
        grade.id === id ? { ...grade, [field]: value } : grade
      )
    }));
  };

  // 根据评审类型渲染相应配置界面
  const renderConfigByType = () => {
    switch (formValues.type) {
      case "indicatorScoring":
        return renderIndicatorScoringConfig();
      case "directScore10":
      case "directScore100":
        return renderDirectScoreConfig();
      case "directGrade":
        return renderDirectGradeConfig();
      case "directPassFail":
        return renderDirectPassFailConfig();
      default:
        return null;
    }
  };

  // 渲染按指标打分配置
  const renderIndicatorScoringConfig = () => {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">一级指标配置</h3>
          <div className="flex items-center">
            <Badge variant={weightError ? "destructive" : "secondary"} className="mr-3">
              {weightError ? (
                <AlertCircle className="mr-1 h-3 w-3" />
              ) : (
                <Check className="mr-1 h-3 w-3" />
              )}
              权重总和: {totalWeight}%
            </Badge>
            <Button onClick={addIndicator} type="button" variant="outline" size="sm">
              <PlusCircle className="mr-1 h-4 w-4" />
              添加一级指标
            </Button>
          </div>
        </div>

        {weightError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>权重错误</AlertTitle>
            <AlertDescription>
              所有一级指标的权重总和必须等于100%，当前总和为{totalWeight}%
            </AlertDescription>
          </Alert>
        )}

        <Accordion type="multiple" defaultValue={formValues.indicators.map(ind => ind.id)} className="w-full">
          {formValues.indicators.map((indicator, index) => (
            <AccordionItem key={indicator.id} value={indicator.id} className="border rounded-md mb-3 p-1">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-2 w-full">
                  <AccordionTrigger className="flex-grow hover:no-underline py-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{indicator.name || "未命名指标"}</span>
                    </div>
                  </AccordionTrigger>
                  <div className="flex items-center space-x-4 min-w-[280px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">权重:</span>
                      <Input
                        value={indicator.weight}
                        onChange={(e) => updateIndicator(indicator.id, "weight", parseInt(e.target.value) || 0)}
                        className="w-16 h-8"
                        type="number"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Button 
                      onClick={() => removeIndicator(indicator.id)} 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`indicator-name-${indicator.id}`}>指标名称</Label>
                    <Input
                      id={`indicator-name-${indicator.id}`}
                      value={indicator.name}
                      onChange={(e) => updateIndicator(indicator.id, "name", e.target.value)}
                      placeholder="输入一级指标名称"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>二级指标</Label>
                      <Button onClick={() => addSubIndicator(indicator.id)} type="button" variant="outline" size="sm">
                        <PlusCircle className="mr-1 h-4 w-4" />
                        添加二级指标
                      </Button>
                    </div>
                    
                    {indicator.subIndicators.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        尚未添加二级指标，点击上方按钮添加
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {indicator.subIndicators.map((subIndicator, subIndex) => (
                          <div key={subIndicator.id} className="flex items-center space-x-4 p-2 border rounded-md bg-muted/40">
                            <div className="flex-grow space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground min-w-[20px]">{subIndex + 1}.</span>
                                <Input
                                  value={subIndicator.name}
                                  onChange={(e) => updateSubIndicator(indicator.id, subIndicator.id, "name", e.target.value)}
                                  placeholder="输入二级指标名称"
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 min-w-[160px]">
                              <span className="text-sm text-muted-foreground">分值:</span>
                              <Input
                                value={subIndicator.score}
                                onChange={(e) => updateSubIndicator(indicator.id, subIndicator.id, "score", parseInt(e.target.value) || 0)}
                                className="w-16 h-8"
                                type="number"
                                min="0"
                                max="100"
                              />
                              <Button 
                                onClick={() => removeSubIndicator(indicator.id, subIndicator.id)} 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="minPassingScore">最低通过分数</Label>
            <Input
              id="minPassingScore"
              value={formValues.minPassingScore}
              onChange={(e) => handleChange("minPassingScore", parseInt(e.target.value) || 0)}
              className="w-20 ml-2"
              type="number"
              min="0"
              max="100"
            />
          </div>
          <div className="py-2">
            <Slider 
              value={[formValues.minPassingScore || 0]} 
              onValueChange={(value) => handleChange("minPassingScore", value[0])}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染直接打分配置
  const renderDirectScoreConfig = () => {
    const maxScore = formValues.type === "directScore10" ? 10 : 100;
    const defaultPassing = formValues.type === "directScore10" ? 6 : 60;
    
    return (
      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="minPassingScore">最低通过分数</Label>
            <Input
              id="minPassingScore"
              value={formValues.minPassingScore || defaultPassing}
              onChange={(e) => handleChange("minPassingScore", parseInt(e.target.value) || defaultPassing)}
              className="w-20 ml-2"
              type="number"
              min="0"
              max={maxScore}
            />
          </div>
          <div className="py-2">
            <Slider 
              value={[formValues.minPassingScore || defaultPassing]} 
              onValueChange={(value) => handleChange("minPassingScore", value[0])}
              max={maxScore}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              {maxScore === 100 && <span>50</span>}
              <span>{maxScore}</span>
            </div>
          </div>
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>评分说明</AlertTitle>
          <AlertDescription>
            评审专家将直接给出{maxScore}分制的评分结果，当分数达到或超过{formValues.minPassingScore || defaultPassing}分时为通过。
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  // 渲染直接评级配置
  const renderDirectGradeConfig = () => {
    return (
      <div className="space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">评级配置</h3>
          <Button onClick={addGrade} type="button" variant="outline" size="sm">
            <PlusCircle className="mr-1 h-4 w-4" />
            添加等级
          </Button>
        </div>

        <div className="space-y-3">
          {formValues.grades?.map((grade, index) => (
            <Card key={grade.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4 border-b bg-muted/50">
                  <div className="flex items-center space-x-3 flex-grow">
                    <MoveVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`grade-name-${grade.id}`}>等级名称:</Label>
                      <Input
                        id={`grade-name-${grade.id}`}
                        value={grade.name}
                        onChange={(e) => updateGrade(grade.id, "name", e.target.value)}
                        className="w-24 h-8"
                        placeholder="如 A/B/C"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`grade-order-${grade.id}`}>排序:</Label>
                      <Input
                        id={`grade-order-${grade.id}`}
                        value={grade.order}
                        onChange={(e) => updateGrade(grade.id, "order", parseInt(e.target.value) || 0)}
                        className="w-16 h-8"
                        type="number"
                        min="1"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => removeGrade(grade.id)} 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`grade-desc-${grade.id}`}>等级描述</Label>
                    <Textarea
                      id={`grade-desc-${grade.id}`}
                      value={grade.description}
                      onChange={(e) => updateGrade(grade.id, "description", e.target.value)}
                      placeholder="请详细描述该等级的评价标准..."
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 渲染直接通过/不通过配置
  const renderDirectPassFailConfig = () => {
    return (
      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="passingCriteria">结果判定依据</Label>
          <Textarea
            id="passingCriteria"
            value={formValues.passingCriteria}
            onChange={(e) => handleChange("passingCriteria", e.target.value)}
            placeholder="请输入判定通过或不通过的具体依据和标准..."
            rows={4}
          />
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>评审说明</AlertTitle>
          <AlertDescription>
            评审专家将根据上述判定依据，直接给出通过或不通过的评审结果。
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
       <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">方案基本信息</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
              评审方案名称 <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="name"
            value={formValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
              placeholder="请输入评审方案名称，如：[项目名称] 评审方案"
            className={cn(
              validationErrors?.["名称"] && "border-destructive"
            )}
          />
          {validationErrors?.["名称"] && (
              <p className="text-xs text-destructive mt-1">请输入评审方案名称</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectType" className="flex items-center">
            适用项目类型 <span className="text-destructive ml-1">*</span>
          </Label>
          <Select 
            value={formValues.projectType} 
            onValueChange={(value) => handleChange("projectType", value)}
          >
            <SelectTrigger 
              id="projectType"
              className={cn(
                validationErrors?.["项目类型"] && "border-destructive"
              )}
            >
              <SelectValue placeholder="请选择适用项目类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="纵向科研项目">纵向科研项目</SelectItem>
              <SelectItem value="横向科研项目">横向科研项目</SelectItem>
              <SelectItem value="教学改革项目">教学改革项目</SelectItem>
              <SelectItem value="实验室建设项目">实验室建设项目</SelectItem>
              <SelectItem value="学科建设项目">学科建设项目</SelectItem>
              <SelectItem value="校级科研项目">校级科研项目</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors?.["项目类型"] && (
            <p className="text-xs text-destructive mt-1">请选择适用项目类型</p>
          )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireComments">评审意见必须填写</Label>
              <Switch
                id="requireComments"
                checked={formValues.requireComments}
                onCheckedChange={(checked) => handleChange("requireComments", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              开启后，评审人员在提交评审结果时必须填写评审意见
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isEnabled">评审方案状态</Label>
              <Switch
                id="isEnabled"
                checked={formValues.isEnabled}
                onCheckedChange={(checked) => handleChange("isEnabled", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {formValues.isEnabled ? "当前状态：启用中，评审计划可以选择该方案" : "当前状态：禁用中，评审计划无法选择该方案"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center">
            评审方案描述
          </Label>
          <Textarea
            id="description"
            value={formValues.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="请输入评审方案的详细描述，包括评审目的、适用范围、评审重点等..."
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
      <div className="text-blue-500">
                <InfoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-medium">评审类型配置</h3>
        </div>
        
        <div className="space-y-4">

          <RadioGroup 
            value={formValues.type} 
            onValueChange={(value) => handleChange("type", value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-start space-x-2 p-3 border rounded-md">
              <RadioGroupItem value="indicatorScoring" id="indicatorScoring" />
              <Label htmlFor="indicatorScoring" className="font-normal">按评审指标打分</Label>
            </div>
            <div className="flex items-start space-x-2 p-3 border rounded-md">
              <RadioGroupItem value="directScore10" id="directScore10" />
              <Label htmlFor="directScore10" className="font-normal">直接给出评审结果分（十分制）</Label>
            </div>
            <div className="flex items-start space-x-2 p-3 border rounded-md">
              <RadioGroupItem value="directScore100" id="directScore100" />
              <Label htmlFor="directScore100" className="font-normal">直接给出评审结果分（百分制）</Label>
            </div>
            <div className="flex items-start space-x-2 p-3 border rounded-md">
              <RadioGroupItem value="directGrade" id="directGrade" />
              <Label htmlFor="directGrade" className="font-normal">直接给出评审等级（A/B/C）</Label>
            </div>
            <div className="flex items-start space-x-2 p-3 border rounded-md">
              <RadioGroupItem value="directPassFail" id="directPassFail" />
              <Label htmlFor="directPassFail" className="font-normal">直接给出评审结果（通过/不通过）</Label>
            </div>
          </RadioGroup>
        </div>

        {/* 根据评审类型显示不同的配置界面 */}
        {renderConfigByType()}
      </div>

    </div>
  );
} 