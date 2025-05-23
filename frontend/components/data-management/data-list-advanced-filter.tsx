import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { DatePicker } from "../ui/date-picker"
import { MemberSelect } from "../ui/member-select"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, Trash, RotateCw, Loader2, Save, BookTemplate, GripVertical, Group, Layers } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Define comparison operators
const comparisonOperators = [
  { value: "=", label: "等于" },
  { value: "!=", label: "不等于" },
  { value: ">", label: "大于" },
  { value: "<", label: "小于" },
  { value: ">=", label: "大于等于" },
  { value: "<=", label: "小于等于" },
  { value: "contains", label: "包含" },
  { value: "notContains", label: "不包含" },
  { value: "startsWith", label: "开头是" },
  { value: "endsWith", label: "结尾是" },
  { value: "isEmpty", label: "为空" },
  { value: "isNotEmpty", label: "不为空" },
  // Add more operators as needed, potentially based on field type
] as const;

type ComparisonOperator = typeof comparisonOperators[number]['value'];

interface FilterTemplate {
  id: string
  name: string
  groupOperator: "and" | "or"
  groups: ConditionGroup[]
  isDefault?: boolean
}

const defaultTemplates: FilterTemplate[] = [
  {
    id: "default",
    name: "默认模板",
    groupOperator: "and",
    groups: [{ id: `group-${Date.now()}`, conditions: [{ id: `1-${Date.now()}`, fieldId: "", value: "", operator: "and", compareType: "=" }] }],
    isDefault: true
  }
]

interface SeniorFilterDTO {
  groupOperator: "and" | "or"
  groups: Array<{
    conditions: Array<{
      fieldId: string
      value: any
      compareType: ComparisonOperator
      operator: "and" | "or"
    }>
  }>
}

export type { SeniorFilterDTO }

interface Field {
  id: string
  label: string
  type: "text" | "date" | "number" | "select" | "member"
  options?: { value: string; label: string }[]
  placeholder?: string
  category?: string
}

interface FilterCondition {
  id: string
  fieldId: string
  value: any
  operator: "and" | "or"
  compareType: ComparisonOperator
}

interface ConditionGroup {
  id: string
  conditions: FilterCondition[]
}

export interface DataListAdvancedFilterProps {
  open: boolean
  seniorFilterValues?: SeniorFilterDTO
  onOpenChange: (open: boolean) => void
  categories?: {
    id: string
    title: string
    fields: Field[]
  }[]
  onFilter: (filters: SeniorFilterDTO) => void
  onReset: () => void
  hasActiveFilters?: boolean
}

