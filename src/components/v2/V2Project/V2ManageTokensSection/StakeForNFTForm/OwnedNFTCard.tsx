import { Button, Card, Col, Row, Image } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import moment from 'moment'

import { useContext } from 'react'
import { formattedNum } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import FormattedAddress from 'components/shared/FormattedAddress'

import { OwnedNFT } from './OwnedNFTSection'

type OwnedNFTCardProps = {
  nft: OwnedNFT
  idx: number
  tokenSymbol: string
}

export default function OwnedNFTCard({
  nft,
  idx,
  tokenSymbol,
}: OwnedNFTCardProps) {
  const { stakedAmount, startLockTime, stakedPeriod, delegate, nftSvg } = nft
  const bordered = idx % 2 === 0
  const formattedTime = moment(startLockTime).format('MM/DD/YYYY HH:MM:SS')

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
              <p>Start lock time:</p>
              <p>Staked period:</p>
              <p>Delegate:</p>
            </Col>
            <Col span={12}>
              <p>{formattedNum(stakedAmount)}</p>
              <p>{formattedTime}</p>
              <p>{stakedPeriod} days / 0 remaining</p>
              <p>
                <FormattedAddress address={delegate} />
              </p>
            </Col>
          </Row>
          <Row align="top" gutter={0}>
            <Button block>EXTEND LOCK</Button>
          </Row>
        </Col>
        <Col span={6}>
          <Image src={nftSvg} alt="nft" preview={false} />
        </Col>
      </Row>
    </Card>
  )
}
