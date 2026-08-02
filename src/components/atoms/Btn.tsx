import * as React from "react"
import { cn } from "@/lib/utils"

export interface BtnProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "regular" | "ghost" | "outlineMuted"
  size?: "sm" | "lg" | "xs"
  disabled?: boolean
}

const variantStyles = {
  regular:
    "bg-crimson text-paper border-transparent hover:opacity-85",
  ghost:
    "bg-transparent text-ink border-ink hover:bg-crimson hover:border-crimson hover:text-paper",
  outlineMuted:
    "bg-transparent text-muted border-border-theme hover:text-ink hover:border-ink",
}

const sizeStyles = {
  sm: "text-[10px] py-[11px] px-[22px]",
  lg: "text-[11px] py-[15px] px-[32px]",
  xs: "text-[10px] py-1.5 px-2",
}

export function Btn({
  variant = "regular",
  size,
  className,
  disabled,
  children,
  href,
  ...props
}: BtnProps) {
  // Default sizes per variant if size prop is omitted
  const effectiveSize = size || (variant === "outlineMuted" ? "xs" : variant === "ghost" ? "sm" : "lg")

  return (
    <a
      href={disabled ? undefined : href}
      className={cn(
        "inline-flex items-center justify-center border cursor-pointer uppercase tracking-[0.1em] font-medium transition-all duration-300 select-none",
        variantStyles[variant],
        sizeStyles[effectiveSize],
        disabled && "pointer-events-none !text-ink !border-ink",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
