import Link from 'next/link'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const HOMEPAGE_CARD_BORDER =
  'rounded-lg border drop-shadow-[0_4px_14px_rgba(0,0,0,0.03)] border-solid border-grey-200 dark:border-slate-500'
export const HOMEPAGE_CARD_BORDER_HOVER =
  'md:hover:border-grey-300 md:dark:hover:border-slate-400 md:hover:-translate-y-1 md:hover:drop-shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all'
export const HOMEPAGE_CARD_BG = 'bg-white dark:bg-slate-700 overflow-hidden'

// Used in Trending Projects Caroursel and Juicy Picks section
export function HomepageCard(props: {
  img: ReactNode
  title: ReactNode
  description?: ReactNode
  href?: string
}) {
  const { href, ...rest } = props
  if (href) {
    return (
      <div className={HOMEPAGE_CARD_BORDER_HOVER}>
        <Link
          prefetch={false}
          href={href}
          className={twMerge(
            'block w-56 flex-shrink-0 cursor-pointer select-none',
            HOMEPAGE_CARD_BORDER,
            HOMEPAGE_CARD_BG,
          )}
        >
          <InteralCardObject {...rest} />
        </Link>
      </div>
    )
  }

  return (
    <div className={HOMEPAGE_CARD_BORDER_HOVER}>
      <div
        className={twMerge(
          'block w-56 flex-shrink-0 select-none',
          HOMEPAGE_CARD_BORDER,
          HOMEPAGE_CARD_BG,
        )}
      >
        <InteralCardObject {...rest} />
      </div>
    </div>
  )
}

const InteralCardObject = ({
  title,
  description,
  img,
}: {
  title: ReactNode
  description?: ReactNode
  img: ReactNode
}) => (
  <div>
    <div className="h-[192px] w-full overflow-hidden rounded-none object-cover">
      {img}
    </div>

    <div className="flex flex-col justify-between gap-4 rounded-lg p-4">
      <div className="max-h-8 truncate font-heading text-lg font-medium text-grey-900 dark:text-slate-100 md:text-xl">
        {title}
      </div>

      {description}
    </div>
  </div>
)
