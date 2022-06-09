import { Button, Card, Col, Row, Image, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { VeNftToken } from 'models/v2/stakingNFT'

import { CSSProperties, useContext, useState } from 'react'
import { formattedNum } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ExtendLockModal from './ExtendLockModal'
import RedeemVeNftModal from './RedeemVeNftModal'

type OwnedNFTCardProps = {
  token: VeNftToken
  tokenSymbol: string
}

export default function OwnedNFTCard({
  token,
  tokenSymbol,
}: OwnedNFTCardProps) {
  const [extendLockModalVisible, setExtendLockModalVisible] = useState(false)
  const [redeemModalVisible, setRedeemModalVisible] = useState(false)

  const { lockInfo, metadata } = token
  const { amount, end, duration } = lockInfo
  const { thumbnailUri } = metadata

  const remaining = Math.max(Math.round(end - Date.now() / 1000), 0)

  const { colors, radii } = useContext(ThemeContext).theme

  const cardStyles: CSSProperties = {
    display: 'flex',
    padding: '1rem',
    borderRadius: radii.md,
    background: colors.background.l0,
  }

  return (
    <Card style={cardStyles}>
      <div style={{ color: colors.text.primary }}>
        <Row>
          <Col span={14}>
            <Row align="top" gutter={0}>
              <Col span={12}>
                <p>Staked ${tokenSymbolText({ tokenSymbol })}:</p>
                <p>Stake duration:</p>
                <p>Time remaining:</p>
              </Col>
              <Col span={12}>
                <p>{formattedNum(amount)}</p>
                <p>
                  {detailedTimeString({
                    timeSeconds: duration,
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
              EXTEND LOCK
            </Button>
          </Row>
          <Row>
            <Button
              block
              disabled={remaining > 0}
              onClick={() => setRedeemModalVisible(true)}
            >
              REDEEM
            </Button>
          </Row>
        </Space>
      </div>
      <ExtendLockModal
        visible={extendLockModalVisible}
        onCancel={() => setExtendLockModalVisible(false)}
      />
      <RedeemVeNftModal
        visible={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
      />
    </Card>
  )
}
