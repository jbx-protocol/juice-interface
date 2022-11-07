import { Trans } from '@lingui/macro'
import { Col, Image, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Paragraph from 'components/Paragraph'
import { NFT_IMAGE_SIDE_LENGTH } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftUpload'
import { ThemeContext } from 'contexts/themeContext'
import { useAppSelector } from 'hooks/AppSelector'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/NftRewards'
import { useContext } from 'react'

export default function NftSummarySection() {
  const {
    nftRewards: { rewardTiers },
  } = useAppSelector(state => state.editingV2Project)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div>
      <h4 style={{ marginBottom: 0, color: colors.text.primary }}>
        <Trans>NFTs</Trans>
      </h4>
      {rewardTiers?.map((rewardTier, index) => (
        <Row
          style={{
            borderBottom:
              index !== rewardTiers.length - 1
                ? `1px solid ${colors.stroke.tertiary}`
                : undefined,
            display: 'flex',
            width: '100%',
            padding: '1rem 0',
          }}
          key={index}
          gutter={16}
        >
          <Col
            md={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src={rewardTier.imageUrl ?? '/assets/banana-od.webp'}
              alt={rewardTier.name}
              height={NFT_IMAGE_SIDE_LENGTH}
              width={NFT_IMAGE_SIDE_LENGTH}
              style={{ objectFit: 'cover' }}
            />
          </Col>
          <Col
            md={8}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                color: colors.text.primary,
                fontSize: '1.2rem',
                fontWeight: 500,
              }}
            >
              {rewardTier.name}
            </span>
            <p style={{ marginBottom: 0 }}>
              <Trans>
                <span style={{ fontWeight: 500 }}>Contribution floor:</span>{' '}
                {rewardTier.contributionFloor} ETH
              </Trans>
            </p>
            {rewardTier.maxSupply &&
            rewardTier.maxSupply !== DEFAULT_NFT_MAX_SUPPLY ? (
              <span>
                <Trans>
                  <span style={{ fontWeight: 500 }}>Max. supply:</span>{' '}
                  <span>{rewardTier.maxSupply}</span>
                </Trans>
              </span>
            ) : null}
            {rewardTier.externalLink && (
              <span>
                <Trans>
                  <span style={{ fontWeight: 500 }}>Website:</span>{' '}
                  <ExternalLink href={rewardTier.externalLink}>
                    {rewardTier.externalLink}
                  </ExternalLink>
                </Trans>
              </span>
            )}
          </Col>
          <Col
            md={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {rewardTier.description && (
              <div style={{ marginTop: '47px' }}>
                <Trans>
                  <span style={{ fontWeight: 500 }}>Description: </span>
                  <Paragraph
                    description={rewardTier.description}
                    characterLimit={124}
                  />
                </Trans>
              </div>
            )}
          </Col>
        </Row>
      ))}
    </div>
  )
}
