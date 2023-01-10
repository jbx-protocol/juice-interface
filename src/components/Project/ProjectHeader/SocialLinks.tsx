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
      className="p-30 border-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#eeebe3] dark:bg-[#4f4e54] md:h-9 md:w-9"
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

  const styleObj = {
    fontSize: isMobile ? 22 : 16,
  }

  const iconClasses = 'text-grey-500 dark:text-slate-100'

  return (
    <Space className="flex-wrap" size={12}>
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
          <Discord
            style={{
              marginTop: 2,
              width: styleObj.fontSize,
              height: styleObj.fontSize,
            }}
            className="text-grey-500 dark:text-slate-100"
          />
        </SocialButton>
      )}
    </Space>
  )
}
