import { Trans } from '@lingui/macro'
import { Col, Modal, Row, Image } from 'antd'
import { VeNftProjectContext } from 'contexts/v2/veNftProjectContext'
import { useContext } from 'react'
import { getNFTBaseImage } from 'utils/v2/nftProject'

type StakingTokenRangesModalProps = {
  visible: boolean
  tokenSymbol: string
  onCancel: VoidFunction
}

export default function StakingTokenRangesModal({
  visible,
  tokenSymbol,
  onCancel,
}: StakingTokenRangesModalProps) {
  const { baseImagesHash, variants } = useContext(VeNftProjectContext)

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Close"
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Row>
        <Col span={6}>
          <Trans>{tokenSymbol} range</Trans>
        </Col>
        <Col span={8}>NFT</Col>
        <Col span={6}>
          <Trans>Range</Trans>
        </Col>
        <Col span={4}>
          <Trans>Character</Trans>
        </Col>
      </Row>
      {variants &&
        baseImagesHash &&
        variants.map(variant => {
          const image = getNFTBaseImage(baseImagesHash, variant)
          const nftRange = `${variant.tokensStakedMin}${
            variant.tokensStakedMax ? `-${variant.tokensStakedMax}` : '+'
          }`
          const nftRangeDifference = variant.tokensStakedMax
            ? variant.tokensStakedMax - variant.tokensStakedMin + 1
            : '+'
          return (
            <Row key={variant.id}>
              <Col span={6}>{nftRange}</Col>
              <Col span={8}>{variant.name}</Col>
              <Col span={6}>{nftRangeDifference}</Col>
              <Col span={4}>
                <Image src={image} preview={false} />
              </Col>
            </Row>
          )
        })}
    </Modal>
  )
}
