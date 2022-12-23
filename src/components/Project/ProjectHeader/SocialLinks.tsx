import { TwitterOutlined, GlobalOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import useMobile from 'hooks/Mobile'
import colors from 'tailwindcss/colors'

type SocialProps = {
  children: React.ReactNode
  link: string
}

function SocialButton(props: SocialProps) {
  const { children, link } = props
  const isMobile = useMobile()
  const cls = isMobile
    ? 'p-30 border-1 flex h-[40px] w-[40px] dark:bg-[#4f4e54] items-center justify-center rounded-full border-solid border-[#e0dbd2] bg-[#eeebe3]'
    : 'p-30 border-1 flex h-[36px] w-[36px] dark:bg-[#4f4e54] dark:border-[#8F8B83] items-center justify-center rounded-full border-solid border-[#e0dbd2] bg-[#eeebe3]'

  return (
    <ExternalLink className={cls} href={link}>
      {children}
    </ExternalLink>
  )
}

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
  const { themeOption } = useJuiceTheme()

  const styleObj = {
    fontSize: isMobile ? 22 : 16,
    color: themeOption === 'light' ? '#8F8B83' : colors['gray'][300],
  }

  return (
    <Space className="flex-wrap gap-x-[6px] gap-y-2" size="middle">
      {infoUri && (
        <SocialButton link={infoUri}>
          <GlobalOutlined style={styleObj} />
        </SocialButton>
      )}
      {twitter && (
        <SocialButton link={twitter}>
          <TwitterOutlined style={styleObj} />
        </SocialButton>
      )}
      {discord && (
        <SocialButton link={discord}>
          <Discord
            style={{
              color: '#8F8B83',
              marginTop: 2,
              width: styleObj.fontSize,
              height: styleObj.fontSize,
            }}
          />
        </SocialButton>
      )}
      {telegram && (
        <SocialButton link={telegram}>
          <Telegram
            color="#8F8B83"
            style={{
              width: styleObj.fontSize,
              height: styleObj.fontSize,
            }}
          />
        </SocialButton>
      )}
    </Space>
  )
}
