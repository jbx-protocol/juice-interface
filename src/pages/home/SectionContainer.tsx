import { PropsWithChildren } from 'react'
import { twJoin } from 'tailwind-merge'

export function SectionContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className="w-full py-20">
      <div className={twJoin('container m-auto px-5 md:px-10', className)}>
        {children}
      </div>
    </section>
  )
}
