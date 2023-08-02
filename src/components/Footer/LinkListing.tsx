import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { ReactNode } from 'react'

export type LinkItem = {
  title: ReactNode
  link: string
  externalLink?: boolean
}

export const LinkListing: React.FC<{ items: LinkItem[] }> = ({ items }) => (
  <>
    {items.map(({ title, link, externalLink }, i) => (
      <div key={i}>
        {externalLink ? (
          <ExternalLink
            className="text-white hover:text-bluebs-500"
            href={link}
          >
            {title}
          </ExternalLink>
        ) : (
          <Link href={link} className="text-white hover:text-bluebs-500">
            {title}
          </Link>
        )}
      </div>
    ))}
  </>
)
