import * as React from "react"
import { A11y, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { SlideSet } from "@/lib/images"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export interface SliderSlide {
  alt: string
  src: string
  set: SlideSet | null
}

export interface ArtworkSliderProps {
  slides: SliderSlide[]
}

export function ArtworkSlider({ slides }: ArtworkSliderProps) {
  const [index, setIndex] = React.useState(0)
  const multi = slides.length > 1
  if (slides.length === 0) return null
  // Base: natural size, centered by the `.artwork-slide` flex wrapper (mobile).
  // At `lg` the image fills the column box and `object-contain` auto-fits it
  // centered — portrait fills height, landscape fills width.
  const imgClass = "object-contain lg:h-full lg:w-full"
  return (
    <div className="artwork-slider relative min-h-[40svh] bg-paper min-w-0">
      <Swiper
        modules={multi ? [Navigation, Pagination, A11y] : [A11y]}
        slidesPerView={1}
        spaceBetween={8}
        navigation={multi}
        pagination={multi ? { clickable: true } : false}
        onSlideChange={(s) => setIndex(s.activeIndex)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.src} className="artwork-slide">
            {slide.set ? (
              <picture>
                <source type="image/avif" srcSet={slide.set.avifSrcSet} sizes={slide.set.sizes} />
                <source type="image/webp" srcSet={slide.set.webpSrcSet} sizes={slide.set.sizes} />
                <img
                  src={slide.set.fallbackSrc}
                  alt={slide.alt}
                  width={slide.set.width}
                  height={slide.set.height}
                  loading="lazy"
                  decoding="async"
                  sizes={slide.set.sizes}
                  className={imgClass}
                />
              </picture>
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                decoding="async"
                className={imgClass}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {multi && (
        <span className="absolute bottom-6 right-6 z-10 bg-paper/90 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.14em] text-ink">
          {index + 1} / {slides.length}
        </span>
      )}
    </div>
  )
}
