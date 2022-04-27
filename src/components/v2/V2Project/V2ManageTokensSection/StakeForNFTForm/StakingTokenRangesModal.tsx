import { Col, Modal, Row, Image } from 'antd'
import { StakingNFT } from 'models/v2/stakingNFT'

type StakingTokenRangesModalProps = {
  visible: boolean
  stakingNFTs: StakingNFT[]
  tokenSymbol: string
  onCancel: VoidFunction
}

export default function StakingTokenRangesModal({
  visible,
  stakingNFTs,
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
      {stakingNFTs.map(nft => {
        const nftRange = `${nft.votingPowerMin}${
          nft.votingPowerMax ? `-${nft.votingPowerMax}` : '+'
        }`
        const nftRangeDifference = nft.votingPowerMax
          ? nft.votingPowerMax - nft.votingPowerMin + 1
          : '+'
        return (
          <Row>
            <Col span={6}>{nftRange}</Col>
            <Col span={8}>{nft.name}</Col>
            <Col span={6}>{nftRangeDifference}</Col>
            <Col span={4}>
              <Image src={nft.svg} preview={false} />
            </Col>
          </Row>
        )
      })}
    </Modal>
  )
}
