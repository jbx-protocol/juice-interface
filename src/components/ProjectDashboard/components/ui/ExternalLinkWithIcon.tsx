import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ExternalLink from 'components/ExternalLink'

export function ExternalLinkWithIcon({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <ExternalLink href={href}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowRightIcon className="h-3 w-3" />
      </div>
    </ExternalLink>
  )
}
