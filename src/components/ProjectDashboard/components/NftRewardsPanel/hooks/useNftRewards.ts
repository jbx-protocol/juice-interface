import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useCallback, useContext, useReducer } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { sumTierFloors } from 'utils/nftRewards'
import { ACTIONS, nftPayMetadataReducer } from './nftPayMetadataReducer'

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

  const [state, dispatch] = useReducer(nftPayMetadataReducer, {
    tierIdsToMint: payMetadata?.tierIdsToMint ?? [],
  })

  const handleTierSelect = useCallback(
    (
      tierId: number | undefined,
      quantity: number, // quantity to select
    ) => {
      if (!tierId || !rewardTiers) return
      dispatch({ type: ACTIONS.SELECT_TIER, tierId, quantity })

      setPayMetadata?.({
        tierIdsToMint: state.tierIdsToMint,
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })

      setPayInCurrency?.(ETH)

      const sumSelectedTiers = sumTierFloors(rewardTiers, state.tierIdsToMint)
      if (sumSelectedTiers > parseFloat(payAmountETH ?? '0')) {
        const newPayAmount = sumSelectedTiers.toString()
        setPayAmount?.(newPayAmount)
        validatePayAmount?.(newPayAmount)
      }
    },
    [
      rewardTiers,
      state.tierIdsToMint,
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
      quantity: number, // quantity to select
    ) => {
      if (tierId === undefined || !rewardTiers || !payMetadata) return

      dispatch({ type: ACTIONS.DESELECT_TIER, tierId, quantity })

      setPayMetadata?.({
        tierIdsToMint: state.tierIdsToMint,
      })

      const newPayAmount = sumTierFloors(
        rewardTiers,
        state.tierIdsToMint,
      ).toString()
      setPayAmount?.(newPayAmount)
      validatePayAmount?.(newPayAmount)
    },
    [
      rewardTiers,
      state.tierIdsToMint,
      payMetadata,
      setPayAmount,
      setPayMetadata,
      validatePayAmount,
    ],
  )

  return {
    rewardTiers,
    loading,
    handleTierSelect,
    handleNftDeselect,
  }
}
