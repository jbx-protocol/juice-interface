import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { CSSProperties, MouseEventHandler, useContext } from 'react'

import { LockOutlined, CheckOutlined } from '@ant-design/icons'

export function RewardTier({
  rewardTier,
  rewardTierUpperLimit,
  isSelected,
  notEligible,
  onClick,
}: {
  rewardTier: NftRewardTier
  rewardTierUpperLimit: number | undefined
  isSelected: boolean
  notEligible: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const backgroundColor = isSelected
    ? colors.background.l0
    : colors.background.l2

  const imageHeight = '146px'

  function RewardIcon() {
    const iconStyle: CSSProperties = {
      position: 'absolute',
      right: 25,
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
                <strong>{rewardTier.contributionFloor}</strong> - {'<'}
                <strong>{rewardTierUpperLimit} ETH</strong>.
              </Trans>
            ) : (
              <Trans>
                Receive this NFT when you contribute at least{' '}
                <strong>{rewardTier.contributionFloor} ETH</strong>.
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
          {isSelected ? <CheckOutlined /> : <LockOutlined />}
        </div>
      </Tooltip>
    )
  }

  return (
    <div
      className={`${isSelected ? 'selected-box-shadow' : ''} hover-box-shadow`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: 'pointer',
        outline: isSelected
          ? `2px solid ${colors.stroke.action.primary}`
          : 'rgba(0,0,0,0)',
        transition: 'box-shadow 0.25s',
      }}
      onClick={onClick}
      role="button"
    >
      {/* Image container */}
      <div
        style={{
          backgroundColor,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: imageHeight,
        }}
      >
        <img
          alt={rewardTier.name}
          src={rewardTier.imageUrl}
          style={{
            objectFit: 'cover',
            width: '100%',
            maxHeight: imageHeight,
            filter: isSelected ? 'unset' : 'brightness(50%)',
          }}
        />
        {isSelected || notEligible ? <RewardIcon /> : null}
      </div>
      {/* Details section below image */}
      <div
        style={{
          backgroundColor,
          width: '100%',
          padding: '8px 10px 5px',
          borderTop: `1px solid ${colors.stroke.tertiary}`,
        }}
      >
        <h5
          style={{
            color: isSelected ? colors.text.primary : colors.text.tertiary,
            marginBottom: 0,
            lineHeight: '13px',
          }}
        >
          {rewardTier.name}
        </h5>
        <span
          style={{
            color: colors.text.secondary,
            fontSize: '0.7rem',
          }}
        >
          {rewardTier.contributionFloor} ETH
        </span>
      </div>
    </div>
  )
}
