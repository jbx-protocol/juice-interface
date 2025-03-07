import { Trans, t } from "@lingui/macro";

import { NftRewardsContext } from "packages/v2v3/contexts/NftRewards/NftRewardsContext";
import { useContext } from "react";
import { useProjectSelector } from "../../redux/hooks";
import { PayRedeemCardNftReward } from "./PayRedeemCard";

// Pay cards that show when project has NFTs and preventOverspending flag is enabled
export function PreventOverspendingPayCard() {
  const {
      nftRewards: { rewardTiers: nfts },
    } = useContext(NftRewardsContext)

  const cartNfts = useProjectSelector(
    state => state.projectCart.chosenNftRewards,
  )

  const cartPayAmount = useProjectSelector(
      state => state.projectCart.payAmount?.amount,
    )

  return (
    <div
      className='flex flex-col overflow-hidden rounded-lg border border-grey-200 bg-grey-50 px-4 py-3 text-sm text-grey-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
    >
      <label className="mb-2 font-normal">{t`You receive`}</label>
      {nfts && nfts?.length > 0 && (
        <div className="mt-4 space-y-4">
          {nfts?.map((nft, i) => {
            const quantity = cartNfts?.find(cartNft => cartNft.id === nft.id)?.quantity ?? 0
            return <PayRedeemCardNftReward key={i} nft={nft} quantity={quantity} />
          })}
        </div>
      )}
      <span className="mt-4 mb-2 font-normal text-grey-500"><Trans>You pay Ξ{cartPayAmount ?? 0}</Trans></span>
    </div>
  )
}
