// AI推荐系统核心逻辑
import { format, addDays, isBefore, isAfter, addHours, differenceInHours } from "date-fns"

// 模拟历史预约数据
const mockHistoricalData = [
  // 周一数据
  { dayOfWeek: 1, hour: 9, usageCount: 45, avgDuration: 2 },
  { dayOfWeek: 1, hour: 10, usageCount: 38, avgDuration: 2.5 },
  { dayOfWeek: 1, hour: 11, usageCount: 42, avgDuration: 2 },
  { dayOfWeek: 1, hour: 14, usageCount: 55, avgDuration: 3 },
  { dayOfWeek: 1, hour: 15, usageCount: 48, avgDuration: 2.5 },
  { dayOfWeek: 1, hour: 16, usageCount: 35, avgDuration: 2 },
  // 周二数据
  { dayOfWeek: 2, hour: 9, usageCount: 28, avgDuration: 2 },
  { dayOfWeek: 2, hour: 10, usageCount: 35, avgDuration: 2.5 },
  { dayOfWeek: 2, hour: 11, usageCount: 32, avgDuration: 2 },
  { dayOfWeek: 2, hour: 14, usageCount: 41, avgDuration: 3 },
  { dayOfWeek: 2, hour: 15, usageCount: 38, avgDuration: 2.5 },
  { dayOfWeek: 2, hour: 16, usageCount: 25, avgDuration: 2 },
  // 周三数据
  { dayOfWeek: 3, hour: 9, usageCount: 32, avgDuration: 2 },
  { dayOfWeek: 3, hour: 10, usageCount: 29, avgDuration: 2.5 },
  { dayOfWeek: 3, hour: 11, usageCount: 35, avgDuration: 2 },
  { dayOfWeek: 3, hour: 14, usageCount: 48, avgDuration: 3 },
  { dayOfWeek: 3, hour: 15, usageCount: 44, avgDuration: 2.5 },
  { dayOfWeek: 3, hour: 16, usageCount: 31, avgDuration: 2 },
  // 周四数据
  { dayOfWeek: 4, hour: 9, usageCount: 41, avgDuration: 2 },
  { dayOfWeek: 4, hour: 10, usageCount: 47, avgDuration: 2.5 },
  { dayOfWeek: 4, hour: 11, usageCount: 39, avgDuration: 2 },
  { dayOfWeek: 4, hour: 14, usageCount: 52, avgDuration: 3 },
  { dayOfWeek: 4, hour: 15, usageCount: 46, avgDuration: 2.5 },
  { dayOfWeek: 4, hour: 16, usageCount: 33, avgDuration: 2 },
  // 周五数据
  { dayOfWeek: 5, hour: 9, usageCount: 38, avgDuration: 2 },
  { dayOfWeek: 5, hour: 10, usageCount: 42, avgDuration: 2.5 },
  { dayOfWeek: 5, hour: 11, usageCount: 36, avgDuration: 2 },
  { dayOfWeek: 5, hour: 14, usageCount: 49, avgDuration: 3 },
  { dayOfWeek: 5, hour: 15, usageCount: 41, avgDuration: 2.5 },
  { dayOfWeek: 5, hour: 16, usageCount: 28, avgDuration: 2 },
]

// 模拟用户历史预约数据
const mockUserHistory = [
  { 
    date: new Date(2024, 2, 10, 14, 0), 
    duration: 2, 
    purpose: "材料织构分析",
    equipmentType: "X射线衍射仪"
  },
  { 
    date: new Date(2024, 2, 8, 9, 0), 
    duration: 3, 
    purpose: "残余应力测量",
    equipmentType: "X射线衍射仪"
  },
  { 
    date: new Date(2024, 2, 5, 15, 0), 
    duration: 2.5, 
    purpose: "相结构分析",
    equipmentType: "X射线衍射仪"
  },
]

// 实验类型与推荐时长的映射
const experimentDurationMap: { [key: string]: number } = {
  "材料织构分析": 2,
  "残余应力测量": 3,
  "相结构分析": 2.5,
  "晶体结构解析": 4,
  "定性分析": 1.5,
  "定量分析": 2,
  "薄膜分析": 1.5,
  "粉末衍射": 2,
  "单晶衍射": 4,
  "小角散射": 3,
}

