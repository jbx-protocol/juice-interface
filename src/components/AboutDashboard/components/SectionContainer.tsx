import { twMerge } from 'tailwind-merge'

export const SectionContainer: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => {
  return (
    <section className="w-full">
      <div
        className={twMerge(
          'mx-auto w-full max-w-6xl px-8 pt-14 pb-16 md:px-10 md:pt-16 md:pb-20',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
