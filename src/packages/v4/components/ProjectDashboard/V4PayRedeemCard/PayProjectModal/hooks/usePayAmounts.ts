import { V4_CURRENCY_ETH, V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { fromWad, parseWad } from 'utils/format/formatNumber'

import React from 'react'
import { formatCurrencyAmount } from 'packages/v4/utils/formatCurrencyAmount'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayProjectModal } from './usePayProjectModal/usePayProjectModal'
import { useProjectSelector } from '../../../redux/hooks'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'

export const usePayAmounts = () => {
  const converter = useCurrencyConverter()
  const { payAmount, chosenNftRewards, allNftRewards } = useProjectSelector(state => state.projectCart)
  const { primaryAmount, secondaryAmount } = usePayProjectModal()
  const { data: nftCreditsData } = useV4UserNftCredits()

  const payAmountRaw = React.useMemo(() => {
    if (!payAmount) return {
      eth: parseWad(0),
      usd: parseWad(0),
    }

    switch (payAmount.currency) {
      case V4_CURRENCY_ETH:
        return {
          eth: parseWad(payAmount.amount),
          usd: converter.weiToUsd(parseWad(payAmount.amount))!,
        }
      case V4_CURRENCY_USD:
        return {
          eth: converter.usdToWei(payAmount.amount),
          usd: parseWad(payAmount.amount),
        }
    }
  }, [converter, payAmount])

  const appliedNFTCreditsRaw = React.useMemo(() => {
    if (!nftCreditsData || !chosenNftRewards.length) return

    // Calculate total value of NFTs in cart
    const cartNftValue = chosenNftRewards.reduce((total, nft) => {
      // Find the NFT tier from allNftRewards to get its contribution floor
      const tier = allNftRewards.find(reward => reward.id === nft.id)
      const contributionFloor = tier?.contributionFloor ?? 0
      return total + (contributionFloor * nft.quantity)
    }, 0)

    const cartNftValueWei = parseWad(cartNftValue)

    // Only apply credits if there are NFTs in cart with sufficient value
    if (cartNftValueWei.eq(0)) return

    // Credits can only be applied up to the value of NFTs in cart
    const maxApplicableCredits = cartNftValueWei.lt(nftCreditsData) 
      ? cartNftValueWei 
      : nftCreditsData

    // And only up to the total pay amount
    const nftCreditsApplied = payAmountRaw.eth.lt(maxApplicableCredits)
      ? payAmountRaw.eth
      : maxApplicableCredits

    const eth = nftCreditsApplied
    const usd = parseWad(converter.weiToUsd(nftCreditsApplied))!

    return {
      eth,
      usd,
    }
  }, [converter, nftCreditsData, payAmountRaw, chosenNftRewards, allNftRewards])

  const formattedNftCredits = React.useMemo(() => {
    if (!appliedNFTCreditsRaw) return

    switch (payAmount?.currency) {
      case V4_CURRENCY_USD:
        return {
          primaryAmount: formatCurrencyAmount({
            amount: fromWad(appliedNFTCreditsRaw.usd),
            currency: V4_CURRENCY_USD,
          }),
          secondaryAmount: formatCurrencyAmount({
            amount: fromWad(appliedNFTCreditsRaw.eth),
            currency: V4_CURRENCY_ETH,
          }),
        }
      default:
        return {
          primaryAmount: formatCurrencyAmount({
            amount: fromWad(appliedNFTCreditsRaw.eth),
            currency: V4_CURRENCY_ETH,
          }),
          secondaryAmount: formatCurrencyAmount({
            amount: fromWad(appliedNFTCreditsRaw.usd),
            currency: V4_CURRENCY_USD,
          }),
        }
    }
  }, [appliedNFTCreditsRaw, payAmount])

  const formattedTotalAmount = React.useMemo(() => {
    if (!payAmountRaw || !payAmount) return

    if (!appliedNFTCreditsRaw) {
      return {
        primaryAmount: primaryAmount,
        secondaryAmount: secondaryAmount,
      }
    }

    const totalEth = payAmountRaw.eth.sub(appliedNFTCreditsRaw.eth)
    const totalUsd = converter.weiToUsd(parseWad(totalEth))

    const formattedEth = formatCurrencyAmount({
      amount: fromWad(totalEth),
      currency: V4_CURRENCY_ETH,
    })
    const formattedUsd = formatCurrencyAmount({
      amount: fromWad(totalUsd),
      currency: V4_CURRENCY_USD,
    })

    switch (payAmount?.currency) {
      case V4_CURRENCY_ETH:
        return {
          primaryAmount: formattedEth,
          secondaryAmount: formattedUsd,
        }
      case V4_CURRENCY_USD:
        return {
          primaryAmount: formattedUsd,
          secondaryAmount: formattedEth,
        }
    }
  }, [
    appliedNFTCreditsRaw,
    converter,
    payAmount,
    payAmountRaw,
    primaryAmount,
    secondaryAmount,
  ])

  return {
    formattedAmount: { primaryAmount, secondaryAmount },
    formattedNftCredits: {
      primaryAmount: formattedNftCredits?.primaryAmount,
      secondaryAmount: formattedNftCredits?.secondaryAmount,
    },
    formattedTotalAmount: {
      primaryAmount: formattedTotalAmount?.primaryAmount,
      secondaryAmount: formattedTotalAmount?.secondaryAmount,
    },
  }
}
