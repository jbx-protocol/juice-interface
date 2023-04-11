import { twMerge } from 'tailwind-merge'

export const OldSectionHeading: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={twMerge(
        'text-brand text-center text-3xl leading-tight md:text-5xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}
