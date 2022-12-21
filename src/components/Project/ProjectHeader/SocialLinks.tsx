import { TwitterOutlined, GlobalOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import Telegram from 'components/icons/Telegram'

type SocialProps = {
  children: React.ReactNode
}

function SocialButton(props: SocialProps) {
  const { children } = props

  return (
    <ExternalLink className="p-30 border-1 flex h-[32px] w-[32px] items-center justify-center rounded-full border-solid border-[#E0DBD2] bg-[#EEEBE3]">
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
  return (
    <Space className="flex-wrap gap-x-[6px] gap-y-2" size="middle">
      {infoUri && (
        <SocialButton>
          <GlobalOutlined
            style={{
              color: '#8F8B83',
              fontSize: '1rem',
            }}
          />
        </SocialButton>
      )}
      {twitter && (
        <SocialButton>
          <TwitterOutlined
            style={{
              color: '#8F8B83',
              fontSize: '1rem',
            }}
          />
        </SocialButton>
      )}
      {discord && (
        <SocialButton>
          <Discord
            style={{ color: '#8F8B83', marginTop: 2, width: 16, height: 16 }}
          />
        </SocialButton>
      )}
      <SocialButton>
        <Telegram
          color="#8F8B83"
          style={{
            color: '#8F8B83',
            width: 16,
            height: 16,
          }}
        />
      </SocialButton>
    </Space>
  )
}
