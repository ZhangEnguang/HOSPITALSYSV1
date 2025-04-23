// 导出所有图表配置
import { fundingReceiptChart } from "./funding-receipt-chart"
import { contractSigningChart } from "./contract-signing-chart"
import { annualTrendsChart } from "./annual-trends-chart"
import { bankPaymentsChart } from "./bank-payments-chart"
import { collegeTop5Chart } from "./college-top5-chart"
import { projectFundingChart, fundingByTypeChart, monthlyComparisonChart, projectCompletionChart } from "./other-charts"

// 所有可用图表配置
export const allCharts = [
  fundingReceiptChart,
  contractSigningChart,
  annualTrendsChart,
  bankPaymentsChart,
  collegeTop5Chart,
  projectFundingChart,
  fundingByTypeChart,
  monthlyComparisonChart,
  projectCompletionChart,
]

// 默认显示的图表ID
export const defaultChartIds = ["funding-receipt", "contract-signing", "annual-trends", "bank-payments"]

