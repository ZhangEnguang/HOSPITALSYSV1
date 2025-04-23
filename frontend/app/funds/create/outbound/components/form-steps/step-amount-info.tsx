"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface StepAmountInfoProps {
  formData: {
    amount: string
    recipient: string
    recipientAccount: string
    recipientBank: string
  }
  validationErrors: Record<string, string>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  recipients: string[]
  banks: string[]
}

export function StepAmountInfo({
  formData,
  validationErrors,
  handleInputChange,
  handleSelectChange,
  recipients,
  banks,
}: StepAmountInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
        <div className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h3 className="text-base font-medium">金额与收款信息</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">
            外拨金额 (元) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="请输入外拨金额"
            value={formData.amount}
            onChange={handleInputChange}
            required
            className={cn("w-full", validationErrors.amount && "border-red-500")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">
            收款单位 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.recipient} 
            onValueChange={(value) => handleSelectChange("recipient", value)}
          >
            <SelectTrigger id="recipient" className={validationErrors.recipient ? "border-red-500" : ""}>
              <SelectValue placeholder="选择收款单位" />
            </SelectTrigger>
            <SelectContent>
              {recipients.map((recipient) => (
                <SelectItem key={recipient} value={recipient}>
                  {recipient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientAccount">
            收款账号 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="recipientAccount"
            name="recipientAccount"
            placeholder="请输入收款账号"
            value={formData.recipientAccount}
            onChange={handleInputChange}
            required
            className={cn("w-full", validationErrors.recipientAccount && "border-red-500")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientBank">
            开户银行 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.recipientBank}
            onValueChange={(value) => handleSelectChange("recipientBank", value)}
          >
            <SelectTrigger id="recipientBank" className={validationErrors.recipientBank ? "border-red-500" : ""}>
              <SelectValue placeholder="选择开户银行" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
