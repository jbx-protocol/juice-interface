import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { CSSProperties } from 'react'
import { RewardImage } from '../RewardImage'
import { Reward } from './types'

// START: CSS
const emphasisedTextStyle: CSSProperties = { fontWeight: 500, fontSize: '1rem' }

const headerTextStyle: CSSProperties = {
  fontWeight: 400,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  // TODO: Color
}

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
          <Button style={{ padding: 0 }} type="link" onClick={onEditClicked}>
            <EditOutlined />
          </Button>
          <Button style={{ padding: 0 }} type="link" onClick={onDeleteClicked}>
            <DeleteOutlined />
          </Button>
        </Space>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Main Body */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Image Col */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {/* Image */}
            <RewardImage size="11rem" src={imgUrl.toString()} />
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
                <div style={detailsTextStyle}>Supply: {maximumSupply}</div>
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
                <div style={headerTextStyle}>Title</div>
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
                <div style={headerTextStyle}>Minimum Contribution</div>
                <div style={emphasisedTextStyle}>
                  {minimumContribution.toString()} ETH
                </div>
              </div>
            </div>
            {/* Bottom */}
            {description && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={headerTextStyle}>Description</div>
                <div style={descriptionTextStyle}>{description}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
