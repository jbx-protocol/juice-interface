import { Trans } from '@lingui/macro'
import { Col, Image, Modal, Row } from 'antd'
import { VARIANTS_HASH } from 'constants/veNft/veNftProject'
import { useVeNftVariants } from 'hooks/veNft/VeNftVariants'
import { getVeNftBaseImage } from 'utils/veNft'

type StakingTokenRangesModalProps = {
  open: boolean
  tokenSymbolDisplayText: string
  onCancel: VoidFunction
}

export default function StakingTokenRangesModal({
  open,
  tokenSymbolDisplayText,
  onCancel,
}: StakingTokenRangesModalProps) {
  const { data: variants } = useVeNftVariants()

  return (
    <Modal
      open={open}
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
        variants.map(variant => {
          const image = getVeNftBaseImage(VARIANTS_HASH, variant, {
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
