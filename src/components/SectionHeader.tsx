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
    'text-xl font-medium text-grey-900 dark:text-slate-100 font-heading',
    className,
  )

  if (tip !== undefined) {
    return (
      <h2 className="font-heading text-2xl">
        <TooltipLabel
          className="text-sm"
          label={<span className={_className}>{text}</span>}
          tip={tip}
        />
      </h2>
    )
  } else {
    return <h2 className={_className}>{text}</h2>
  }
}
