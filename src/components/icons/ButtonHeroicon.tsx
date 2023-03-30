import { twJoin } from 'tailwind-merge'

export function ButtonHeroicon({
  icon,
  iconProps,
}: {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
  iconProps?: React.SVGProps<SVGSVGElement>
}) {
  const Icon = icon

  const props = {
    ...iconProps,
    className: twJoin('h-[1em] w-[1em]', iconProps?.className),
  }

  return (
    <span className="anticon">
      <Icon {...props} />
    </span>
  )
}
