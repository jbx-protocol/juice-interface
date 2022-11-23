import useMobile from 'hooks/Mobile'
import { classNames } from 'utils/classNames'

export const SectionHeading: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const isMobile = useMobile()

  return (
    <h2
      className={classNames(
        'text-center font-semibold',
        isMobile ? 'text-3xl' : 'text-4xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}
