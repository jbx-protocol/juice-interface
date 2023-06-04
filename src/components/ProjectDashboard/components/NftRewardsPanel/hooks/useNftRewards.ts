import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useCallback, useContext } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { sumTierFloors } from 'utils/nftRewards'

export const useNftRewards = () => {
  const {
    nftRewards: { rewardTiers },
    loading,
  } = useContext(NftRewardsContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const converter = useCurrencyConverter()

  const {
    payAmount,
    payMetadata,
    payInCurrency,
    setPayAmount,
    setPayInCurrency,
    setPayMetadata,
    validatePayAmount,
  } = payProjectForm ?? {}

  const payAmountETH =
    payInCurrency === ETH ? payAmount : fromWad(converter.usdToWei(payAmount))

  const handleTierSelect = useCallback(
    (
      tierId: number | undefined,
      quantity: number, // quantity to select
    ) => {
      if (!tierId || !rewardTiers) return

      const newSelectedTierIds = (payMetadata?.tierIdsToMint ?? []).concat(
        Array(quantity).fill(tierId),
      )

      setPayMetadata?.({
        tierIdsToMint: newSelectedTierIds,
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })

      setPayInCurrency?.(ETH)

      const sumSelectedTiers = sumTierFloors(rewardTiers, newSelectedTierIds)
      if (sumSelectedTiers > parseFloat(payAmountETH ?? '0')) {
        const newPayAmount = sumSelectedTiers.toString()
        setPayAmount?.(newPayAmount)
        validatePayAmount?.(newPayAmount)
      }
    },
    [
      rewardTiers,
      payMetadata,
      payAmountETH,
      ETH,
      setPayAmount,
      setPayInCurrency,
      setPayMetadata,
      validatePayAmount,
    ],
  )

  const handleNftDeselect = useCallback(
    (
      tierId: number | undefined,
      quantity: number, // quantity to deselect. Remove all instances of tierId if quantity=0
    ) => {
      if (tierId === undefined || !rewardTiers || !payMetadata) return

      let count = 0
      const newSelectedTierIds = (payMetadata?.tierIdsToMint ?? []).filter(
        id => {
          if (!quantity) {
            return id !== tierId
          }
          if (count < quantity && id === tierId) {
            count += 1
            return false
          }
          return true
        },
      )

      setPayMetadata?.({
        tierIdsToMint: newSelectedTierIds,
      })

      const newPayAmount = sumTierFloors(
        rewardTiers,
        newSelectedTierIds,
      ).toString()

      setPayAmount?.(newPayAmount)
      validatePayAmount?.(newPayAmount)
    },
    [rewardTiers, payMetadata, setPayAmount, setPayMetadata, validatePayAmount],
  )

  return {
    rewardTiers,
    loading,
    handleTierSelect,
    handleNftDeselect,
  }
}
