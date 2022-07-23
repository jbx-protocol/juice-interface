import { Row, Col, Image, FormInstance } from 'antd'
import { VeNftVariant } from 'models/v2/veNft'
import { getVeNftBaseImage } from 'utils/v2/veNft'

type StakingNFTCarouselProps = {
  tokensStaked: string
  variants: VeNftVariant[]
  baseImagesHash: string
  form: FormInstance
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMetadata: any
}

export default function StakingNFTCarousel({
  form,
  tokensStaked,
  variants,
  baseImagesHash,
  tokenMetadata,
}: StakingNFTCarouselProps) {
  const activeIdx = variants
    ? Math.max(
        variants.findIndex(variant => {
          const curTokens = parseInt(tokensStaked)
          return (
            variant.tokensStakedMin <= curTokens &&
            (variant.tokensStakedMax
              ? variant.tokensStakedMax > curTokens
              : true)
          )
        }),
        0,
      )
    : 0

  const prevVariant = activeIdx - 1 < 0 ? undefined : variants[activeIdx - 1]
  const prevVariantImage = prevVariant
    ? getVeNftBaseImage(baseImagesHash, prevVariant)
    : undefined
  const currentVariant = variants[activeIdx]
  const currentImage = tokenMetadata
    ? tokenMetadata.thumbnailUri
    : getVeNftBaseImage(baseImagesHash, currentVariant)
  const nextVariant =
    activeIdx + 1 >= variants.length ? undefined : variants[activeIdx + 1]
  const nextVariantImage = nextVariant
    ? getVeNftBaseImage(baseImagesHash, nextVariant)
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
