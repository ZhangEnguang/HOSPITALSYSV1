import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 定义ChartType接口
interface ChartType {
  id: string;
  title: string;
  description?: string;
  type: string[];
  icon: React.ReactElement;
  size?: string;
  renderChart: () => React.ReactNode;
}

// 图表卡片组件
function ChartCard({ chart }: { chart: ChartType }) {
  return (
    <Card 
      className={cn(
        "border border-[#E9ECF2]",
        chart.size === "large" && "lg:col-span-2"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              {React.cloneElement(chart.icon, { className: "h-4 w-4 text-primary" })}
            </div>
            <CardTitle className="text-[20px] font-normal">{chart.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chart.renderChart()}
      </CardContent>
    </Card>
  );
}

export default ChartCard; 