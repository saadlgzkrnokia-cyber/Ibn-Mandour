"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Dialog({ open: controlledOpen, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, { onClick: () => setOpen(true) })
        }
        if (React.isValidElement(child) && child.type === DialogContent) {
          return open ? React.cloneElement(child as React.ReactElement<any>, { onClose: () => setOpen(false) }) : null
        }
        return child
      })}
    </>
  )
}

export function DialogTrigger({ children, onClick, asChild, ...props }: { children: React.ReactNode; onClick?: () => void; asChild?: boolean; [key: string]: any }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick, ...props })
  }
  return <button onClick={onClick} {...props}>{children}</button>
}

export function DialogContent({ children, onClose, className, ...props }: { children: React.ReactNode; onClose?: () => void; className?: string; [key: string]: any }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} className={cn("relative z-50 w-full max-w-lg mx-4 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl shadow-2xl", className)} {...props}>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-3", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold text-white", className)}>{children}</h2>
}
