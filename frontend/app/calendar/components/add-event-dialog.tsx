"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock, Shuffle } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ParticipantSelector } from "./participant-selector"
import type { CalendarEvent, Student, EventType } from "../types/calendar"

// 添加颜色选项 - 所有颜色都使用实体色（非透明）
const colorOptions = [
  { value: "blue", label: "蓝色", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-600" },
  { value: "red", label: "红色", bg: "bg-red-100", text: "text-red-600", border: "border-red-600" },
  { value: "green", label: "绿色", bg: "bg-green-100", text: "text-green-600", border: "border-green-600" },
  { value: "purple", label: "紫色", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-600" },
  { value: "orange", label: "橙色", bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-600" },
  { value: "teal", label: "青色", bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-600" },
]

interface AddEventDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: Partial<CalendarEvent>) => void
  initialDate?: Date | null
  initialHour?: number | null
}

// 在 eventSchema 中添加 color 字段
const eventSchema = z.object({
  title: z.string().min(1, { message: "标题不能为空" }),
  type: z.enum(["normal", "important", "urgent"]),
  subject: z.string().min(1, { message: "类型不能为空" }),
  date: z.date({ required_error: "请选择日期" }),
  startTime: z.string().min(1, { message: "请选择开始时间" }),
  endTime: z.string().min(1, { message: "请选择结束时间" }),
  location: z.string().optional(),
  description: z.string().optional(),
  participants: z.array(z.any()).optional(),
  color: z.string().optional(),
})

const eventTypes = [
  { value: "normal", label: "普通" },
  { value: "important", label: "重要" },
  { value: "urgent", label: "紧急" },
]

const subjectTypes: EventType[] = ["研究报告", "实验讨论", "学术会议", "项目评审", "实验安排", "团队会议"]

export function AddEventDialog({ isOpen, onClose, onAddEvent, initialDate, initialHour }: AddEventDialogProps) {
  const [activeTab, setActiveTab] = useState("新增事项")
  const [selectedParticipants, setSelectedParticipants] = useState<Student[]>([])

  // 随机生成一个颜色值 - 默认使用实体色
  const getRandomColor = () => {
    const colorValues = colorOptions.map(c => c.value);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex];
  }

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: "normal",
      subject: "研究报告",
      date: initialDate || new Date(),
      startTime: initialHour ? `${initialHour.toString().padStart(2, "0")}:00` : "09:00",
      endTime: initialHour ? `${(initialHour + 1).toString().padStart(2, "0")}:00` : "10:00",
      location: "",
      description: "",
      participants: [],
      color: getRandomColor(), // 随机颜色
    },
  })

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: "",
        type: "normal",
        subject: "研究报告",
        date: initialDate || new Date(),
        startTime: initialHour ? `${initialHour.toString().padStart(2, "0")}:00` : "09:00",
        endTime: initialHour ? `${(initialHour + 1).toString().padStart(2, "0")}:00` : "10:00",
        location: "",
        description: "",
        participants: [],
        color: getRandomColor(), // 随机颜色
      })
      setSelectedParticipants([])
    }
  }, [isOpen, initialDate, initialHour, form])

  const onSubmit = (data: z.infer<typeof eventSchema>) => {
    const day = data.date.getDay()

    const newEvent: Partial<CalendarEvent> = {
      title: data.title,
      type: data.type,
      subject: data.subject as EventType, // 修复类型错误
      day,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      students: selectedParticipants,
      color: data.color, // 添加颜色字段
    }

    onAddEvent(newEvent)
  }

  // 颜色选择组件
  const ColorSelector = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {colorOptions.map((color) => (
          <div
            key={color.value}
            className={cn(
              "w-8 h-8 rounded-full cursor-pointer border-2 flex items-center justify-center transition-all",
              color.bg,
              value === color.value ? "border-gray-800" : "border-transparent"
            )}
            title={color.label}
            onClick={() => onChange(color.value)}
          >
            {value === color.value && <div className="w-2 h-2 rounded-full bg-gray-800"></div>}
          </div>
        ))}
        <div 
          className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
          title="随机颜色"
          onClick={() => onChange(getRandomColor())}
        >
          <Shuffle className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>添加新活动</DialogTitle>
          <DialogDescription>选择事项或会议日程类型并填写相关信息</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="新增事项">新增事项</TabsTrigger>
            <TabsTrigger value="新建会议">新建会议</TabsTrigger>
          </TabsList>

          <TabsContent value="新增事项" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        标题 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="请输入事项标题" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          优先级 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择优先级" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          类型 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjectTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>事项颜色</FormLabel>
                      <FormControl>
                        <ColorSelector value={field.value || "blue"} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          截止日期 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy/MM/dd", { locale: zhCN })
                                ) : (
                                  <span>选择日期</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          截止时间 <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input type="time" {...field} className="pl-10" />
                          </FormControl>
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>地点</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入事项地点" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea placeholder="请输入事项描述" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>参与人员</FormLabel>
                      <FormControl>
                        <ParticipantSelector
                          selectedParticipants={selectedParticipants}
                          onChange={(participants) => {
                            setSelectedParticipants(participants)
                            field.onChange(participants)
                          }}
                          className="mt-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    取消
                  </Button>
                  <Button type="submit">保存事项</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="新建会议" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        会议标题 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="请输入会议标题" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          优先级 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择优先级" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          会议类型 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择会议类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjectTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>会议颜色</FormLabel>
                      <FormControl>
                        <ColorSelector value={field.value || "blue"} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          日期 <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy/MM/dd", { locale: zhCN })
                                ) : (
                                  <span>选择日期</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          开始时间 <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input type="time" {...field} className="pl-10" />
                          </FormControl>
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          结束时间 <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input type="time" {...field} className="pl-10" />
                          </FormControl>
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>会议地点</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入会议地点" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>会议议程</FormLabel>
                      <FormControl>
                        <Textarea placeholder="请输入会议议程" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>参与人员</FormLabel>
                      <FormControl>
                        <ParticipantSelector
                          selectedParticipants={selectedParticipants}
                          onChange={(participants) => {
                            setSelectedParticipants(participants)
                            field.onChange(participants)
                          }}
                          className="mt-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    取消
                  </Button>
                  <Button type="submit">保存会议</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

