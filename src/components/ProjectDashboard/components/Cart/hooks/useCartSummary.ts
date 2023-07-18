import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useJBWallet } from 'hooks/Wallet/useJBWallet'
import { useCallback, useContext, useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

export const useCartSummary = () => {
  const { isConnected, connect } = useJBWallet()
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

  const resetCart = useCallback(() => {
    cart.dispatch({ type: 'reset' })
  }, [cart])

  const payProject = useCallback(() => {
    if (!isConnected) {
      connect?.()
      return
    }
    cart.dispatch({ type: 'openPayModal' })
  }, [cart, connect, isConnected])

  const showCurrencyOnCollapse = useMemo(() => {
    return cart.payAmount?.amount ? cart.payAmount.amount > 0 : false
  }, [cart.payAmount])

  return {
    amountText,
    currency: cart.totalAmount?.currency,
    nftRewards,
    walletConnected: isConnected,
    showCurrencyOnCollapse,
    resetCart,
    payProject,
  }
}
