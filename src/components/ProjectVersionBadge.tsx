import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

const ProjectVersionBadge = ({
  className,
  transparent = false,
  versionText,
  size,
  style,
}: {
  className?: string
  transparent?: boolean
  versionText: string
  size?: 'small'
  style?: CSSProperties // sorry wraeth :(
}) => {
  return (
    <span
      className={
        style
          ? undefined
          : twMerge(
              'cursor-default text-grey-900 dark:text-slate-100',
              !transparent ? 'bg-smoke-75 dark:bg-slate-400' : '',
              size === 'small' ? 'py-0 px-1 text-xs' : 'py-0.5 px-1 text-sm',
              className,
            )
      }
      style={style}
    >
      {versionText}
    </span>
  )
}

const V1Badge = () => <ProjectVersionBadge versionText="V1" />
const V2Badge = () => <ProjectVersionBadge versionText="V2" />
const V3Badge = () => <ProjectVersionBadge versionText="V3" />

ProjectVersionBadge.V1 = V1Badge
ProjectVersionBadge.V2 = V2Badge
ProjectVersionBadge.V3 = V3Badge

export { ProjectVersionBadge }
