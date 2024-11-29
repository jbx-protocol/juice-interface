import Loading from 'components/Loading'
import { NfTsQuery } from 'generated/graphql'
import { useJB721DelegateTokenToNftReward } from '../hooks/useJB721DelegateTokenToNftReward'
import { RedeemNftTile } from './RedeemNftTile'

function RedeemNftTileLoader({ nft }: { nft: NfTsQuery['nfts'][number] }) {
  const tokenId = nft.tokenId.toHexString()
  const _nft = {
    ...nft,
    tokenId,
  }
  const { data: rewardTier } = useJB721DelegateTokenToNftReward(_nft)
  if (!rewardTier)
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-smoke-100">
        <Loading size="small" />
      </div>
    )
  return <RedeemNftTile rewardTier={rewardTier} tokenId={tokenId} />
}

export function RedeemNftTiles({
  nftAccountBalance,
}: {
  nftAccountBalance: NfTsQuery | undefined
}) {
  return (
    <div className="flex space-x-2.5 overflow-x-scroll">
      {nftAccountBalance?.nfts.map((nft, i) => (
        <RedeemNftTileLoader nft={nft} key={`nft-tile${i}`} />
      ))}
    </div>
  )
}
