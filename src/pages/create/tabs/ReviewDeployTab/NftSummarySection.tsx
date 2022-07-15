import { Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
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
            paddingBottom: '15px',
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
            <img
              src={rewardTier.imageUrl ?? '/assets/banana-od.png'}
              alt={rewardTier.name}
              height="75px"
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
                <strong>Contribution threshold:</strong>{' '}
                {rewardTier.contributionFloor} ETH
              </Trans>
            </p>
            <p style={{ marginBottom: '10px' }}>
              <Trans>
                <strong>Max. supply:</strong> {rewardTier.maxSupply}
              </Trans>
            </p>
          </Col>
          <Col
            md={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {rewardTier.externalLink && (
              <Trans>
                <strong>External link: {rewardTier.externalLink}</strong>
              </Trans>
            )}
            {rewardTier.description && (
              <div style={{ marginTop: 15 }}>
                <Trans>
                  <strong>Description: </strong>
                  <Paragraph
                    description={rewardTier.description}
                    characterLimit={74}
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
