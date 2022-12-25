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
  const btnCls =
    'p-30 flex border-1 flex dark:bg-[#4f4e54] items-center justify-center rounded-full bg-[#eeebe3]'

  const cls = isMobile
    ? `${btnCls} h-[40px] w-[40px]`
    : `${btnCls} h-[36px] w-[36px]`

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
    color: themeOption === 'light' ? '#787263' : colors['slate'][100],
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
              color: styleObj.color,
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
            color={styleObj.color}
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
