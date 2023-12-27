import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { getJuicecrowdUrl } from 'utils/juicecrowd'
import { Badge } from './Badge'

type DomainBadgeProps = {
  className?: string
  domain: string | undefined
  projectId?: number
}

export const DomainBadge: React.FC<DomainBadgeProps> = ({
  className,
  domain,
  projectId,
}) => {
  const domainString = useMemo(() => {
    if (!domain) return undefined
    return domain[0].toUpperCase() + domain.slice(1)
  }, [domain])

  const customDomainImageSrc = useMemo(() => {
    if (!domain) return undefined
    if (domain === 'juicecrowd') return '/assets/images/juicecrowd-logo.webp'
  }, [domain])

  const linkUrl = useMemo(() => {
    if (!domain || !projectId) return undefined
    if (domain === 'juicecrowd') return getJuicecrowdUrl(projectId)
  }, [projectId, domain])

  if (!customDomainImageSrc) return null

  const badge = (
    <Badge className={twMerge('pl-1.5', className)} variant="info">
      <Image
        height={16}
        width={16}
        src={customDomainImageSrc}
        alt={`${domain}`}
      />
      {domainString}
    </Badge>
  )

  if (linkUrl)
    return (
      <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
        {badge}
      </Link>
    )

  return badge
}
