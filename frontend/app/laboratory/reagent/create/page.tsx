"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft, CircleAlert } from "lucide-react"

export default function CreateReagentPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          className="mr-2"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">新增试剂</h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                填写试剂的基本信息，带 <span className="text-destructive">*</span> 为必填项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    试剂名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" placeholder="输入试剂中文名称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="englishName">英文名称</Label>
                  <Input id="englishName" placeholder="输入试剂英文名称" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    试剂类型 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择试剂类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chemical">化学试剂</SelectItem>
                      <SelectItem value="biological">生物试剂</SelectItem>
                      <SelectItem value="analytical">分析试剂</SelectItem>
                      <SelectItem value="medical">医用试剂</SelectItem>
                      <SelectItem value="standard">标准品</SelectItem>
                      <SelectItem value="stain">染色剂</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specification">
                    规格 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="specification" placeholder="如: HPLC级, 500mL" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="casNumber">CAS号</Label>
                  <Input id="casNumber" placeholder="如: 67-56-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catalogNumber">
                    目录号 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="catalogNumber" placeholder="如: MT-4000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  placeholder="输入试剂的用途、特性等描述信息"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 供应信息 */}
          <Card>
            <CardHeader>
              <CardTitle>供应信息</CardTitle>
              <CardDescription>
                填写试剂的生产和供应信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">生产厂商</Label>
                  <Input id="manufacturer" placeholder="如: Sigma-Aldrich" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    供应商 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="supplier" placeholder="如: 国药试剂" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">
                    购置日期 <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "yyyy/MM/dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">
                    有效期至 <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "yyyy/MM/dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    价格 (元) <span className="text-destructive">*</span>
                  </Label>
                  <Input id="price" type="number" placeholder="输入价格" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">
                    所属部门 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">生物实验室</SelectItem>
                      <SelectItem value="chemistry">化学实验室</SelectItem>
                      <SelectItem value="physics">物理实验室</SelectItem>
                      <SelectItem value="pharmacy">药学实验室</SelectItem>
                      <SelectItem value="material">材料实验室</SelectItem>
                      <SelectItem value="analysis">分析实验室</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 存储信息 */}
          <Card>
            <CardHeader>
              <CardTitle>存储信息</CardTitle>
              <CardDescription>
                填写试剂的存储条件和库存信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    存放位置 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择存放位置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refrigeratorA">A栋冰箱</SelectItem>
                      <SelectItem value="cabinetB">B栋试剂柜</SelectItem>
                      <SelectItem value="hazardousCabinetC">C栋危化品柜</SelectItem>
                      <SelectItem value="rackD">D栋常温架</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageCondition">
                    存储条件 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择存储条件" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roomTemp">常温</SelectItem>
                      <SelectItem value="4C">4℃</SelectItem>
                      <SelectItem value="-20C">-20℃</SelectItem>
                      <SelectItem value="-80C">-80℃</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dangerLevel">危险等级</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择危险等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">
                    库存状态 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择库存状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="lowStock">低库存</SelectItem>
                      <SelectItem value="unused">未入库</SelectItem>
                      <SelectItem value="pending">待检验</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialAmount">
                    初始数量 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="initialAmount" type="number" placeholder="输入数量" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">
                    当前库存 <span className="text-destructive">*</span>
                  </Label>
                  <Input id="currentAmount" type="number" placeholder="输入数量" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">
                    单位 <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择单位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="ug">μg</SelectItem>
                      <SelectItem value="unit">单位</SelectItem>
                      <SelectItem value="test">测试</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">注意事项</Label>
                <Textarea
                  id="notes"
                  placeholder="输入试剂使用时的注意事项、安全警告等"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 管理信息 */}
          <Card>
            <CardHeader>
              <CardTitle>管理信息</CardTitle>
              <CardDescription>
                填写试剂的管理和文档信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manager">
                  负责人 <span className="text-destructive">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">张七 (实验室管理员)</SelectItem>
                    <SelectItem value="user2">李三 (试剂管理员)</SelectItem>
                    <SelectItem value="user3">王五 (实验室主任)</SelectItem>
                    <SelectItem value="user4">李四 (技术员)</SelectItem>
                    <SelectItem value="user5">赵六 (技术员)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msdsFile">MSDS文件</Label>
                <Input id="msdsFile" type="file" />
                <p className="text-sm text-muted-foreground mt-1">
                  上传试剂的物质安全数据表 (MSDS)
                </p>
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <CircleAlert className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">安全提示</p>
                  <p>
                    对于危险等级为"高"的试剂，请确保已上传MSDS文件，并将试剂存放在指定的危化品柜中。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </div>
  )
} 