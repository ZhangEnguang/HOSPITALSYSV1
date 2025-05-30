import { users } from "../config/consumable-config"

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// 获取当前日期
const today = new Date()
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}/${month}/${day}`
}

// 生成不同的有效期日期
const expiredDate30 = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) // 30天前过期
const expiredDate60 = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000) // 60天前过期
const soonExpiredDate15 = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000) // 15天后过期
const soonExpiredDate25 = new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000) // 25天后过期
const normalExpiredDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000) // 1年后过期
const longExpiredDate = new Date(today.getTime() + 2 * 365 * 24 * 60 * 60 * 1000) // 2年后过期

export const allDemoConsumableItems = [
  // 1. 库存充足 + 正常有效期 (可申领)
  {
    id: "cons-001",
    name: "微量离心管",
    alias: ["EP管", "eppendorf管", "离心管", "微量管"],
    model: "1.5mL透明离心管",
    category: "塑料器皿",
    description: "聚丙烯材质微量离心管，最高转速15000rpm",
    manufacturer: "艾本德",
    supplier: "德国艾本德（中国）有限公司",
    catalogNumber: "EP-15-T",
    currentStock: 810, // 81% > 50% - 库存充足
    minStock: 200,
    maxStock: 1000,
    unit: "包",
    unitPrice: 28.0,
    totalValue: 22680.0,
    location: "A栋储物柜",
    department: "生物实验室",
    status: "充足",
    expiryDate: formatDate(normalExpiredDate),
    lastUsedDate: "2023/11/20",
    manager: users[0],
    notes: "耐低温，可高温高压灭菌，适用于离心分离",
    imageUrl: "/consumables/microcentrifuge-tube.png",
  },
  // 2. 库存不足 + 即将过期 (可申领但有警告)
  {
    id: "cons-002", 
    name: "移液器吸头",
    alias: ["吸头", "枪头", "移液头", "tip头"],
    model: "200μL黄色吸头",
    category: "移液器材",
    description: "高精度移液器吸头，适用于20-200μL移液器",
    manufacturer: "艾本德",
    supplier: "德国艾本德（中国）有限公司",
    catalogNumber: "TIP-200-Y",
    currentStock: 380, // 38% < 50% - 库存不足
    minStock: 150,
    maxStock: 1000,
    unit: "盒",
    unitPrice: 52.0,
    totalValue: 19760.0,
    location: "A栋储物柜",
    department: "生物实验室",
    status: "库存不足",
    expiryDate: formatDate(soonExpiredDate15), // 即将过期
    lastUsedDate: "2023/11/19",
    manager: users[1],
    notes: "无菌包装，适用于精密移液操作",
    imageUrl: "/consumables/pipette-tips.png",
  },
  // 3. 无库存 + 正常有效期 (不可申领)
  {
    id: "cons-003",
    name: "深孔微孔板",
    alias: ["深孔板", "深井板", "储液板"],
    model: "96孔深孔板2.2mL",
    category: "培养耗材",
    description: "聚丙烯96孔深孔微孔板，单孔容量2.2mL",
    manufacturer: "康宁",
    supplier: "康宁生命科学",
    catalogNumber: "DWP-96-22",
    currentStock: 0, // 无库存
    minStock: 20,
    maxStock: 200,
    unit: "块",
    unitPrice: 28.5,
    totalValue: 0.0,
    location: "B栋试剂柜",
    department: "分子生物实验室",
    status: "缺货",
    expiryDate: formatDate(normalExpiredDate),
    lastUsedDate: "2023/11/18",
    manager: users[2],
    notes: "适用于样品储存和高通量实验",
    imageUrl: "/consumables/deep-well-plate.png",
  },
  // 4. 有库存 + 已过期 (不可申领)
  {
    id: "cons-004",
    name: "高透明度微孔板",
    alias: ["透明板", "高透板", "观察板"],
    model: "96孔高透明平底板",
    category: "培养耗材",
    description: "高透明度聚苯乙烯微孔板，适用于光学检测",
    manufacturer: "NEST",
    supplier: "无锡耐思特生物科技",
    catalogNumber: "HTP-96-FB",
    currentStock: 45, // 30% - 库存不足但仍有库存
    minStock: 15,
    maxStock: 150,
    unit: "块",
    unitPrice: 18.0,
    totalValue: 810.0,
    location: "B栋试剂柜",
    department: "分析检测实验室",
    status: "已过期",
    expiryDate: formatDate(expiredDate30), // 已过期
    lastUsedDate: "2023/11/17",
    manager: users[3],
    notes: "高透明度，适用于酶标仪检测",
    imageUrl: "/consumables/clear-microplate.png",
  },
  // 5. 库存充足 + 长期有效 (可申领)
  {
    id: "cons-005",
    name: "96孔PCR微孔板",
    alias: ["PCR板", "反应板", "扩增板"],
    model: "96孔PCR板0.2mL",
    category: "培养耗材",
    description: "聚丙烯96孔PCR反应板，薄壁设计",
    manufacturer: "赛默飞",
    supplier: "赛默飞世尔科技",
    catalogNumber: "PCR-96-02",
    currentStock: 180, // 60% > 50% - 库存充足
    minStock: 30,
    maxStock: 300,
    unit: "块",
    unitPrice: 12.5,
    totalValue: 2250.0,
    location: "B栋试剂柜",
    department: "分子生物实验室",
    status: "充足",
    expiryDate: formatDate(longExpiredDate),
    lastUsedDate: "2023/11/20",
    manager: users[4],
    notes: "薄壁设计，导热性好，适用于PCR扩增",
    imageUrl: "/consumables/pcr-plate-96.png",
  },
  // 6. 库存不足 + 正常有效期 (可申领)
  {
    id: "cons-006",
    name: "水平凝胶盒",
    alias: ["凝胶盒", "电泳盒", "琼脂糖盒"],
    model: "水平电泳槽10cm",
    category: "分析耗材",
    description: "透明丙烯酸水平凝胶电泳盒，适用于DNA分析",
    manufacturer: "北京六一",
    supplier: "北京六一生物科技",
    catalogNumber: "HGB-10-T",
    currentStock: 8, // 40% < 50% - 库存不足
    minStock: 3,
    maxStock: 20,
    unit: "套",
    unitPrice: 280.0,
    totalValue: 2240.0,
    location: "C栋专用柜",
    department: "分子生物实验室",
    status: "库存不足",
    expiryDate: formatDate(normalExpiredDate),
    lastUsedDate: "2023/11/16",
    manager: users[0],
    notes: "配有电极和梳子，适用于琼脂糖凝胶电泳",
    imageUrl: "/consumables/horizontal-gel-box.png",
  },
  // 7. 库存充足 + 即将过期 (可申领但有警告)
  {
    id: "cons-007",
    name: "通用支架",
    alias: ["试管架", "支撑架", "放置架"],
    model: "透明亚克力试管架",
    category: "通用耗材",
    description: "透明亚克力材质通用试管支架",
    manufacturer: "上海如吉",
    supplier: "上海如吉生物科技",
    catalogNumber: "UST-AC-T",
    currentStock: 35, // 58% > 50% - 库存充足
    minStock: 10,
    maxStock: 60,
    unit: "个",
    unitPrice: 35.0,
    totalValue: 1225.0,
    location: "A栋储物柜",
    department: "通用实验室",
    status: "充足",
    expiryDate: formatDate(soonExpiredDate25), // 即将过期
    lastUsedDate: "2023/11/14",
    manager: users[1],
    notes: "透明材质，易清洁，适用于各种试管",
    imageUrl: "/consumables/universal-rack.png",
  },
  // 8. 库存不足 + 正常有效期 (可申领)
  {
    id: "cons-008",
    name: "通用线性支架",
    alias: ["线性架", "排列架", "多孔架"],
    model: "4孔线性试管架",
    category: "通用耗材",
    description: "透明亚克力4孔线性试管支架",
    manufacturer: "上海如吉",
    supplier: "上海如吉生物科技",
    catalogNumber: "LST-4H-T",
    currentStock: 30, // 37.5% < 50% - 库存不足
    minStock: 12,
    maxStock: 80,
    unit: "个",
    unitPrice: 28.0,
    totalValue: 840.0,
    location: "A栋储物柜",
    department: "通用实验室",
    status: "库存不足",
    expiryDate: formatDate(normalExpiredDate),
    lastUsedDate: "2023/11/15",
    manager: users[2],
    notes: "线性排列设计，节省空间",
    imageUrl: "/consumables/linear-rack.png",
  },
  // 9. 库存充足 + 正常有效期 (可申领)
  {
    id: "cons-009",
    name: "96孔分割PCR微孔板",
    alias: ["分割板", "可拆板", "条状板"],
    model: "8×12条PCR板",
    category: "培养耗材",
    description: "可分割96孔PCR板，8条×12孔设计",
    manufacturer: "赛默飞",
    supplier: "赛默飞世尔科技",
    catalogNumber: "PCR-96-ST",
    currentStock: 120, // 60% > 50% - 库存充足
    minStock: 20,
    maxStock: 200,
    unit: "套",
    unitPrice: 15.5,
    totalValue: 1860.0,
    location: "B栋试剂柜",
    department: "分子生物实验室",
    status: "充足",
    expiryDate: formatDate(normalExpiredDate),
    lastUsedDate: "2023/11/19",
    manager: users[3],
    notes: "可按需分割使用，减少浪费",
    imageUrl: "/consumables/strip-pcr-plate.png",
  },
  // 10. 无库存 + 已过期 (不可申领)
  {
    id: "cons-010",
    name: "倒角尖端吸头",
    alias: ["倒角头", "斜角头", "精密吸头"],
    model: "10μL倒角尖端吸头",
    category: "移液器材",
    description: "倒角设计精密移液器吸头，减少液体残留",
    manufacturer: "艾本德",
    supplier: "德国艾本德（中国）有限公司",
    catalogNumber: "BT-10-A",
    currentStock: 0, // 无库存
    minStock: 100,
    maxStock: 800,
    unit: "盒",
    unitPrice: 68.0,
    totalValue: 0.0,
    location: "A栋储物柜",
    department: "精密分析实验室",
    status: "缺货",
    expiryDate: formatDate(expiredDate60), // 已过期
    lastUsedDate: "2023/11/18",
    manager: users[4],
    notes: "倒角设计，提高移液精度，减少残留",
    imageUrl: "/consumables/beveled-tips.png",
  },
  // 11. 库存充足 + 已过期 (不可申领)
  {
    id: "cons-011",
    name: "不锈钢分液吸头",
    alias: ["金属吸头", "钢制吸头", "耐腐蚀吸头"],
    model: "不锈钢可重复使用吸头",
    category: "移液器材",
    description: "316不锈钢材质分液吸头，可重复使用",
    manufacturer: "德国Brand",
    supplier: "德国Brand中国",
    catalogNumber: "SS-TIP-R",
    currentStock: 25, // 62.5% > 50% - 库存充足
    minStock: 5,
    maxStock: 40,
    unit: "支",
    unitPrice: 180.0,
    totalValue: 4500.0,
    location: "C栋专用柜",
    department: "化学分析实验室",
    status: "已过期",
    expiryDate: formatDate(expiredDate30), // 已过期
    lastUsedDate: "2023/11/10",
    manager: users[0],
    notes: "耐腐蚀，可高温灭菌，适用于有机溶剂",
    imageUrl: "/consumables/stainless-steel-tips.png",
  },
] 