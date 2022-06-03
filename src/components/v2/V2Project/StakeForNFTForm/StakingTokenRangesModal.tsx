import { Col, Modal, Row } from 'antd'

type StakingTokenRangesModalProps = {
  visible: boolean
  tokenSymbol: string
  onCancel: VoidFunction
}

export default function StakingTokenRangesModal({
  visible,
  tokenSymbol,
  onCancel,
}: StakingTokenRangesModalProps) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Close"
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Row>
        <Col span={6}>{tokenSymbol} range</Col>
        <Col span={8}>NFT</Col>
        <Col span={6}>Range</Col>
        <Col span={4}>Banny</Col>
      </Row>
      {/* {nftProject.nfts.map(nft => {
        const image = getNFTBaseImage(nftProject, nft)
        const nftRange = `${nft.tokensStakedMin}${
          nft.tokensStakedMax ? `-${nft.tokensStakedMax}` : '+'
        }`
        const nftRangeDifference = nft.tokensStakedMax
          ? nft.tokensStakedMax - nft.tokensStakedMin + 1
          : '+'
        return (
          <Row>
            <Col span={6}>{nftRange}</Col>
            <Col span={8}>{nft.name}</Col>
            <Col span={6}>{nftRangeDifference}</Col>
            <Col span={4}>
              <Image src={image} preview={false} />
            </Col>
          </Row>
        )
      })} */}
    </Modal>
  )
}
