import assert from 'assert'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import useWeiConverter from 'hooks/useWeiConverter'
import { useCallback, useContext, useMemo } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { roundIfCloseToNextInteger } from 'utils/math'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'

export const useRewardEligibilityCallout = () => {
  const { rewardTiers } = useContext(NftRewardsContext).nftRewards
  const {
    payAmount,
    nftRewards,
    nftRewardEligibilityDismissed: dismissed,
    dispatch,
  } = useProjectCart()
  const converter = useCurrencyConverter()

  const weiPayAmount = useWeiConverter({
    currency: payAmount?.currency,
    amount: payAmount?.amount.toString(),
  })

  const eligibleRewards = useMemo(() => {
    if (!rewardTiers || !payAmount || weiPayAmount.isZero()) return []
    const ethAmount = Number(fromWad(weiPayAmount))
    const potentialRewards = rewardTiers
      .filter(tier => tier.contributionFloor <= ethAmount)
      .filter(tier => !nftRewards.find(nft => nft.id === tier.id))
      .sort((a, b) => b.contributionFloor - a.contributionFloor)

    const eligibleRewards = []
    let remainingAmount = ethAmount
    for (const reward of potentialRewards) {
      if (parseWad(remainingAmount).gte(parseWad(reward.contributionFloor))) {
        eligibleRewards.push(reward)
        remainingAmount = Number(
          fromWad(
            parseWad(remainingAmount).sub(parseWad(reward.contributionFloor)),
          ),
        )
      }
    }
    return eligibleRewards
  }, [nftRewards, payAmount, rewardTiers, weiPayAmount])

  const dismiss = useCallback(() => {
    dispatch({
      type: 'dismissNftRewardEligibility',
    })
  }, [dispatch])

  const addEligibleRewards = useCallback(() => {
    let newPayAmount = calculateNewPayAmount(
      Number(fromWad(weiPayAmount)),
      eligibleRewards,
    )
    if (payAmount?.currency !== V2V3_CURRENCY_ETH) {
      newPayAmount = converter.weiToUsd(parseWad(newPayAmount))!.toNumber()
    }
    assert(
      newPayAmount >= 0,
      `newPayAmount (${newPayAmount}) should be greater than 0`,
    )
    eligibleRewards.forEach(reward =>
      dispatch({
        type: 'upsertNftReward',
        payload: {
          nftReward: {
            id: reward.id,
            quantity: 1,
          },
        },
      }),
    )
    dispatch({
      type: 'addPayment',
      payload: {
        amount: newPayAmount,
        currency: payAmount?.currency ?? V2V3_CURRENCY_ETH,
      },
    })
  }, [converter, dispatch, eligibleRewards, payAmount?.currency, weiPayAmount])

  return {
    eligibleRewards,
    addEligibleRewards,
    dismissed,
    dismiss,
  }
}

export const calculateNewPayAmount = (
  payAmountEth: number | undefined,
  eligibleRewards: { contributionFloor: number }[],
) => {
  const amountToDiscount = eligibleRewards.reduce(
    (acc, reward) => acc + reward.contributionFloor,
    0,
  )
  const newPayAmount = payAmountEth
    ? Number(fromWad(parseWad(payAmountEth).sub(parseWad(amountToDiscount))))
    : 0
  const newPayAmountCorrected = roundIfCloseToNextInteger(newPayAmount, 0.00001)
  return newPayAmountCorrected
}
