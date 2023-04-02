import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'
import { SocialButton } from 'components/SocialButton'
import useMobile from 'hooks/Mobile'

export default function SocialLinks({
  infoUri,
  twitter,
  discord,
  telegram,
}: {
  infoUri?: string
  twitter?: string
  discord?: string
  telegram?: string
}) {
  const isMobile = useMobile()
  const iconClasses =
    'flex text-grey-500 dark:text-slate-100 text-xl md:text-base'

  return (
    <Space size={12}>
      {infoUri && (
        <SocialButton link={infoUri} name="Project website">
          <GlobalOutlined className={iconClasses} />
        </SocialButton>
      )}
      {twitter && (
        <SocialButton
          link={'https://twitter.com/' + twitter}
          name="Project Twitter"
        >
          <TwitterOutlined className={iconClasses} />
        </SocialButton>
      )}
      {discord && (
        <SocialButton link={discord} name="Project Discord">
          <Discord className={iconClasses} size={isMobile ? 16 : 14} />
        </SocialButton>
      )}
      {telegram && (
        <SocialButton link={telegram} name="Project Telegram">
          <Telegram className={iconClasses} size={isMobile ? 16 : 14} />
        </SocialButton>
      )}
    </Space>
  )
}
