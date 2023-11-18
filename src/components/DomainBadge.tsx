import Image from 'next/image'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Badge } from './Badge'

export type DomainBadgeProps = {
  className?: string
  domain: string | undefined
}
export const DomainBadge: React.FC<DomainBadgeProps> = ({
  className,
  domain,
}) => {
  const domainString = useMemo(() => {
    if (!domain) return undefined
    return domain[0].toUpperCase() + domain.slice(1)
  }, [domain])

  const customDomainImageSrc = useMemo(() => {
    if (!domain) return undefined
    if (domain === 'juicecrowd') return '/assets/images/juicecrowd-logo.webp'
  }, [domain])

  if (!customDomainImageSrc) return null

  return (
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
}
