import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { SocialButton } from 'components/buttons/SocialButton'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'
import useMobile from 'hooks/useMobile'
import { twMerge } from 'tailwind-merge'

export default function SocialLinks({
  className,
  infoUri,
  twitter,
  discord,
  telegram,
  tooltipPlacement,
}: {
  className?: string
  infoUri?: string
  twitter?: string
  discord?: string
  telegram?: string
  tooltipPlacement?: 'top' | 'bottom'
}) {
  const isMobile = useMobile()
  const iconClasses =
    'flex text-grey-500 dark:text-slate-100 text-xl md:text-base'

  return (
    <div className={twMerge('flex gap-3', className)}>
      {infoUri && (
        <SocialButton
          link={infoUri}
          tooltip="Website"
          tooltipPlacement={tooltipPlacement}
        >
          <GlobalOutlined className={iconClasses} />
        </SocialButton>
      )}
      {twitter && (
        <SocialButton
          link={'https://twitter.com/' + twitter}
          tooltip="Twitter"
          tooltipPlacement={tooltipPlacement}
        >
          <TwitterOutlined className={iconClasses} />
        </SocialButton>
      )}
      {discord && (
        <SocialButton
          link={discord}
          tooltip="Discord"
          tooltipPlacement={tooltipPlacement}
        >
          <Discord className={iconClasses} size={isMobile ? 16 : 14} />
        </SocialButton>
      )}
      {telegram && (
        <SocialButton
          link={telegram}
          tooltip="Telegram"
          tooltipPlacement={tooltipPlacement}
        >
          <Telegram className={iconClasses} size={isMobile ? 16 : 14} />
        </SocialButton>
      )}
    </div>
  )
}
