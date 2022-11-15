import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { CSSProperties, ReactNode, useContext } from 'react'
import { RewardImage } from '../RewardImage'
import { RewardItemButton } from './RewardItemButton'
import { Reward } from './types'

// START: CSS
const emphasisedTextStyle: CSSProperties = { fontWeight: 500, fontSize: '1rem' }

const headerTextStyle = (isDarkMode: boolean): CSSProperties => ({
  color: isDarkMode
    ? styleColors.darkColors.darkGray300
    : styleColors.lightColors.gray600,
  fontWeight: 400,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
})

const descriptionTextStyle: CSSProperties = {
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: '1.5rem',
}

const detailsTextStyle: CSSProperties = {
  fontWeight: 400,
  fontSize: '0.75rem',
}

// END: CSS

export const RewardItem = ({
  tier,
  reward,
  onEditClicked,
  onDeleteClicked,
}: {
  tier: number
  reward: Reward
  onEditClicked?: () => void
  onDeleteClicked?: () => void
}) => {
  const { isDarkMode } = useContext(ThemeContext)
  const isMobile = useMobile()
  const {
    title,
    minimumContribution,
    description,
    maximumSupply,
    url,
    imgUrl,
  } = reward
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tier line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ ...emphasisedTextStyle, fontSize: '1.125rem' }}>
          <Trans>Tier {tier}</Trans>
        </div>
        <Space size="middle">
          <RewardItemButton onClick={onEditClicked}>
            <EditOutlined />
          </RewardItemButton>
          <RewardItemButton onClick={onDeleteClicked}>
            <DeleteOutlined />
          </RewardItemButton>
        </Space>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Main Body */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Image Col */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {/* Image */}
            <RewardImage size="11rem" src={imgUrl.toString()} />
            {!isMobile && (
              <TertiaryDetails maximumSupply={maximumSupply} url={url} />
            )}
          </div>
          {/* Description Col */}
          <div
            style={{
              flex: 1,
              gap: '2rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top */}
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '1.5rem' : undefined,
                justifyContent: 'space-between',
              }}
            >
              {/* Title */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={headerTextStyle(isDarkMode)}>
                  <Trans>Title</Trans>
                </div>
                <div style={emphasisedTextStyle}>{title}</div>
              </div>
              {/* Contribution */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={headerTextStyle(isDarkMode)}>
                  <Trans>Minimum Contribution</Trans>
                </div>
                <div style={emphasisedTextStyle}>
                  {minimumContribution.toString()} ETH
                </div>
              </div>
            </div>
            {/* Bottom */}
            {!isMobile && description && (
              <Description description={description} />
            )}
          </div>
        </div>
        {isMobile ? (
          <>
            {description && <Description description={description} />}
            <TertiaryDetails maximumSupply={maximumSupply} url={url} />
          </>
        ) : null}
      </div>
    </div>
  )
}

const Description = ({ description }: { description: ReactNode }) => {
  const { isDarkMode } = useContext(ThemeContext)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={headerTextStyle(isDarkMode)}>
        <Trans>Description</Trans>
      </div>
      <div style={descriptionTextStyle}>{description}</div>
    </div>
  )
}

const TertiaryDetails = ({
  maximumSupply,
  url,
}: {
  maximumSupply: ReactNode
  url: string | undefined
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        maxWidth: '11rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {maximumSupply && (
        <div style={detailsTextStyle}>
          <Trans>Supply: {maximumSupply}</Trans>
        </div>
      )}
      {url && (
        <div
          style={{
            ...detailsTextStyle,
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <LinkOutlined />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <ExternalLink href={url} />
          </div>
        </div>
      )}
    </div>
  )
}
