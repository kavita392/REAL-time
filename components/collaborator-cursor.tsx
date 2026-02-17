"use client"

import { useEffect, useState } from "react"

export function CollaboratorCursor({
  name,
  color,
  containerRef,
}: {
  name: string
  color: string
  containerRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  const [position, setPosition] = useState({ top: 60, left: 200 })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
 
    const interval = setInterval(() => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const maxTop = Math.max(rect.height - 40, 60)
      const maxLeft = Math.max(rect.width - 100, 100)

      setPosition({
        top: Math.random() * maxTop + 20,
        left: Math.random() * maxLeft,
      })

      setVisible(true)
      setTimeout(() => setVisible(true), 500)
    }, 3000 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [containerRef])

  if (!visible) return null

  return (
    <div
      className="absolute pointer-events-none transition-all duration-700 ease-in-out z-10"
      style={{ top: position.top, left: position.left }}
    >
    
      <div
        className="w-0.5 h-5 rounded-full"
        style={{ backgroundColor: color }}
      />
   
      <div
        className="mt-0.5 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  )
}
