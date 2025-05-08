import * as React from "react"
import { 
  AIRecommendCard, 
  AIRecommendCardHeader, 
  AIRecommendCardTitle, 
  AIRecommendCardContent 
} from "./ui/card"
import { Button } from "./ui/button"
import { PlusCircle } from "lucide-react"

interface RecommendationItem {
  id: string
  title: string
  type: string
  description?: string
}

interface SmartRecommendationProps {
  title?: string
  items: RecommendationItem[]
  onAddItem?: (item: RecommendationItem) => void
  className?: string
}

export function SmartRecommendation({ 
  title = "智能推荐", 
  items = [], 
  onAddItem,
  className 
}: SmartRecommendationProps) {
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);

  return (
    <div className={`bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium flex items-center gap-2 relative">
          <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1.5 h-5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></span>
          <svg 
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="relative">
            {title}
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500/0"></span>
          </span>
        </h2>
        {items.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 
                       hover:bg-blue-50/50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800/50
                       hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300
                       shadow-sm hover:shadow"
            onClick={() => {}}
          >
            <svg 
              className="h-4 w-4 mr-1 animate-pulse" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            一键添加全部推荐
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center bg-white/50 dark:bg-gray-800/20 rounded-lg border border-dashed border-blue-200 dark:border-blue-800/30">
            暂无推荐项目
          </div>
        ) : (
          items.map((item, index) => (
            <AIRecommendCard 
              key={item.id} 
              className="group hover:scale-[1.01] transition-all duration-300" 
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.5s ease-out forwards",
                opacity: 0,
                transform: "translateY(10px)",
              }}
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <style jsx global>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                @keyframes glow {
                  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); }
                  50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
                }
              `}</style>
              <AIRecommendCardHeader>
                <AIRecommendCardTitle>
                  <span className="flex-1 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center
                                 transition-colors duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40">
                    <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 mr-1 ${hoveredItemId === item.id ? 'animate-pulse' : ''}`}></span>
                    {item.type}
                  </span>
                </AIRecommendCardTitle>
              </AIRecommendCardHeader>
              <AIRecommendCardContent className="flex items-center justify-between">
                {item.description && (
                  <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-gray-800 dark:group-hover:text-gray-200">{item.description}</p>
                )}
                <Button
                  size="sm"
                  variant={hoveredItemId === item.id ? "default" : "ghost"}
                  className={`ml-auto transition-all duration-300 ${
                    hoveredItemId === item.id 
                      ? "opacity-100 bg-blue-500 hover:bg-blue-600 text-white" 
                      : "opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  style={{
                    animation: hoveredItemId === item.id ? 'glow 2s infinite' : 'none'
                  }}
                  onClick={() => onAddItem?.(item)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </AIRecommendCardContent>
            </AIRecommendCard>
          ))
        )}
      </div>
    </div>
  )
} 