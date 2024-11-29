import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { V4_CURRENCY_ETH, V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { formatCurrencyAmount } from 'packages/v4/utils/formatCurrencyAmount'
import React from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { useProjectSelector } from '../../../redux/hooks'
import { usePayProjectModal } from './usePayProjectModal/usePayProjectModal'

export const usePayAmounts = () => {
  const converter = useCurrencyConverter()
  const { payAmount } = useProjectSelector(state => state.projectCart)
  const { primaryAmount, secondaryAmount } = usePayProjectModal()
  const { data: nftCreditsData } = useV4UserNftCredits()

  const payAmountRaw = React.useMemo(() => {
    if (!payAmount) return

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
    if (!payAmountRaw || !nftCreditsData) return

    const nftCreditsApplied = payAmountRaw.eth.lt(nftCreditsData)
      ? payAmountRaw.eth
      : nftCreditsData

    const eth = nftCreditsApplied
    const usd = parseWad(converter.weiToUsd(nftCreditsApplied))!

    return {
      eth,
      usd,
    }
  }, [converter, nftCreditsData, payAmountRaw])

  const formattedNftCredits = React.useMemo(() => {
    if (!appliedNFTCreditsRaw || !payAmount) return

    switch (payAmount.currency) {
      case V4_CURRENCY_ETH:
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
