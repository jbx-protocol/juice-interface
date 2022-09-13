import { Col, Image } from 'antd'

import { VeNftTokenMetadata, VeNftVariant } from 'models/veNft'
import { useCallback } from 'react'
import { getVeNftBaseImage } from 'utils/veNft'

interface VeNftCarouselItemProps {
  variant?: VeNftVariant
  tokenMetadata?: VeNftTokenMetadata
  baseImagesHash: string
  handleImageClick: (variant: VeNftVariant) => void
  isActive: boolean
  dims?: number
}

const VeNftCarouselItem = ({
  variant,
  tokenMetadata,
  baseImagesHash,
  handleImageClick,
  isActive,
  dims,
}: VeNftCarouselItemProps) => {
  const imgDims = dims || 150
  const style = { opacity: isActive ? 1 : 0.3 }
  const labelStyle = {
    opacity: isActive ? 1 : 0.8,
  }

  const variantRangeInfo = (variant: VeNftVariant) => {
    return (
      <p style={{ textAlign: 'center', ...labelStyle }}>
        {variant.tokensStakedMin}-
        {variant.tokensStakedMax ? variant.tokensStakedMax : '+'}
      </p>
    )
  }

  const getCarouselImage = useCallback(
    ({ useFallback }: { useFallback: boolean }) => {
      if (!variant) {
        return undefined
      }

      if (isActive) {
        return tokenMetadata
          ? tokenMetadata.thumbnailUri
          : getVeNftBaseImage(baseImagesHash, variant, { useFallback })
      }
      return getVeNftBaseImage(baseImagesHash, variant, { useFallback })
    },
    [baseImagesHash, variant, isActive, tokenMetadata],
  )

  return (
    <Col span={8}>
      {variant && (
        <>
          <Image
            src={getCarouselImage({ useFallback: false })}
            fallback={getCarouselImage({ useFallback: true })}
            preview={false}
            style={style}
            width={imgDims}
            height={imgDims}
            onClick={() => handleImageClick(variant)}
          />
          {variantRangeInfo(variant)}
        </>
      )}
    </Col>
  )
}

export default VeNftCarouselItem
