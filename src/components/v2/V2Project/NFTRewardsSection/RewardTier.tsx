import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { MouseEventHandler, useContext } from 'react'

export function RewardTier({
  rewardTier,
  isSelected,
  onClick,
}: {
  rewardTier: NFTRewardTier
  isSelected: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '25px',
        cursor: 'pointer',
        transition: 'all 0s',
      }}
      onClick={onClick}
    >
      <div
        style={{
          backgroundColor: colors.background.l1,
          width: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          alt={rewardTier.name}
          src={rewardTier.imageUrl}
          height={'100px'}
          style={{
            objectFit: 'cover',
            width: '100px',
            opacity: isSelected ? '100%' : '30%',
          }}
        />
      </div>
      <Tooltip
        title={
          <Trans>
            Receive the <strong>{rewardTier.name}</strong> NFT when you
            contribute over <strong>{rewardTier.paymentThreshold} ETH</strong>.
          </Trans>
        }
        placement={'bottom'}
      >
        <span
          style={{
            fontWeight: isSelected ? 500 : 400,
            marginTop: '3px',
            fontSize: 13,
          }}
        >
          {rewardTier.paymentThreshold} ETH
        </span>
      </Tooltip>
    </div>
  )
}
