import { VeNftToken } from 'models/v2/stakingNFT'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import OwnedNFTCard from './OwnedNFTCard'

type OwnedNFTsSectionProps = {
  userTokens: VeNftToken[]
  tokenSymbol: string
}

export default function OwnedNFTSection({
  userTokens,
  tokenSymbol,
}: OwnedNFTsSectionProps) {
  return (
    <div>
      <h3>$ve{tokenSymbolText({ tokenSymbol })} NFTs:</h3>
      {userTokens.map((token, i) => (
        <OwnedNFTCard key={i} token={token} idx={i} tokenSymbol={tokenSymbol} />
      ))}
    </div>
  )
}
