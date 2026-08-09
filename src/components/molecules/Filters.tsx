import * as React from "react"
import { cn } from "@/lib/utils"
import { FilterBtn } from "@/components/atoms/FilterBtn"
import { FilterToggle } from "@/components/atoms/FilterToggle"
import { useCatalogStore } from "@/store/catalog"
import type { GroupKey } from "@/data/catalog"

export interface LocalizedFilterOption {
  value: string
  label: string
}

export interface LocalizedFilterGroup {
  key: GroupKey
  label: string
  options: LocalizedFilterOption[]
}

export interface FiltersProps {
  groups: LocalizedFilterGroup[]
  expandLabel: string
  collapseLabel: string
  className?: string
}

function FilterRow({ group }: { group: LocalizedFilterGroup }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = React.useState(false)
  const [canRight, setCanRight] = React.useState(false)

  const update = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    update()
    const onScroll = () => update()
    const onResize = () => update()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [update])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const max = el.scrollWidth - el.clientWidth
      const clamped = Math.min(max, Math.max(0, el.scrollLeft + delta))
      if (clamped === el.scrollLeft) return
      el.scrollLeft = clamped
      e.preventDefault()
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let down = false
    let dragging = false
    let suppressClick = false
    let startX = 0
    let startScrollLeft = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      down = true
      dragging = false
      startX = e.clientX
      startScrollLeft = el.scrollLeft
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!down || el.scrollWidth <= el.clientWidth) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) <= 5) return
        dragging = true
        suppressClick = true
        el.setPointerCapture(e.pointerId)
      }
      const max = el.scrollWidth - el.clientWidth
      el.scrollLeft = Math.min(max, Math.max(0, startScrollLeft - dx))
    }

    const endDrag = (e: PointerEvent) => {
      if (!down) return
      down = false
      dragging = false
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return
      suppressClick = false
      e.stopPropagation()
      e.preventDefault()
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", endDrag)
    el.addEventListener("pointercancel", endDrag)
    el.addEventListener("click", onClickCapture, true)
    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", endDrag)
      el.removeEventListener("pointercancel", endDrag)
      el.removeEventListener("click", onClickCapture, true)
    }
  }, [])

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <span className="shrink-0 text-[10px] tracking-[0.06em] uppercase text-muted md:w-32">
        {group.label}
      </span>
      <div className="relative flex-1 min-w-0">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {group.options.map((option) => (
            <FilterBtn
              key={option.value}
              group={group.key}
              value={option.value}
              label={option.label}
            />
          ))}
        </div>
        {canRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-paper to-transparent" />
        )}
        {canLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-paper to-transparent" />
        )}
      </div>
    </div>
  )
}

export function Filters({ groups, expandLabel, collapseLabel, className }: FiltersProps) {
  const isExpanded = useCatalogStore((state) => state.isExpanded)
  const visibleGroups = isExpanded ? groups : groups.slice(0, 1)

  return (
    <div className={cn("flex flex-col gap-5 mb-9", className)}>
      <div id="catalog-filters" className="flex flex-col gap-5">
        {visibleGroups.map((group) => (
          <FilterRow key={group.key} group={group} />
        ))}
      </div>
      {groups.length > 1 && (
        <FilterToggle label={isExpanded ? collapseLabel : expandLabel} />
      )}
    </div>
  )
}
