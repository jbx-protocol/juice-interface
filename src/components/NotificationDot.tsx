import { twMerge } from 'tailwind-merge'

export const NotificationDot = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'h-2 w-2 rounded-full bg-tangerine-600 dark:bg-tangerine-500',
        className,
      )}
    />
  )
}
