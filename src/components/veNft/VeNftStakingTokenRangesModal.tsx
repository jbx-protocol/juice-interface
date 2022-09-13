import { Trans } from '@lingui/macro'
import { Col, Image, Modal, Row } from 'antd'
import { VeNftContext } from 'contexts/veNftContext'
import { useContext } from 'react'
import { getVeNftBaseImage } from 'utils/veNft'

type StakingTokenRangesModalProps = {
  visible: boolean
  tokenSymbolDisplayText: string
  onCancel: VoidFunction
}

export default function StakingTokenRangesModal({
  visible,
  tokenSymbolDisplayText,
  onCancel,
}: StakingTokenRangesModalProps) {
  const { baseImagesHash, variants } = useContext(VeNftContext)

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Close"
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Row>
        <Col span={6}>
          <Trans>{tokenSymbolDisplayText} range</Trans>
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
          const image = getVeNftBaseImage(baseImagesHash, variant, {
            useFallback: true,
          })
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
