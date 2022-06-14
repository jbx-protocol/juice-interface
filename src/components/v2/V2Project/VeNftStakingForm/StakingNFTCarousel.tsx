import { Row, Col, Image, FormInstance } from 'antd'
import { VeNftVariant } from 'models/veNft/veNftVariant'
import { getNFTBaseImage } from 'utils/v2/nftProject'

type StakingNFTCarouselProps = {
  activeIdx: number
  variants: VeNftVariant[]
  baseImagesHash: string
  form: FormInstance
}

export default function StakingNFTCarousel({
  form,
  activeIdx,
  variants,
  baseImagesHash,
}: StakingNFTCarouselProps) {
  const prevVariant = activeIdx - 1 < 0 ? undefined : variants[activeIdx - 1]
  const prevVariantImage = prevVariant
    ? getNFTBaseImage(baseImagesHash, prevVariant)
    : undefined
  const currentVariant = variants[activeIdx]
  const currentImage = getNFTBaseImage(baseImagesHash, currentVariant)
  const nextVariant =
    activeIdx + 1 >= variants.length ? undefined : variants[activeIdx + 1]
  const nextVariantImage = nextVariant
    ? getNFTBaseImage(baseImagesHash, nextVariant)
    : undefined

  const nonActiveStyle = { opacity: 0.3 }

  const handleImageClick = (variant: VeNftVariant) => {
    form.setFieldsValue({ tokensStaked: variant.tokensStakedMin })
  }

  const dims = 150

  const variantRangeInfo = (variant: VeNftVariant, opacity?: number) => {
    return (
      <p style={{ textAlign: 'center', opacity: opacity }}>
        {variant.tokensStakedMin}-
        {variant.tokensStakedMax ? variant.tokensStakedMax : '+'}
      </p>
    )
  }

  return (
    <Row>
      <Col span={8}>
        {prevVariant && (
          <>
            <div onClick={() => handleImageClick(prevVariant)}>
              <Image
                src={prevVariantImage}
                preview={false}
                style={nonActiveStyle}
                width={dims}
                height={dims}
              />
            </div>
            {variantRangeInfo(prevVariant, 0.8)}
          </>
        )}
      </Col>
      <Col span={8}>
        <div onClick={() => handleImageClick(currentVariant)}>
          <Image
            src={currentImage}
            preview={false}
            width={dims}
            height={dims}
          />
        </div>
        {variantRangeInfo(currentVariant)}
      </Col>
      <Col span={8}>
        {nextVariant && (
          <>
            <div onClick={() => handleImageClick(nextVariant)}>
              <Image
                src={nextVariantImage}
                preview={false}
                style={nonActiveStyle}
                width={dims}
                height={dims}
              />
            </div>
            {variantRangeInfo(nextVariant, 0.8)}
          </>
        )}
      </Col>
    </Row>
  )
}
