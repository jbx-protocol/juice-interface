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
  // const nonActiveStyle = { opacity: 0.3 }

  const dims = 150

  const nftimg =
    'https://gateway.pinata.cloud/ipfs/bafybeifmoblvbbtir5xf3dtfk727m7olmji4r4pmd7r3lfbjip2bdllxfi/281s.png'

  return (
    <Row>
      {/* <Col span={8}>
        {prevNFTsvg && (
          <Image
            src={nftimg}
            preview={false}
            style={nonActiveStyle}
            width={dims}
            height={dims}
          />
        )}
      </Col> */}
      <Col span={8}>
        <Image src={nftimg} preview={false} width={dims} height={dims} />
      </Col>
      {/* <Col span={8}>
        {nextNFTsvg && (
          <Image
            src={nftimg}
            preview={false}
            style={nonActiveStyle}
            width={dims}
            height={dims}
          />
        )}
      </Col> */}
    </Row>
  )
}
