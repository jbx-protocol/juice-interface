import { Button, Card, Col, Row, Image, Space, Tooltip } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { VeNftToken } from 'models/subgraph-entities/veNft/venft-token'

import { CSSProperties, useContext, useState } from 'react'
import { formattedNum, fromWad } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ExtendLockModal from 'components/v2/V2Project/VeNftStakingForm/ExtendLockModal'
import RedeemVeNftModal from 'components/v2/V2Project/VeNftStakingForm/RedeemVeNftModal'
import UnlockModal from 'components/v2/V2Project/VeNftStakingForm/UnlockModal'
import { useNFTMetadata } from 'hooks/veNft/VeNftMetadata'
import { Trans } from '@lingui/macro'

type OwnedNFTCardProps = {
  token: VeNftToken
  tokenSymbol: string
  hasOverflow: boolean | undefined
}

export default function OwnedNFTCard({
  token,
  tokenSymbol,
  hasOverflow,
}: OwnedNFTCardProps) {
  const [extendLockModalVisible, setExtendLockModalVisible] = useState(false)
  const [redeemModalVisible, setRedeemModalVisible] = useState(false)
  const [unlockModalVisible, setUnlockModalVisible] = useState(false)

  const { lockAmount, lockEnd, lockDuration } = token
  const { data: metadata } = useNFTMetadata(token.tokenUri)
  const thumbnailUri = metadata?.thumbnailUri

  const remaining = Math.max(Math.round(lockEnd - Date.now() / 1000), 0)

  const { colors, radii } = useContext(ThemeContext).theme

  const cardStyles: CSSProperties = {
    display: 'flex',
    padding: '1rem',
    borderRadius: radii.md,
    background: colors.background.l0,
  }

  const renderRedeemButton = () => {
    if (!hasOverflow) {
      return (
        <Button block onClick={() => setRedeemModalVisible(true)}>
          <Trans>REDEEM</Trans>
        </Button>
      )
    } else {
      return (
        <Tooltip
          trigger={['hover']}
          title={
            <Trans>
              A veNft can only be redeemed if the project currently has
              overflow.
            </Trans>
          }
        >
          <Button block disabled>
            <Trans>REDEEM</Trans>
          </Button>
        </Tooltip>
      )
    }
  }

  return (
    <Card style={cardStyles}>
      <div style={{ color: colors.text.primary }}>
        <Row>
          <Col span={14}>
            <Row align="top" gutter={0}>
              <Col span={12}>
                <p>
                  <Trans>Staked ${tokenSymbolText({ tokenSymbol })}:</Trans>
                </p>
                <p>
                  <Trans>Stake duration:</Trans>
                </p>
                <p>
                  <Trans>Time remaining:</Trans>
                </p>
              </Col>
              <Col span={12}>
                <p>{formattedNum(fromWad(lockAmount))}</p>
                <p>
                  {detailedTimeString({
                    timeSeconds: lockDuration,
                    fullWords: true,
                  })}
                </p>
                <p>
                  {detailedTimeString({
                    timeSeconds: remaining,
                  })}{' '}
                </p>
              </Col>
            </Row>
            <Row align="top" gutter={0}></Row>
          </Col>
          <Col span={4} />
          <Col span={6}>
            <Image src={thumbnailUri} alt="nft" preview={false} />
          </Col>
        </Row>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row>
            <Button block onClick={() => setExtendLockModalVisible(true)}>
              <Trans>EXTEND LOCK</Trans>
            </Button>
          </Row>
          <Row>{renderRedeemButton()}</Row>
          {remaining === 0 && (
            <Row>
              <Button
                block
                disabled={remaining > 0}
                onClick={() => setUnlockModalVisible(true)}
              >
                <Trans>UNLOCK</Trans>
              </Button>
            </Row>
          )}
        </Space>
      </div>
      <ExtendLockModal
        visible={extendLockModalVisible}
        onCancel={() => setExtendLockModalVisible(false)}
        onCompleted={() => setExtendLockModalVisible(false)}
        token={token}
      />
      <RedeemVeNftModal
        token={token}
        visible={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
      />
      <UnlockModal
        visible={unlockModalVisible}
        onCancel={() => setUnlockModalVisible(false)}
        onCompleted={() => setUnlockModalVisible(false)}
        token={token}
        tokenSymbol={tokenSymbol}
      />
    </Card>
  )
}
