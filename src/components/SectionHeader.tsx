import TooltipLabel from 'components/TooltipLabel'
import { classNames } from 'utils/classNames'

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
      <h2
        className={classNames(
          'text-sm font-medium text-juice-400 dark:font-normal',
          className,
        )}
      >
        <TooltipLabel label={text} tip={tip} />
      </h2>
    )
  } else {
    return (
      <h2
        className={classNames(
          'text-sm font-medium text-juice-400 dark:font-normal',
          className,
        )}
      >
        {text}
      </h2>
    )
  }
}
