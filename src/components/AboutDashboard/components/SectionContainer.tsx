import { twMerge } from 'tailwind-merge'

export const SectionContainer: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return (
    <section className={'w-full'}>
      <div
        className={twMerge(
          'mx-auto w-full max-w-5xl px-10 py-5 text-center',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
