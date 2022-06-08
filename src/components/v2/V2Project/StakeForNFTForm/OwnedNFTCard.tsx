import { Button, Card, Col, Row, Image } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { VeNftToken } from 'models/v2/stakingNFT'

import { useContext } from 'react'
import { formattedNum } from 'utils/formatNumber'
import { detailedTimeString } from 'utils/formatTime'
import { tokenSymbolText } from 'utils/tokenSymbolText'

type OwnedNFTCardProps = {
  token: VeNftToken
  idx: number
  tokenSymbol: string
}

export default function OwnedNFTCard({
  token,
  idx,
  tokenSymbol,
}: OwnedNFTCardProps) {
  const { lockInfo, metadata } = token
  const { amount, end, duration } = lockInfo
  const { thumbnailUri } = metadata

  const remaining = Math.round(end - Date.now() / 1000)

  const bordered = idx % 2 === 0

  const { colors } = useContext(ThemeContext).theme

  return (
    <Card
      bordered={bordered}
      style={{ marginTop: '20px', borderColor: colors.stroke.action.primary }}
    >
      <Row>
        <Col span={18}>
          <Row align="top" gutter={0}>
            <Col span={2}>{idx + 1}</Col>
            <Col span={10}>
              <p>Staked ${tokenSymbolText({ tokenSymbol })}:</p>
              <p>Staked period:</p>
            </Col>
            <Col span={12}>
              <p>{formattedNum(amount)}</p>
              <p>
                {detailedTimeString({
                  timeSeconds: duration,
                  fullWords: true,
                })}{' '}
                /{' '}
                {detailedTimeString({
                  timeSeconds: remaining,
                })}{' '}
                remaining
              </p>
            </Col>
          </Row>
          <Row align="top" gutter={0}>
            <Button block>EXTEND LOCK</Button>
          </Row>
        </Col>
        <Col span={6}>
          <Image src={thumbnailUri} alt="nft" preview={false} />
        </Col>
      </Row>
    </Card>
  )
}
