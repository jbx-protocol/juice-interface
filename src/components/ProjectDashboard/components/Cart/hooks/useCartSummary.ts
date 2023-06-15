import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useWallet } from 'hooks/Wallet'
import { useCallback, useContext, useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

export const useCartSummary = () => {
  const { isConnected, connect } = useWallet()
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
    if (!isConnected) {
      connect()
      return
    }
    cart.dispatch({ type: 'openPayModal' })
  }, [cart, connect, isConnected])

  return {
    amountText,
    currency: cart.totalAmount?.currency,
    nftRewards,
    walletConnected: isConnected,
    removePay,
    payProject,
  }
}
