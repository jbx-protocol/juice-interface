import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCallback, useContext, useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

export const useCartSummary = () => {
  const cart = useProjectCart()
  const nftRewardsCtx = useContext(NftRewardsContext).nftRewards
  const tiers = useMemo(
    () => nftRewardsCtx.rewardTiers ?? [],
    [nftRewardsCtx.rewardTiers],
  )
  const nftRewards = useMemo(() => {
    return cart.nftRewards
      .map(nft => ({ ...tiers.find(tier => tier.id === nft.id), ...nft }))
      .filter(nft => nft !== undefined)
      .map(nft => ({
        fileUrl: nft.fileUrl,
        name: nft.name,
        quantity: nft.quantity,
        id: nft.id,
      }))
  }, [cart.nftRewards, tiers])

  const amountText = cart.totalAmount
    ? formatCurrencyAmount(cart.totalAmount)
    : undefined

  const removePay = useCallback(() => {
    cart.dispatch({ type: 'removePayment' })
  }, [cart])

  const payProject = useCallback(() => {
    cart.dispatch({ type: 'openPayModal' })
  }, [cart])

  return {
    amountText,
    currency: cart.totalAmount?.currency,
    nftRewards,
    removePay,
    payProject,
  }
}
