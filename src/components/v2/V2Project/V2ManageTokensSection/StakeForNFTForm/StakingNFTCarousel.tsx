import { Row, Col, Image } from 'antd'
import { StakingNFT } from 'models/v2/stakingNFT'

type StakingNFTCarouselProps = {
  activeIdx: number
  stakingNFTs: StakingNFT[]
}

export default function StakingNFTCarousel({
  activeIdx,
  stakingNFTs,
}: StakingNFTCarouselProps) {
  const prevNFTsvg =
    activeIdx - 1 < 0 ? undefined : stakingNFTs[activeIdx - 1].svg
  const currentNFTsvg = stakingNFTs[activeIdx].svg
  const nextNFTsvg =
    activeIdx + 1 >= stakingNFTs.length
      ? undefined
      : stakingNFTs[activeIdx + 1].svg
  const nonActiveStyle = { opacity: 0.3 }

  return (
    <Row>
      <Col span={8}>
        {prevNFTsvg && (
          <Image src={prevNFTsvg} preview={false} style={nonActiveStyle} />
        )}
      </Col>
      <Col span={8}>
        <Image src={currentNFTsvg} preview={false} />
      </Col>
      <Col span={8}>
        {nextNFTsvg && (
          <Image src={nextNFTsvg} preview={false} style={nonActiveStyle} />
        )}
      </Col>
    </Row>
  )
}