export function DataListAdvancedFilter({
  open,
  seniorFilterValues,
  onOpenChange,
  categories = [],
  onFilter,
  onReset,
  hasActiveFilters = false
}: DataListAdvancedFilterProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [templates, setTemplates] = useState<FilterTemplate[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<FilterTemplate>(defaultTemplates[0])
  const [isTemplatePopoverOpen, setIsTemplatePopoverOpen] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [isSaveAsTemplate, setIsSaveAsTemplate] = useState(false)
  const [groups, setGroups] = useState<ConditionGroup[]>(defaultTemplates[0].groups)
  const [groupOperator, setGroupOperator] = useState<"and" | "or">(defaultTemplates[0].groupOperator)
  
  const allFields = useMemo(() => 
    categories.flatMap(category => 
      category.fields.map(field => ({
        ...field,
        category: category.title
      }))
    )
  , [categories])

  const generateUniqueId = (prefix: string = 'id'): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddGroup = () => {
    const newGroupId = generateUniqueId('group')
    const firstConditionId = generateUniqueId(`cond-${newGroupId}`)
    const newGroup: ConditionGroup = {
      id: newGroupId,
      conditions: [{
        id: firstConditionId,
        fieldId: allFields[0]?.id || "",
        value: "",
        operator: "and",
        compareType: "="
      }]
    }
    setGroups([...groups, newGroup])
  }

  const handleRemoveGroup = (groupIdToRemove: string) => {
    if (groups.length <= 1) return
    setGroups(groups.filter(g => g.id !== groupIdToRemove))
  }

  const handleAddCondition = (groupId: string) => {
    const newConditionId = generateUniqueId(`cond-${groupId}`)
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [
            ...group.conditions,
            {
              id: newConditionId,
              fieldId: allFields[0]?.id || "",
              value: "",
              operator: "and",
              compareType: "="
            }
          ]
        }
      }
      return group
    }))
  }

  const handleRemoveCondition = (groupId: string, conditionIdToRemove: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        if (group.conditions.length <= 1) return group
        return {
          ...group,
          conditions: group.conditions.filter(c => c.id !== conditionIdToRemove)
        }
      }
      return group
    }).filter(group => group.conditions.length > 0))
  }

  const updateConditionProperty = <K extends keyof FilterCondition>(
    groupId: string,
    conditionId: string,
    property: K,
    value: FilterCondition[K]
  ) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(c =>
            c.id === conditionId ? { ...c, [property]: value } : c
          )
        }
      }
      return group
    }))
  }

  const handleFieldChange = (groupId: string, conditionId: string, fieldId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(c =>
            c.id === conditionId ? { ...c, fieldId, value: "" } : c
          )
        }
      }
      return group
    }))
  }

  const handleValueChange = (groupId: string, conditionId: string, value: any) => {
    updateConditionProperty(groupId, conditionId, 'value', value)
  }

  const handleOperatorChange = (groupId: string, conditionId: string, operator: "and" | "or") => {
    updateConditionProperty(groupId, conditionId, 'operator', operator)
  }

  const handleCompareTypeChange = (groupId: string, conditionId: string, compareType: ComparisonOperator) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(c => {
            if (c.id === conditionId) {
              const newValue = (compareType === 'isEmpty' || compareType === 'isNotEmpty') ? '' : c.value
              return { ...c, compareType, value: newValue }
            }
            return c
          })
        }
      }
      return group
    }))
  }

  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) return
    
    setIsSavingTemplate(true)
    try {
      const templateGroups = groups.map(g => ({
        ...g,
        conditions: g.conditions.map(c => ({
          ...c,
          compareType: c.compareType || '=',
          operator: c.operator || 'and'
        }))
      }))

      const newTemplate: FilterTemplate = {
        id: generateUniqueId('template'),
        name: newTemplateName.trim(),
        groupOperator: groupOperator,
        groups: templateGroups,
        isDefault: false
      }

      const otherTemplates = templates.filter(t => !t.isDefault)
      const updatedTemplates = [defaultTemplates[0], ...otherTemplates, newTemplate]

      setTemplates(updatedTemplates)
      setSelectedTemplate(newTemplate)
      setNewTemplateName("")
      setIsSaveAsTemplate(false)
    } finally {
      setIsSavingTemplate(false)
    }
  }

  const handleLoadTemplate = (template: FilterTemplate) => {
    setSelectedTemplate(template)
    setGroups(template.groups.map(g => ({
      ...g,
      id: g.id || generateUniqueId('group'),
      conditions: g.conditions.map(c => ({
        ...c,
        id: c.id || generateUniqueId('cond'),
        compareType: c.compareType || '=',
        operator: c.operator || 'and'
      }))
    })))
    setGroupOperator(template.groupOperator || 'and')
    setIsTemplatePopoverOpen(false)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (templateId === 'default') return
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(updatedTemplates)
    if (selectedTemplate.id === templateId) {
      handleLoadTemplate(defaultTemplates[0])
    }
  }

  const renderValueInput = (groupId: string, condition: FilterCondition) => {
    const field = allFields.find(f => f.id === condition.fieldId)
    
    if (!field) return null

    // Hide value input if operator is isEmpty or isNotEmpty
    if (condition.compareType === 'isEmpty' || condition.compareType === 'isNotEmpty') {
        return <Input disabled className="bg-muted/50" placeholder="无需填写值" />;
    }

    switch (field.type) {
      case "text":
        return (
          <Input
            value={condition.value || ""}
            onChange={(e) => handleValueChange(groupId, condition.id, e.target.value)}
            placeholder={field.placeholder}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={condition.value || ""}
            onChange={(e) => handleValueChange(groupId, condition.id, e.target.value)}
            placeholder={field.placeholder}
          />
        )
      case "select":
        return (
          <Select value={condition.value} onValueChange={(value) => handleValueChange(groupId, condition.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "date":
        return (
          <DatePicker
            value={condition.value}
            onChange={(date) => handleValueChange(groupId, condition.id, date)}
          />
        )
      case "member":
        return (
          <MemberSelect
            value={condition.value}
            onChange={(member) => handleValueChange(groupId, condition.id, member)}
            placeholder={field.placeholder}
          />
        )
      default:
        return null
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    
    const filters: SeniorFilterDTO = {
      groupOperator: groupOperator,
      groups: groups.map(group => ({
        conditions: group.conditions
          .filter(c => c.fieldId && (c.compareType === 'isEmpty' || c.compareType === 'isNotEmpty' || (c.value !== undefined && c.value !== "")))
          .map(({ id, ...rest }) => rest)
      }))
      .filter(group => group.conditions.length > 0)
    };
    
    try {
      await onFilter(filters);
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    const defaultTpl = defaultTemplates[0];
    const initialGroups = JSON.parse(JSON.stringify(defaultTpl.groups));
    initialGroups.forEach((g: ConditionGroup) => {
        g.id = generateUniqueId('group');
        g.conditions.forEach((c: FilterCondition) => {
            c.id = generateUniqueId('cond');
            c.fieldId = allFields[0]?.id || "";
        });
    });

    setGroups(initialGroups);
    setGroupOperator(defaultTpl.groupOperator);
    setSelectedTemplate(defaultTpl);
    onReset();
  }

  useEffect(() => {
    if (open) {
      if (seniorFilterValues && seniorFilterValues.groups && seniorFilterValues.groups.length > 0) {
         const initialGroups = seniorFilterValues.groups.map((g, groupIndex) => ({
           id: generateUniqueId(`group-init-${groupIndex}`),
           conditions: g.conditions.map((c, condIndex) => ({
             id: generateUniqueId(`cond-init-${groupIndex}-${condIndex}`),
             fieldId: c.fieldId || "",
             value: c.value,
             operator: c.operator || 'and',
             compareType: c.compareType || '='
           })).filter(c => c.fieldId && (c.compareType === 'isEmpty' || c.compareType === 'isNotEmpty' || (c.value !== undefined && c.value !== "")))
         })).filter(g => g.conditions.length > 0);

         if(initialGroups.length > 0) {
            setGroups(initialGroups);
            setGroupOperator(seniorFilterValues.groupOperator || 'and');
         } else {
            handleReset();
         }
      } else {
        handleReset();
      }
      const matchingTemplate = templates.find(t =>
          JSON.stringify(t.groups) === JSON.stringify(groups) && t.groupOperator === groupOperator
      );
      setSelectedTemplate(matchingTemplate || defaultTemplates[0]);
    }
  }, [open, seniorFilterValues, categories]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    if (draggableId.startsWith('cond-')) {
        const sourceGroupId = source.droppableId;
        const destGroupId = destination.droppableId;

        setGroups(currentGroups => {
            const sourceGroup = currentGroups.find(g => g.id === sourceGroupId);
            const destGroup = currentGroups.find(g => g.id === destGroupId);

            if (!sourceGroup || !destGroup) return currentGroups;

            const sourceConditions = Array.from(sourceGroup.conditions);
            const [movedCondition] = sourceConditions.splice(source.index, 1);

            if (sourceGroupId === destGroupId) {
                sourceConditions.splice(destination.index, 0, movedCondition);
                return currentGroups.map(g =>
                    g.id === sourceGroupId ? { ...g, conditions: sourceConditions } : g
                );
            } else {
                const destConditions = Array.from(destGroup.conditions);
                destConditions.splice(destination.index, 0, movedCondition);
                return currentGroups.map(g => {
                    if (g.id === sourceGroupId) return { ...g, conditions: sourceConditions };
                    if (g.id === destGroupId) return { ...g, conditions: destConditions };
                    return g;
                });
            }
        });
    }
  };

  const canConfirm = useMemo(() => {
      return groups.some(group =>
          group.conditions.some(c => c.fieldId && (c.compareType === 'isEmpty' || c.compareType === 'isNotEmpty' || (c.value !== undefined && c.value !== "")))
      );
  }, [groups]);

  const canSaveTemplate = useMemo(() => {
      return groups.some(group =>
          group.conditions.some(c => c.fieldId)
      );
  }, [groups]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between shrink-0 pr-6">
          <div className="flex-1">
            <DialogTitle>高级筛选</DialogTitle>
            <DialogDescription>
              设置一个或多个条件组，组内和组间关系（且/或）可自定义。
            </DialogDescription>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <Popover open={isTemplatePopoverOpen} onOpenChange={setIsTemplatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <BookTemplate className="h-4 w-4 mr-2" />
                  {selectedTemplate.name}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="end">
                <div className="px-3 py-2 border-b">
                  <h4 className="text-sm font-medium">选择模板</h4>
                </div>
                <ScrollArea className="h-[280px]">
                  <div className="p-2">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                          selectedTemplate.id === template.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted/50 cursor-pointer'
                        }`}
                         onClick={() => handleLoadTemplate(template)}
                      >
                        <span className="flex-1 text-left mr-2 truncate" title={template.name}>
                          {template.name}
                        </span>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                            title="删除模板"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-1 py-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-4 px-4 py-2">
              {groups.map((group, groupIndex) => (
                <Card key={group.id} className="bg-background/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
                     <CardTitle className="text-base font-medium flex items-center">
                       <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                       条件组 {groupIndex + 1}
                     </CardTitle>
                     <div className="flex items-center space-x-1">
                       {groups.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveGroup(group.id)}
                            title="删除此条件组"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                     </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-[auto_100px_1fr_120px_1fr_auto] gap-x-3 gap-y-2 items-center px-2 py-1 bg-muted/50 rounded text-xs font-medium text-muted-foreground mb-2">
                         <div className="invisible w-4">
                            <GripVertical className="h-4 w-4" />
                         </div>
                         <div>关系</div>
                         <div>字段</div>
                         <div>比较</div>
                         <div>值</div>
                         <div className="invisible w-7">
                            <Trash className="h-4 w-4" />
                         </div>
                      </div>

                      <Droppable droppableId={group.id} type="CONDITION">
                        {(provided: DroppableProvided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                          >
                            {group.conditions.map((condition, index) => (
                              <Draggable key={condition.id} draggableId={condition.id} index={index}>
                                {(provided: DraggableProvided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center space-x-3"
                                    style={provided.draggableProps.style}
                                  >
                                    <div {...provided.dragHandleProps} className="cursor-grab py-2 opacity-60 hover:opacity-100" title="拖拽排序">
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-[100px_1fr_120px_1fr] gap-3 items-center">
                                      {index > 0 ? (
                                        <Select
                                            value={condition.operator}
                                            onValueChange={(value: "and" | "or") => handleOperatorChange(group.id, condition.id, value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="and">且 (AND)</SelectItem>
                                            <SelectItem value="or">或 (OR)</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div className="text-sm text-muted-foreground px-3 py-2.5 font-medium">(首个条件)</div>
                                      )}

                                      <Select
                                        value={condition.fieldId}
                                        onValueChange={(value) => handleFieldChange(group.id, condition.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="选择字段" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories.map((category) => (
                                            <SelectGroup key={category.id}>
                                              <SelectLabel className="text-xs text-muted-foreground font-normal pl-2 py-1 bg-muted/50">
                                                {category.title}
                                              </SelectLabel>
                                              {category.fields.map((field) => (
                                                <SelectItem
                                                  key={field.id}
                                                  value={field.id}
                                                  className="pl-4 py-1.5 text-sm"
                                                >
                                                  {field.label}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          ))}
                                            {allFields.length === 0 && <SelectItem value="" disabled>无可用字段</SelectItem>}
                                        </SelectContent>
                                      </Select>

                                      <Select
                                         value={condition.compareType}
                                         onValueChange={(value: ComparisonOperator) => handleCompareTypeChange(group.id, condition.id, value)}
                                         disabled={!condition.fieldId}
                                       >
                                        <SelectTrigger className="w-[110px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {comparisonOperators.map(op => (
                                            <SelectItem key={op.value} value={op.value}>
                                              {op.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>

                                      {renderValueInput(group.id, condition)}
                                    </div>

                                    {group.conditions.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemoveCondition(group.id, condition.id)}
                                        title="删除此条件"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    )}
                                     {group.conditions.length <= 1 && (
                                       <div className="w-7 h-7"></div>
                                     )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                     <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 text-sm"
                        onClick={() => handleAddCondition(group.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        在此组内添加条件
                      </Button>
                  </CardContent>

                   {groupIndex < groups.length - 1 && (
                     <div className="relative px-4">
                       <Separator />
                       <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2">
                           <Select value={groupOperator} onValueChange={(value: "and" | "or") => setGroupOperator(value)}>
                                <SelectTrigger className="w-[100px] h-7 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="and">且 (AND)</SelectItem>
                                    <SelectItem value="or">或 (OR)</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                     </div>
                   )}

                </Card>
              ))}

               <Button variant="outline" className="w-full border-dashed" onClick={handleAddGroup}>
                 <Group className="h-4 w-4 mr-2" />
                 添加条件组
               </Button>
            </div>
          </DragDropContext>
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-4 px-6 pb-4 shrink-0">
          <div className="flex items-center space-x-2">
            {isSaveAsTemplate ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="输入模板名称"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-40 h-9"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim() || isSavingTemplate || !canSaveTemplate}
                  title={!canSaveTemplate ? "请至少设置一个有效条件字段" : undefined}
                >
                  {isSavingTemplate ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存模板'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSaveAsTemplate(false);
                    setNewTemplateName("");
                  }}
                >
                  取消
                </Button>
              </div>
            ) : (
               <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSaveAsTemplate(true)}
                    disabled={!canSaveTemplate}
                     title={!canSaveTemplate ? "请至少设置一个有效条件字段" : "将当前条件保存为模板"}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    保存为模板
                  </Button>
               </>
            )}
             <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCw className="h-4 w-4 mr-2" />
                重置
            </Button>
          </div>
          <Button size="sm" onClick={handleConfirm} disabled={isLoading || !canConfirm} title={!canConfirm ? "请至少设置一个有效的筛选条件" : undefined}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                搜索中...
              </>
            ) : (
              '高级搜索'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 