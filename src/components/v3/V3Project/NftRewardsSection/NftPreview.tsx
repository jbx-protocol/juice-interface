import { CloseOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import useMobile from 'hooks/Mobile'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/v3/NftRewards'
import { NftRewardTier } from 'models/nftRewardTier'
import { CSSProperties, useContext } from 'react'

import { darkColors } from 'constants/styles/colors'

const containerStyle: CSSProperties = {
  zIndex: 10000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.8)',
  overflow: 'auto',
}

const headerRowStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
}

const headerStyle: CSSProperties = {
  marginBottom: 0,
  color: darkColors.light0,
  fontWeight: 500,
}

const linkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: darkColors.light0,
}

const bodyTextStyle: CSSProperties = {
  display: 'flex',
  marginTop: '20px',
  fontSize: '0.75rem',
  color: darkColors.light0,
}

export function NftPreview({
  visible,
  rewardTier,
  onClose,
}: {
  visible: boolean
  rewardTier: NftRewardTier
  onClose: VoidFunction
}) {
  const isMobile = useMobile()

  const { projectMetadata } = useContext(V3ProjectContext)

  if (!visible) return null

  const hasLimitedSupply = Boolean(
    rewardTier.remainingSupply &&
      rewardTier.maxSupply &&
      rewardTier.remainingSupply !== DEFAULT_NFT_MAX_SUPPLY,
  )

  const maxImageDimensions = '600px'
  const containerWidth = !isMobile ? maxImageDimensions : '90vw'

  return (
    <div style={containerStyle} onClick={onClose}>
      <div
        style={{
          width: containerWidth,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={headerRowStyle}>
          <h3 style={{ ...headerStyle, textTransform: 'uppercase' }}>
            {projectMetadata?.name} – Tier {rewardTier.tierRank}
          </h3>
          <CloseOutlined onClick={onClose} style={{ paddingLeft: '15px' }} />
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          onClick={onClose}
        >
          <img
            alt={rewardTier.name}
            src={rewardTier.imageUrl}
            style={{
              maxWidth: containerWidth,
              maxHeight: !isMobile ? '60vh' : '50vh',
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
        <h3 style={{ ...headerStyle, marginTop: '20px' }}>{rewardTier.name}</h3>
        <p style={{ marginTop: '10px', color: darkColors.light0 }}>
          {rewardTier.description}
        </p>
        {hasLimitedSupply || rewardTier.externalLink ? (
          <div style={bodyTextStyle}>
            {hasLimitedSupply ? (
              <div>
                <Trans>
                  REMAINING SUPPLY: {rewardTier.remainingSupply}/
                  {rewardTier.maxSupply}
                </Trans>
              </div>
            ) : null}
            {rewardTier.externalLink ? (
              <ExternalLink
                href={rewardTier.externalLink}
                style={{
                  ...linkStyle,
                  marginLeft: hasLimitedSupply ? '25px' : 0,
                }}
              >
                <LinkOutlined style={{ fontSize: '1.1rem' }} />
                <span
                  style={{ textDecoration: 'underline', marginLeft: '5px' }}
                >
                  <Trans>LINK TO NFT</Trans>
                </span>
              </ExternalLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
