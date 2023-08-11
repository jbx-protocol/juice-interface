import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ExternalLink from 'components/ExternalLink'

export function ExternalLinkWithIcon({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <ExternalLink href={href}>
      <span className="whitespace-nowrap">
        {children}
        <ArrowRightIcon className="ml-1 inline h-3 w-3" />
      </span>
    </ExternalLink>
  )
}
