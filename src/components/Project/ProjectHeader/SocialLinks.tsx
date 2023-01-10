import { TwitterOutlined, GlobalOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import useMobile from 'hooks/Mobile'

type SocialProps = {
  children: React.ReactNode
  link: string
}

function SocialButton(props: SocialProps) {
  const { children, link } = props

  return (
    <ExternalLink
      className="border-1 p-30 flex h-10 w-10 items-center justify-center rounded-full bg-smoke-100 dark:bg-slate-400 md:h-9 md:w-9 "
      href={link}
    >
      {children}
    </ExternalLink>
  )
}

export default function SocialLinks({
  infoUri,
  twitter,
  discord,
}: {
  infoUri?: string
  twitter?: string
  discord?: string
}) {
  const isMobile = useMobile()
  const iconClasses =
    'flex text-grey-500 dark:text-slate-100 text-xl md:text-base'

  return (
    <Space size={12}>
      {infoUri && (
        <SocialButton link={infoUri}>
          <GlobalOutlined className={iconClasses} />
        </SocialButton>
      )}
      {twitter && (
        <SocialButton link={twitter}>
          <TwitterOutlined className={iconClasses} />
        </SocialButton>
      )}
      {discord && (
        <SocialButton link={discord}>
          <Discord className={iconClasses} size={isMobile ? 16 : 14} />
        </SocialButton>
      )}
    </Space>
  )
}
