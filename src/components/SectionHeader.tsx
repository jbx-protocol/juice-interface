import TooltipLabel from 'components/TooltipLabel'
import { twMerge } from 'tailwind-merge'

export default function SectionHeader({
  className,
  text,
  tip,
}: {
  className?: string
  text: string | JSX.Element | undefined
  tip?: string | JSX.Element
}) {
  if (text === undefined) return null

  if (tip !== undefined) {
    return (
      <h2>
        <TooltipLabel
          className="text-sm"
          label={
            <span
              className={twMerge(
                'text-lg font-medium text-grey-900 dark:text-slate-100',
                className,
              )}
            >
              {text}
            </span>
          }
          tip={tip}
        />
      </h2>
    )
  } else {
    return (
      <h2
        className={twMerge(
          'text-lg font-medium text-grey-900 dark:text-slate-100',
          className,
        )}
      >
        {text}
      </h2>
    )
  }
}
