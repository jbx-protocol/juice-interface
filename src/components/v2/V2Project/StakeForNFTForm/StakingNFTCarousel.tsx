import { Row, Col, Image } from 'antd'
import { VeNftVariant } from 'models/v2/stakingNFT'
import { getNFTBaseImage } from 'utils/v2/nftProject'

type StakingNFTCarouselProps = {
  activeIdx: number
  variants: VeNftVariant[]
  baseImagesHash: string
}

export default function StakingNFTCarousel({
  activeIdx,
  variants,
  baseImagesHash,
}: StakingNFTCarouselProps) {
  const prevImage =
    activeIdx - 1 < 0
      ? undefined
      : getNFTBaseImage(baseImagesHash, variants[activeIdx - 1])
  const currentImage = getNFTBaseImage(baseImagesHash, variants[activeIdx])
  const nextImage =
    activeIdx + 1 >= variants.length
      ? undefined
      : getNFTBaseImage(baseImagesHash, variants[activeIdx + 1])

  const nonActiveStyle = { opacity: 0.3 }

  const dims = 150

  return (
    <Row>
      <Col span={8}>
        {prevImage && (
          <Image
            src={prevImage}
            preview={false}
            style={nonActiveStyle}
            width={dims}
            height={dims}
          />
        )}
      </Col>
      <Col span={8}>
        <Image src={currentImage} preview={false} width={dims} height={dims} />
      </Col>
      <Col span={8}>
        {nextImage && (
          <Image
            src={nextImage}
            preview={false}
            style={nonActiveStyle}
            width={dims}
            height={dims}
          />
        )}
      </Col>
    </Row>
  )
}
