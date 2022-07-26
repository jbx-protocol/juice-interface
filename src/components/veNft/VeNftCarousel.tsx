import { Row, FormInstance } from 'antd'
import { VeNftTokenMetadata, VeNftVariant } from 'models/v2/veNft'

import VeNftCarouselItem from 'components/veNft/VeNftCarouselItem'

type StakingNFTCarouselProps = {
  tokensStaked: string
  variants: VeNftVariant[]
  baseImagesHash: string
  form: FormInstance
  tokenMetadata: VeNftTokenMetadata | undefined
}

export default function VeNftCarousel({
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
  const currentVariant = variants[activeIdx]
  const nextVariant =
    activeIdx + 1 >= variants.length ? undefined : variants[activeIdx + 1]

  const handleImageClick = (variant: VeNftVariant) => {
    form.setFieldsValue({ tokensStaked: variant.tokensStakedMin })
  }

  return (
    <Row>
      <VeNftCarouselItem
        variant={prevVariant}
        baseImagesHash={baseImagesHash}
        isActive={false}
        handleImageClick={handleImageClick}
      />
      <VeNftCarouselItem
        variant={currentVariant}
        tokenMetadata={tokenMetadata}
        baseImagesHash={baseImagesHash}
        isActive={true}
        handleImageClick={handleImageClick}
      />
      <VeNftCarouselItem
        variant={nextVariant}
        baseImagesHash={baseImagesHash}
        isActive={false}
        handleImageClick={handleImageClick}
      />
    </Row>
  )
}
