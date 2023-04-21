import { A11y, Navigation } from 'swiper'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { twJoin } from 'tailwind-merge'

function PageButton({
  className,
  iconComponent,
  direction,
}: {
  className: string
  iconComponent: JSX.Element
  direction: 'prev' | 'next'
}) {
  const swiper = useSwiper()

  if (
    (!swiper.allowSlideNext && direction === 'next') ||
    (!swiper.allowSlidePrev && direction === 'prev')
  )
    return null

  return (
    <button
      className={twJoin(
        'absolute top-1/3  z-10 flex h-14 w-14 items-center justify-center rounded-full border border-grey-300 bg-white text-grey-700 shadow-lg transition-transform hover:scale-105',
        className,
      )}
      onClick={() =>
        direction === 'next' ? swiper.slideNext() : swiper.slidePrev()
      }
    >
      {iconComponent}
    </button>
  )
}

export function ProjectCarousel({ items }: { items: JSX.Element[] }) {
  const [canSwipePrev, setCanSwipePrev] = useState(false)
  const [canSwipeNext, setCanSwipeNext] = useState(true)

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, A11y]}
      spaceBetween={32}
      slidesPerView="auto"
      freeMode
      onProgress={(_, progress) => {
        if (progress === 0) {
          setCanSwipePrev(false)
        } else {
          setCanSwipePrev(true)
        }

        if (progress === 1) {
          setCanSwipeNext(false)
        } else {
          setCanSwipeNext(true)
        }
      }}
    >
      {canSwipePrev && (
        <PageButton
          className="left-0"
          iconComponent={<ChevronLeftIcon className="h-6 w-6" />}
          direction="prev"
        />
      )}
      {canSwipeNext && (
        <PageButton
          className="right-0"
          iconComponent={<ChevronRightIcon className="h-6 w-6" />}
          direction="next"
        />
      )}

      {items?.map((item, idx) => (
        <SwiperSlide key={idx}>{item}</SwiperSlide>
      ))}
    </Swiper>
  )
}
