import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// 智能推荐卡片组件 - 带有现代化渐变背景
const AIRecommendCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border shadow-md transition-all hover:shadow-lg relative",
      "bg-gradient-to-br from-blue-50 via-indigo-50/70 to-purple-50/50",
      "dark:from-blue-950/50 dark:via-indigo-900/30 dark:to-purple-900/20",
      "backdrop-blur-sm overflow-hidden",
      "hover:border-blue-200 dark:hover:border-blue-800",
      "hover:translate-y-[-2px]",
      className
    )}
    style={{
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    }}
    {...props}
  >
    <style jsx global>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
      @keyframes pulse {
        0% { opacity: 0.3; transform: scale(0.97); }
        50% { opacity: 0.5; transform: scale(1); }
        100% { opacity: 0.3; transform: scale(0.97); }
      }
    `}</style>
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 opacity-10 rotate-12">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-full h-full text-blue-600 dark:text-blue-400"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v6h-2zm0-4h2v2h-2z" />
      </svg>
    </div>
    <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/30 dark:from-blue-400/10 dark:to-purple-400/5 blur-xl"></div>
    <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-300 animate-ping opacity-70"></div>
    <div className="absolute top-[70%] right-[15%] w-1 h-1 rounded-full bg-purple-400 dark:bg-purple-300 animate-ping opacity-70" style={{ animationDelay: '1s' }}></div>
    <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-indigo-200/20 to-transparent dark:from-indigo-400/5 rounded-tl-full"></div>
    {props.children}
  </div>
))
AIRecommendCard.displayName = "AIRecommendCard"

const AIRecommendCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-4 border-b border-blue-100/50 dark:border-blue-800/30",
      "relative backdrop-blur-sm bg-white/60 dark:bg-gray-900/40",
      className
    )}
    {...props}
  >
    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-500 opacity-80 rounded-tr-md rounded-br-md"></div>
    {props.children}
  </div>
))
AIRecommendCardHeader.displayName = "AIRecommendCardHeader"

const AIRecommendCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center text-lg font-medium text-blue-700 dark:text-blue-300",
      "pl-2 gap-2 relative",
      className
    )}
    {...props}
  />
))
AIRecommendCardTitle.displayName = "AIRecommendCardTitle"

const AIRecommendCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "p-4 backdrop-blur-sm bg-white/40 dark:bg-gray-900/30",
      "rounded-b-md",
      className
    )} 
    {...props} 
  />
))
AIRecommendCardContent.displayName = "AIRecommendCardContent"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  AIRecommendCard,
  AIRecommendCardHeader,
  AIRecommendCardTitle,
  AIRecommendCardContent
}
