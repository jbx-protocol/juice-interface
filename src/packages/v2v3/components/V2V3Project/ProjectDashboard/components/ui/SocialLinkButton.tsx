import { TwitterOutlined } from '@ant-design/icons'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'
import { useMemo } from 'react'
type SocialLinkButtonType = 'twitter' | 'discord' | 'telegram' | 'website'

export const SocialLinkButton = ({
  type,
  href,
  iconOnly = false,
}: {
  type: SocialLinkButtonType
  href: string
  iconOnly?: boolean
}) => {
  const Icon = useMemo(() => {
    switch (type) {
      case 'twitter':
        return TwitterOutlined
      case 'discord': {
        const discord = ({ className }: { className?: string }) => (
          <Discord className={className} />
        )
        return discord
      }
      case 'telegram':
        return Telegram
      case 'website':
        return GlobeAltIcon
    }
  }, [type])

  const text = useMemo(() => {
    return type[0].toUpperCase() + type.slice(1)
  }, [type])

  return (
    <ExternalLink
      className="flex items-center gap-2 font-medium text-black dark:text-slate-100"
      href={href}
    >
      <Icon className="h-5 w-5 text-xl md:h-6 md:w-6 md:text-2xl md:leading-none" />
      {iconOnly ? null : <span className="text-sm">{text}</span>}
    </ExternalLink>
  )
}
