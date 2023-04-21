import { MinorHeading } from './MinorHeading'

export function BigStat({
  label,
  value,
}: {
  label: string | JSX.Element
  value: string | JSX.Element
}) {
  return (
    <div className="flex flex-col items-start">
      <MinorHeading className="pt-4 pb-1">{label}</MinorHeading>
      <div className="pt-1 font-display text-4xl">{value}</div>
    </div>
  )
}
