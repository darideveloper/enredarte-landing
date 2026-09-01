import { cn } from "@/lib/utils"

interface GlobalLoaderProps {
  isLoading?: boolean
  message?: string
}

export function GlobalLoader({ isLoading = false, message = "Loading..." }: GlobalLoaderProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
      )}
    >
      <div className="flex flex-col items-center gap-3 rounded-lg bg-white px-8 py-6 shadow-lg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}
