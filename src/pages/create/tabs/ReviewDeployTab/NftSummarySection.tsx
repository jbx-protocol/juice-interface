import { Trans } from '@lingui/macro'
import { Col, Image, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Paragraph from 'components/Paragraph'
import { ThemeContext } from 'contexts/themeContext'
import { useAppSelector } from 'hooks/AppSelector'
import { useContext } from 'react'

export default function NftSummarySection() {
  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={{ marginBottom: 0 }}>
        <Trans>NFT rewards</Trans>
      </h2>
      {nftRewardTiers.map((rewardTier, index) => (
        <Row
          style={{
            borderBottom:
              index !== nftRewardTiers.length - 1
                ? `1px solid ${colors.stroke.tertiary}`
                : 'unset',
            display: 'flex',
            width: '100%',
            marginTop: 30,
            paddingBottom: '1.6875rem',
          }}
          key={index}
        >
          <Col
            md={3}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src={rewardTier.imageUrl ?? '/assets/banana-od.png'}
              alt={rewardTier.name}
              height="90px"
              width="90px"
              style={{ objectFit: 'cover' }}
            />
          </Col>
          <Col
            md={7}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <h3>{rewardTier.name}</h3>
            <p style={{ marginBottom: '10px' }}>
              <Trans>
                <strong>Contribution floor:</strong>{' '}
                {rewardTier.contributionFloor} ETH
              </Trans>
            </p>
            {rewardTier.externalLink && (
              <span>
                <Trans>
                  <strong>Website:</strong>{' '}
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
                  <strong>Description: </strong>
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
