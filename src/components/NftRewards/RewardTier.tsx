import { Trans } from '@lingui/macro'
import { Skeleton, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { NftRewardTier } from 'models/nftRewardTier'
import { CSSProperties, MouseEventHandler, useContext, useState } from 'react'

import { CheckOutlined, LoadingOutlined } from '@ant-design/icons'

import { NftPreview } from './NftPreview'

const rewardTierContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  cursor: 'pointer',
  transition: 'box-shadow 100ms linear',
  height: '100%',
}

const loadingImageContainerStyle: CSSProperties = {
  width: '100%',
  height: '151px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const imageStyle: CSSProperties = {
  objectFit: 'cover',
  width: '100%',
  position: 'absolute',
  top: 0,
  height: '100%',
}

const nftTitleSectionStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center,',
}

const imageContainerStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
}

// The clickable cards on the project page
export function RewardTier({
  loading,
  tierRank,
  rewardTier,
  rewardTierUpperLimit,
  isSelected,
  onClick,
}: {
  loading?: boolean
  tierRank?: number
  rewardTier?: NftRewardTier
  rewardTierUpperLimit?: number | undefined
  isSelected?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  const backgroundColor = isSelected
    ? colors.background.l0
    : colors.background.l2

  function RewardIcon() {
    const iconStyle: CSSProperties = {
      position: 'absolute',
      right: 10,
      top: 10,
      fontSize: 15,
      color: isSelected ? colors.background.l0 : colors.text.secondary,
      backgroundColor: isSelected
        ? colors.background.action.primary
        : colors.background.l0,
      borderRadius: '100%',
      height: '25px',
      width: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }

    return (
      <Tooltip
        title={
          <span style={{ fontSize: '0.7rem' }}>
            {rewardTierUpperLimit ? (
              <Trans>
                Receive this NFT when you contribute{' '}
                <strong>{rewardTier?.contributionFloor}</strong> - {'<'}
                <strong>{rewardTierUpperLimit} ETH</strong>.
              </Trans>
            ) : (
              <Trans>
                Receive this NFT when you contribute at least{' '}
                <strong>{rewardTier?.contributionFloor} ETH</strong>.
              </Trans>
            )}
          </span>
        }
        overlayInnerStyle={{
          padding: '7px 10px',
          lineHeight: '1rem',
          maxWidth: '210px',
        }}
        placement={'bottom'}
      >
        <div style={iconStyle}>
          <CheckOutlined />
        </div>
      </Tooltip>
    )
  }

  return (
    <>
      <div
        className={`${isSelected ? 'selected-box-shadow' : ''}`}
        style={{
          ...rewardTierContainerStyle,
          outline: isSelected
            ? `2px solid ${colors.stroke.action.primary}`
            : 'rgba(0,0,0,0)',
          borderRadius: radii.sm,
          transition: 'box-shadow 100ms linear',
        }}
        onClick={!isSelected ? onClick : () => setPreviewVisible(true)}
        role="button"
      >
        {/* Image container */}
        <div
          style={{
            ...imageContainerStyle,
            paddingTop: !loading ? '100%' : 'unset',
            backgroundColor,
          }}
        >
          {loading ? (
            <div
              style={{
                ...loadingImageContainerStyle,
                borderBottom: `1px solid ${colors.stroke.tertiary}`,
              }}
            >
              <LoadingOutlined />
            </div>
          ) : (
            <img
              alt={rewardTier?.name}
              src={rewardTier?.imageUrl}
              style={{
                ...imageStyle,
                filter: isSelected ? 'unset' : 'brightness(50%)',
              }}
            />
          )}
          {isSelected ? <RewardIcon /> : null}
        </div>
        {/* Details section below image */}
        <div
          style={{
            ...nftTitleSectionStyle,
            backgroundColor,
            padding: `${!loading ? 8 : 4}px 10px 5px`,
          }}
        >
          <Skeleton
            loading={loading}
            active
            title={false}
            paragraph={{ rows: 1, width: ['100%'] }}
          >
            <h5
              style={{
                color: isSelected ? colors.text.primary : colors.text.tertiary,
                marginBottom: 0,
                lineHeight: '13px',
              }}
            >
              {rewardTier?.name}
            </h5>
          </Skeleton>
          <Skeleton
            loading={loading}
            active
            title={false}
            paragraph={{ rows: 1, width: ['50%'] }}
            style={{ marginTop: '3px' }}
          >
            <span
              style={{
                color: colors.text.secondary,
                fontSize: '0.7rem',
              }}
            >
              {rewardTier?.contributionFloor} ETH
            </span>
          </Skeleton>
        </div>
      </div>
      {rewardTier && tierRank ? (
        <NftPreview
          visible={previewVisible}
          tierRank={tierRank}
          rewardTier={rewardTier}
          onClose={() => setPreviewVisible(false)}
        />
      ) : null}
    </>
  )
}
