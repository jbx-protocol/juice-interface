import { TwitterOutlined } from '@ant-design/icons'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'
import { useMemo } from 'react'
type SocialLinkButtonType = 'twitter' | 'discord' | 'telegram' | 'website'

export const SocialLinkButton = ({
  type,
  href,
}: {
  type: SocialLinkButtonType
  href: string
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
    <a className="flex items-center gap-2" href={href}>
      <Icon className="h-4 w-4 text-lg text-bluebs-500" />
      <span className="text-sm">{text}</span>
    </a>
  )
}