export interface TimeRecommendation {
  date: Date
  startTime: string
  endTime: string
  score: number
  reason: string
  conflictLevel: 'none' | 'low' | 'medium' | 'high'
  historicalUsage: number
}

export interface ConflictDetection {
  hasConflict: boolean
  conflictType: 'time_overlap' | 'back_to_back' | 'same_day_overload' | 'none'
  message: string
  suggestion: string
}

export interface DurationSuggestion {
  recommended: number
  min: number
  max: number
  reason: string
  basedOn: 'experiment_type' | 'user_history' | 'equipment_average'
}

// 获取最佳时间推荐
export function getBestTimeRecommendations(
  startDate: Date,
  endDate: Date,
  equipmentType: string,
  existingBookings: any[] = [],
  userPreferences?: {
    preferredTimeSlots?: string[]
    avoidTimeSlots?: string[]
    preferredDays?: number[]
  }
): TimeRecommendation[] {
  const recommendations: TimeRecommendation[] = []
  const current = new Date(startDate)

  while (isBefore(current, endDate) || current.getTime() === endDate.getTime()) {
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay() // 转换为周一=1的格式
    
    // 跳过周末（如果需要）
    if (dayOfWeek === 6 || dayOfWeek === 7) {
      current.setDate(current.getDate() + 1)
      continue
    }

    // 获取当天的历史使用数据
    const dayHistoricalData = mockHistoricalData.filter(d => d.dayOfWeek === dayOfWeek)
    
    for (const timeSlot of dayHistoricalData) {
      const slotDate = new Date(current)
      slotDate.setHours(timeSlot.hour, 0, 0, 0)
      
      // 检查是否已被预约
      const isBooked = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startDate)
        return bookingStart.getTime() === slotDate.getTime()
      })

      if (!isBooked && slotDate > new Date()) {
        // 计算推荐分数（空闲率越高分数越高）
        const maxUsage = Math.max(...mockHistoricalData.map(d => d.usageCount))
        const freeRate = 1 - (timeSlot.usageCount / maxUsage)
        let score = freeRate * 100

        // 根据用户偏好调整分数
        if (userPreferences?.preferredTimeSlots?.includes(format(slotDate, 'HH:mm'))) {
          score += 20
        }
        if (userPreferences?.avoidTimeSlots?.includes(format(slotDate, 'HH:mm'))) {
          score -= 30
        }
        if (userPreferences?.preferredDays?.includes(dayOfWeek)) {
          score += 10
        }

        const endTime = new Date(slotDate)
        endTime.setHours(slotDate.getHours() + Math.floor(timeSlot.avgDuration))
        endTime.setMinutes((timeSlot.avgDuration % 1) * 60)

        recommendations.push({
          date: new Date(slotDate),
          startTime: format(slotDate, 'HH:mm'),
          endTime: format(endTime, 'HH:mm'),
          score: Math.round(score),
          reason: `历史空闲率${Math.round(freeRate * 100)}%，推荐使用${timeSlot.avgDuration}小时`,
          conflictLevel: timeSlot.usageCount > 40 ? 'medium' : timeSlot.usageCount > 30 ? 'low' : 'none',
          historicalUsage: timeSlot.usageCount
        })
      }
    }

    current.setDate(current.getDate() + 1)
  }

  // 按分数排序并返回前10个推荐
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

