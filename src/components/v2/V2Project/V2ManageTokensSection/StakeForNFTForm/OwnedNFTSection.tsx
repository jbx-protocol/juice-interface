import { tokenSymbolText } from 'utils/tokenSymbolText'

import OwnedNFTCard from './OwnedNFTCard'

export type OwnedNFT = {
  stakedAmount: number
  startLockTime: Date
  stakedPeriod: number
  delegate: string
  nftSvg: string
}

type OwnedNFTsSectionProps = {
  ownedNFTs: OwnedNFT[]
  tokenSymbol: string
}

export default function OwnedNFTsSection({
  ownedNFTs,
  tokenSymbol,
}: OwnedNFTsSectionProps) {
  return (
    <div>
      <h3>$ve{tokenSymbolText({ tokenSymbol })} NFTs:</h3>
      {ownedNFTs.map((nft, i) => (
        <OwnedNFTCard key={i} nft={nft} idx={i} tokenSymbol={tokenSymbol} />
      ))}
    </div>
  )
}
