import { Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import Paragraph from 'components/shared/Paragraph'
import { ThemeContext } from 'contexts/themeContext'
import { useAppSelector } from 'hooks/AppSelector'
import { useContext } from 'react'

export default function NFTSummarySection() {
  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={{ marginBottom: 0 }}>
        <Trans>NFT rewards</Trans>
      </h2>
      {nftRewardTiers.forEach((rewardTier, index) => (
        <Row
          style={{
            borderBottom:
              index !== nftRewardTiers.length
                ? `1px solid ${colors.stroke.tertiary}`
                : 'unset',
            display: 'flex',
            width: '100%',
            paddingBottom: '15px',
          }}
          key={index}
        >
          <Col
            md={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={rewardTier.imageUrl}
              alt={rewardTier.name}
              height="75px"
            />
          </Col>
          <Col
            md={6}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <h3>{rewardTier.name}</h3>
            <p>
              <Trans>
                Contribution threshold: {rewardTier.paymentThreshold}
              </Trans>
            </p>
            <p>
              <Trans>Max. supply: {rewardTier.maxSupply}</Trans>
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
              <div style={{ fontSize: 13, marginTop: 15 }}>
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
