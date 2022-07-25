import { Col, Image } from 'antd'
import { VeNftTokenMetadata, VeNftVariant } from 'models/v2/veNft'
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

  const getCarouselImage = () => {
    if (!variant) {
      return undefined
    }
    if (isActive) {
      return tokenMetadata
        ? tokenMetadata.thumbnailUri
        : getVeNftBaseImage(baseImagesHash, variant)
    }
    return getVeNftBaseImage(baseImagesHash, variant)
  }

  return (
    <Col span={8}>
      {variant && (
        <>
          <Image
            src={getCarouselImage()}
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
