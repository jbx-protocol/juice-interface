import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function SectionContainer({
  children,
  maxWidthClass,
}: PropsWithChildren<{ maxWidthClass?: string }>) {
  const defaultMaxWidthClass = 'max-w-7xl'
  return (
    <section className="w-full py-20">
      <div
        className={classNames(
          maxWidthClass ?? defaultMaxWidthClass,
          'm-auto px-5 md:px-10',
        )}
      >
        {children}
      </div>
    </section>
  )
}
