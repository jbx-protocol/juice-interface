import {
  Button,
  Card,
  Col,
  Row,
  Image,
  Space,
  Tooltip,
  Descriptions,
} from 'antd'

import { ThemeContext } from 'contexts/themeContext'

import { CSSProperties, useContext, useState } from 'react'
import { formattedNum, fromWad } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'

import { useVeNftTokenMetadata } from 'hooks/veNft/VeNftTokenMetadata'
import { t, Trans } from '@lingui/macro'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'

import VeNftExtendLockModal from './VeNftExtendLockModal'
import VeNftRedeemModal from './VeNftRedeemModal'
import VeNftUnlockModal from './VeNftUnlockModal'

type OwnedVeNftCardProps = {
  token: VeNftToken
  tokenSymbolDisplayText: string
  hasOverflow: boolean | undefined
}

export default function OwnedVeNftCard({
  token,
  tokenSymbolDisplayText,
  hasOverflow,
}: OwnedVeNftCardProps) {
  const [extendLockModalVisible, setExtendLockModalVisible] = useState(false)
  const [redeemModalVisible, setRedeemModalVisible] = useState(false)
  const [unlockModalVisible, setUnlockModalVisible] = useState(false)

  const { lockAmount, lockEnd, lockDuration } = token
  const { data: metadata } = useVeNftTokenMetadata(token.tokenUri)
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
    if (hasOverflow) {
      return (
        <Button block onClick={() => setRedeemModalVisible(true)}>
          <Trans>Redeem</Trans>
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
            <Trans>Redeem</Trans>
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
            <Descriptions column={1}>
              <Descriptions.Item label={t`Locked ${tokenSymbolDisplayText}`}>
                {formattedNum(fromWad(lockAmount))}
              </Descriptions.Item>
              <Descriptions.Item label={t`Lock Duration`}>
                {detailedTimeString({
                  timeSeconds: lockDuration,
                  fullWords: true,
                })}
              </Descriptions.Item>
              <Descriptions.Item label={t`Time Remaining`}>
                {detailedTimeString({
                  timeSeconds: remaining,
                })}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={4} />
          <Col span={6}>
            <Image src={thumbnailUri} alt="nft" preview={false} />
          </Col>
        </Row>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row>
            <Button block onClick={() => setExtendLockModalVisible(true)}>
              <Trans>Extend Lock</Trans>
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
                <Trans>Unlock</Trans>
              </Button>
            </Row>
          )}
        </Space>
      </div>
      <VeNftExtendLockModal
        visible={extendLockModalVisible}
        onCancel={() => setExtendLockModalVisible(false)}
      />
      <VeNftRedeemModal
        visible={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
      />
      <VeNftUnlockModal
        visible={unlockModalVisible}
        onCancel={() => setUnlockModalVisible(false)}
      />
    </Card>
  )
}
