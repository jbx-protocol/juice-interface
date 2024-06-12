import Loading from 'components/Loading'
import { NfTsQuery } from 'generated/graphql'
import { useJB721DelegateTokenToNftReward } from '../hooks/useJB721DelegateTokenToNftReward'
import { RedeemNftTile } from './RedeemNftTile'

export function RedeemNftTiles({
  nftAccountBalance,
}: {
  nftAccountBalance: NfTsQuery | undefined
}) {
  return (
    <div className="flex space-x-2.5 overflow-x-scroll">
      {nftAccountBalance?.nfts.map((nft, i) => {
        const tokenId = nft.tokenId.toHexString()
        const _nft = {
          ...nft,
          tokenId,
        }
        const { data: rewardTier, isLoading } =
          useJB721DelegateTokenToNftReward(_nft)
        if (isLoading || !rewardTier)
          return (
            <div
              key={`loading-nft-${i}`}
              className="flex h-14 w-14 items-center justify-center rounded-lg bg-smoke-100"
            >
              <Loading size="small" />
            </div>
          )
        return (
          <RedeemNftTile key={i} rewardTier={rewardTier} tokenId={tokenId} />
        )
      })}
    </div>
  )
}
