// Luhn算法验证银行卡号
function luhnCheck(cardNumber: string): boolean {
  if (!cardNumber || !/^\d+$/.test(cardNumber)) return false

  // 去除空格和分隔符
  const digits = cardNumber.replace(/\D/g, "")

  let sum = 0
  let shouldDouble = false

  // 从右向左遍历
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits.charAt(i))

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// 银行BIN号验证
function validateBankBIN(cardNumber: string): { valid: boolean; bankName?: string } {
  if (cardNumber.length < 6) return { valid: false }

  const bin = cardNumber.substring(0, 6)

  // 简化的BIN号映射表
  const binMap: Record<string, string> = {
    "621700": "中国建设银行",
    "622700": "中国建设银行",
    "622202": "中国工商银行",
    "621661": "中国银行",
    "622848": "中国农业银行",
    "622588": "招商银行",
    "622609": "招商银行",
    "622908": "中信银行",
    "622260": "交通银行",
    "622660": "交通银行",
    "622630": "华夏银行",
    "622580": "浦发银行",
    "622150": "上海银行",
    "622516": "广发银行",
    "622518": "广发银行",
    "622622": "民生银行",
    "622668": "中国银行",
    "622280": "工商银行",
    "622690": "中国邮政储蓄银行",
    "622188": "兴业银行",
    "622288": "兴业银行",
  }

  // 检查BIN号是否在映射表中
  for (const [prefix, bank] of Object.entries(binMap)) {
    if (cardNumber.startsWith(prefix)) {
      return { valid: true, bankName: bank }
    }
  }

  return { valid: false }
}

// 综合验证银行账号
export function validateBankAccount(accountNumber: string): { valid: boolean; message: string; bankName?: string } {
  // 清除空格和分隔符
  const cleanNumber = accountNumber.replace(/\D/g, "")

  // 检查长度
  if (cleanNumber.length < 16 || cleanNumber.length > 19) {
    return {
      valid: false,
      message: "银行卡号长度应为16-19位数字",
    }
  }

  // 检查是否全为数字
  if (!/^\d+$/.test(cleanNumber)) {
    return {
      valid: false,
      message: "银行卡号应只包含数字",
    }
  }

  // 验证BIN号
  const binResult = validateBankBIN(cleanNumber)
  if (!binResult.valid) {
    return {
      valid: false,
      message: "无效的银行卡BIN号",
    }
  }

  // Luhn算法验证
  if (!luhnCheck(cleanNumber)) {
    return {
      valid: false,
      message: "银行卡号校验失败",
    }
  }

  return {
    valid: true,
    message: "银行卡号有效",
    bankName: binResult.bankName,
  }
}

