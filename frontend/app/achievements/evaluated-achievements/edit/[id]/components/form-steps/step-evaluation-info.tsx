"use client"

import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { EvaluatedAchievementsFormValues } from "../evaluated-achievements-form"

interface StepEvaluationInfoProps {
  form: UseFormReturn<EvaluatedAchievementsFormValues>
}

export function StepEvaluationInfo({ form }: StepEvaluationInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">鉴定信息</div>
      
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>鉴定简介<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="请输入成果鉴定简介"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                请概述成果的主要内容、创新点和应用价值等
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expertNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>专家姓名<span className="text-destructive ml-1">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="请输入鉴定专家姓名，多人用逗号分隔" {...field} />
                </FormControl>
                <FormDescription>
                  参与鉴定的专家姓名，多人请用逗号分隔
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expertTitles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>专家职称<span className="text-destructive ml-1">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="请输入鉴定专家职称，多人用逗号分隔" {...field} />
                </FormControl>
                <FormDescription>
                  与专家姓名一一对应，多人请用逗号分隔
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="expertUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>专家单位<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <Input placeholder="请输入鉴定专家所属单位，多人用逗号分隔" {...field} />
              </FormControl>
              <FormDescription>
                与专家姓名一一对应，多人请用逗号分隔
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPassed"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>是否通过鉴定<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="是" />
                    </FormControl>
                    <FormLabel className="font-normal">是</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="否" />
                    </FormControl>
                    <FormLabel className="font-normal">否</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="待定" />
                    </FormControl>
                    <FormLabel className="font-normal">待定</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 