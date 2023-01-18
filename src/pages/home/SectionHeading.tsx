import { twMerge } from 'tailwind-merge'

export const SectionHeading: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h2 className={twMerge('text-center text-5xl font-semibold', className)}>
      {children}
    </h2>
  )
}