// 检测时间冲突
export function detectConflicts(
  selectedSlots: { start: Date; end: Date }[],
  userHistory: any[] = mockUserHistory
): ConflictDetection {
  if (selectedSlots.length === 0) {
    return {
      hasConflict: false,
      conflictType: 'none',
      message: '',
      suggestion: ''
    }
  }

  // 检查时间重叠
  for (let i = 0; i < selectedSlots.length - 1; i++) {
    for (let j = i + 1; j < selectedSlots.length; j++) {
      const slot1 = selectedSlots[i]
      const slot2 = selectedSlots[j]
      
      if (
        (isBefore(slot1.start, slot2.end) && isAfter(slot1.end, slot2.start)) ||
        (isBefore(slot2.start, slot1.end) && isAfter(slot2.end, slot1.start))
      ) {
        return {
          hasConflict: true,
          conflictType: 'time_overlap',
          message: '选择的时间段存在重叠',
          suggestion: '请调整时间段避免重叠，或合并为一个连续时段'
        }
      }
    }
  }

  // 检查背靠背预约（可能造成疲劳）
  const sortedSlots = [...selectedSlots].sort((a, b) => a.start.getTime() - b.start.getTime())
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const gap = differenceInHours(sortedSlots[i + 1].start, sortedSlots[i].end)
    if (gap === 0) {
      return {
        hasConflict: true,
        conflictType: 'back_to_back',
        message: '存在连续的预约时段',
        suggestion: '建议在连续使用之间安排15-30分钟的间隙进行设备检查和休息'
      }
    }
  }

  // 检查单日过载（一天使用超过6小时）
  const dailyUsage = new Map<string, number>()
  selectedSlots.forEach(slot => {
    const dateKey = format(slot.start, 'yyyy-MM-dd')
    const duration = differenceInHours(slot.end, slot.start)
    dailyUsage.set(dateKey, (dailyUsage.get(dateKey) || 0) + duration)
  })

  for (const [date, hours] of dailyUsage) {
    if (hours > 6) {
      return {
        hasConflict: true,
        conflictType: 'same_day_overload',
        message: `${date} 当天使用时间过长 (${hours}小时)`,
        suggestion: '建议将长时间实验分散到多天进行，以保证实验质量和设备维护'
      }
    }
  }

  return {
    hasConflict: false,
    conflictType: 'none',
    message: '未检测到时间冲突',
    suggestion: ''
  }
}

// 获取使用时长建议
export function getDurationSuggestion(
  experimentType: string,
  equipmentType: string,
  userHistory: any[] = mockUserHistory
): DurationSuggestion {
  // 基于实验类型的建议
  if (experimentDurationMap[experimentType]) {
    const recommended = experimentDurationMap[experimentType]
    return {
      recommended,
      min: recommended * 0.7,
      max: recommended * 1.5,
      reason: `基于"${experimentType}"的典型实验时长`,
      basedOn: 'experiment_type'
    }
  }

  // 基于用户历史的建议
  const userExperiments = userHistory.filter(h => 
    h.purpose === experimentType || h.equipmentType === equipmentType
  )
  
  if (userExperiments.length > 0) {
    const avgDuration = userExperiments.reduce((sum, exp) => sum + exp.duration, 0) / userExperiments.length
    return {
      recommended: Math.round(avgDuration * 10) / 10,
      min: avgDuration * 0.8,
      max: avgDuration * 1.3,
      reason: `基于您的历史使用记录（${userExperiments.length}次）`,
      basedOn: 'user_history'
    }
  }

  // 基于设备平均使用时长
  const equipmentAvg = mockHistoricalData.reduce((sum, data) => sum + data.avgDuration, 0) / mockHistoricalData.length
  return {
    recommended: Math.round(equipmentAvg * 10) / 10,
    min: equipmentAvg * 0.6,
    max: equipmentAvg * 2,
    reason: '基于该设备的平均使用时长',
    basedOn: 'equipment_average'
  }
}

// 获取使用率热力图数据
export function getUsageHeatmapData(): Array<{
  day: string
  hour: number
  usage: number
  level: 'low' | 'medium' | 'high' | 'very_high'
}> {
  const heatmapData: Array<{
    day: string
    hour: number
    usage: number
    level: 'low' | 'medium' | 'high' | 'very_high'
  }> = []

  const dayNames = ['周一', '周二', '周三', '周四', '周五']
  
  for (let dayIndex = 1; dayIndex <= 5; dayIndex++) {
    const dayData = mockHistoricalData.filter(d => d.dayOfWeek === dayIndex)
    
    for (const timeSlot of dayData) {
      let level: 'low' | 'medium' | 'high' | 'very_high' = 'low'
      if (timeSlot.usageCount > 50) level = 'very_high'
      else if (timeSlot.usageCount > 40) level = 'high'
      else if (timeSlot.usageCount > 30) level = 'medium'
      
      heatmapData.push({
        day: dayNames[dayIndex - 1],
        hour: timeSlot.hour,
        usage: timeSlot.usageCount,
        level
      })
    }
  }

  return heatmapData
} 