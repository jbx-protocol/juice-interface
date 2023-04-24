import { PropsWithChildren } from 'react'
import { twJoin } from 'tailwind-merge'

export function SectionContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className="w-full overflow-x-hidden">
      <div
        className={twJoin('container m-auto py-24 px-5 md:px-10', className)}
      >
        {children}
      </div>
    </section>
  )
}
