import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Row,
  Space,
  Tooltip,
} from 'antd'
import { useState } from 'react'
import { formattedNum, fromWad } from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { t, Trans } from '@lingui/macro'
import { useVeNftTokenMetadata } from 'hooks/veNft/VeNftTokenMetadata'
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
    <Card className="flex rounded-sm bg-smoke-25 p-4 dark:bg-slate-800">
      <div className="text-black dark:text-slate-100">
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
        <Space direction="vertical" className="w-full">
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
        open={extendLockModalVisible}
        onCancel={() => setExtendLockModalVisible(false)}
        token={token}
        onCompleted={() => setExtendLockModalVisible(false)}
      />
      <VeNftRedeemModal
        open={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        token={token}
        onCompleted={() => setRedeemModalVisible(false)}
      />
      <VeNftUnlockModal
        open={unlockModalVisible}
        onCancel={() => setUnlockModalVisible(false)}
        token={token}
        onCompleted={() => setUnlockModalVisible(false)}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
    </Card>
  )
}
