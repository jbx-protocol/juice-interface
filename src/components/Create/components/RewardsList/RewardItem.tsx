import { LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { CSSProperties } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
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
  title,
  minimumContribution,
  description,
  maximumSupply,
  url,
  imgUrl,
}: Reward) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tier line */}
      <div style={{ ...emphasisedTextStyle, fontSize: '1.125rem' }}>
        <Trans>Tier {tier}</Trans>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Main Body */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Image Col */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {/* Image */}
            <img
              src={imgUrl.toString()}
              style={{
                width: '11rem',
                height: '11rem',
              }}
            />
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
              <div style={detailsTextStyle}>Supply: {maximumSupply}</div>
              <div
                style={{
                  ...detailsTextStyle,
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <LinkOutlined />
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <ExternalLink
                    href={url.toString()}
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                  />
                </div>
              </div>
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
                  {formatCurrencyAmount(minimumContribution)}
                </div>
              </div>
            </div>
            {/* Bottom */}
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
          </div>
        </div>
        {/* Edit Button */}
        <Button
          type="link"
          style={{
            position: 'absolute',
            display: 'flex',
            padding: 0,
            top: 0,
            left: '100%',
            marginLeft: '2rem',
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  )
}
