"use client"

import type React from "react"
import { useRef } from "react"

interface FloatingRobotProps {
  isOpen: boolean
  toggleOpen: (e: React.MouseEvent) => void
  showSpeech: boolean
  setShowSpeech: (show: boolean) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

const FloatingRobot: React.FC<FloatingRobotProps> = ({
  isOpen,
  toggleOpen,
  showSpeech,
  setShowSpeech,
  isDragging,
  setIsDragging,
  position,
  setPosition,
}) => {
  const robotRef = useRef<HTMLDivElement>(null)

  const handleRobotHover = () => {
    if (!isDragging) {
      setShowSpeech(true)
    }
  }

  const handleRobotLeave = () => {
    setShowSpeech(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // 防止触发点击事件
    setIsDragging(true)

    if (robotRef.current) {
      // 计算鼠标点击位置与元素左上角的偏移量
      const rect = robotRef.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <div
      ref={robotRef}
      className="fixed right-6 bottom-6 w-[120px] h-[140px] cursor-move"
      style={{
        transition: isDragging ? "none" : "transform 0.3s ease",
        visibility: "visible !important" as any,
        display: "block !important" as any,
        position: "fixed !important" as any,
        zIndex: 99999,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleRobotHover}
      onMouseLeave={handleRobotLeave}
      onClick={toggleOpen}
    >
      {/* 对话框 */}
      <div
        className="absolute -top-16 right-5 bg-white px-4 py-2 rounded-2xl shadow-md max-w-[200px] pointer-events-none whitespace-nowrap"
        style={{
          opacity: showSpeech ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 99999,
        }}
      >
        您好！有什么可以帮助您的？
        <div
          className="absolute -bottom-2 right-5"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid white",
          }}
        />
      </div>

      {/* 机器人图片 */}
      <div
        className="w-full h-full"
        style={{
          transition: "transform 0.3s ease",
          transform: !isDragging ? (showSpeech ? "translateY(-10px)" : "translateY(0)") : "none",
          zIndex: 99999,
        }}
      >
        <img
          src="/ai-robot-avatar.gif"
          alt="机器人助手"
          className="w-full h-full object-contain"
          style={{
            pointerEvents: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  )
}

export default FloatingRobot

