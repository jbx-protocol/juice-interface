import { twMerge } from 'tailwind-merge'

export const AboutButton: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return (
    <button
      className={twMerge(
        'rounded-md bg-bluebs-500 px-4 py-2 text-base text-white',
        className,
      )}
    >
      {children}
    </button>
  )
}
