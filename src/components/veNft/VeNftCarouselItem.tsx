import { Col } from 'antd'
import FallbackImage from 'components/FallbackImage'

import { VeNftTokenMetadata, VeNftVariant } from 'models/v2/veNft'
import { useCallback } from 'react'
import { getVeNftBaseImage } from 'utils/v2/veNft'

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
    (useFallback = false) => {
      if (!variant) {
        return undefined
      }

      if (isActive) {
        return tokenMetadata
          ? tokenMetadata.thumbnailUri
          : getVeNftBaseImage(baseImagesHash, variant, useFallback)
      }
      return getVeNftBaseImage(baseImagesHash, variant, useFallback)
    },
    [baseImagesHash, variant, isActive, tokenMetadata],
  )

  return (
    <Col span={8}>
      {variant && (
        <>
          <FallbackImage
            src={getCarouselImage()}
            fallbackSrc={getCarouselImage(true)}
            rest={{
              preview: false,
              style,
              width: imgDims,
              height: imgDims,
              onClick: () => handleImageClick(variant),
            }}
          />
          {variantRangeInfo(variant)}
        </>
      )}
    </Col>
  )
}

export default VeNftCarouselItem
