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

  const _className = twMerge(
    'text-xl font-medium text-grey-900 dark:text-slate-100',
    className,
  )

  if (tip !== undefined) {
    return (
      <h3>
        <TooltipLabel
          className="text-sm"
          label={<span className={_className}>{text}</span>}
          tip={tip}
        />
      </h3>
    )
  } else {
    return <h3 className={_className}>{text}</h3>
  }
}
