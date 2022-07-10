import { Tooltip } from 'antd'
import Paragraph from 'components/Paragraph'
import SectionHeader from 'components/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { MouseEventHandler, useContext } from 'react'

export function RewardTier({
  rewardTier,
  isSelected,
  isUnsaturated, // unsaturate
  onClick,
}: {
  rewardTier: NFTRewardTier
  isSelected: boolean
  isUnsaturated: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Tooltip
      title={
        <>
          <SectionHeader text={rewardTier.name} />
          <Paragraph description={rewardTier.description} characterLimit={74} />
        </>
      }
      placement={'bottom'}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          marginRight: '15px',
          padding: '10px 10px 5px 10px',
          cursor: 'pointer',
          transition: 'all 0s',
          backgroundColor: isSelected ? colors.background.l2 : 'unset',
          boxShadow: isSelected ? '10px 10px ' + colors.background.l1 : 'unset',
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
              filter: isUnsaturated ? 'grayscale(100%)' : 'unset',
              objectFit: 'cover',
              width: '100px',
            }}
          />
        </div>
        <span style={{ fontWeight: 500, marginTop: '5px' }}>
          {rewardTier.paymentThreshold} ETH
        </span>
      </div>
    </Tooltip>
  )
}
