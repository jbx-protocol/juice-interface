import {
  JBChainId,
  useJBRulesetMetadata,
  useSuckersNativeTokenBalance,
  useSuckersNativeTokenSurplus
} from 'juice-sdk-react'

import { BigNumber } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { NETWORKS } from 'constants/networks'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { useMemo } from 'react'

export const useV4TreasuryStats = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()

  const { data: suckersBalance } = useSuckersNativeTokenBalance()
  const totalBalance =
    suckersBalance?.reduce((acc, curr) => {
      return acc + curr.balance
    }, 0n) ?? 0n

  const surplusQuery = useSuckersNativeTokenSurplus()

  // NOTE: if loading state or conversion to USD necessary
  // const { data: ethPrice, isLoading: isEthLoading } = useEtherPrice();
  // const loading = isEthLoading || surplusQuery.isLoading;

  const ethSurplusByChain = surplusQuery?.data
  const totalEthSurplus =
    ethSurplusByChain?.reduce((acc, curr) => {
      return acc + curr.surplus
    }, 0n) ?? 0n

  const distributableAmountByChain = suckersBalance?.map(chainBalanceObj => {
    const chainSurplus =
      ethSurplusByChain?.find(
        chainSurplus => chainSurplus.chainId === chainBalanceObj.chainId,
      )?.surplus ?? 0n
    return {
      chainId: chainBalanceObj.chainId,
      projectId: chainBalanceObj.projectId,
      distributableAmount: chainBalanceObj.balance - chainSurplus,
    }
  })

  const totalDistributableAmount =
    distributableAmountByChain?.reduce(
      (acc, curr) => acc + curr.distributableAmount,
      0n,
    ) ?? 0n

  const totalTreasuryBalance = useMemo(() => {
    return <AmountInCurrency amount={BigNumber.from(totalBalance ?? 0n)} currency="ETH" />
  }, [totalBalance])

  const surplusElement = useMemo(() => {
    // NOTE: Don't think we need this since other chains payouts limits may be different?
    // if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT)
    //   return t`No surplus`
    return (
      <Tooltip
        title={
          ethSurplusByChain?.length && ethSurplusByChain.length > 0 ? (
            <div className="flex flex-col gap-2">
              {ethSurplusByChain?.map((surplus, index) => (
                <div
                  className="flex items-center justify-between gap-4"
                  key={ethSurplusByChain[index].chainId}
                >
                  <div
                    key={ethSurplusByChain[index].chainId}
                    className="flex items-center gap-2"
                  >
                    <ChainLogo
                      chainId={ethSurplusByChain[index].chainId as JBChainId}
                    />
                    <span>{NETWORKS[surplus.chainId].label}</span>
                  </div>
                  {/* (NOTE: Following comment copied from Revnet: 
                  "TODO maybe show USD-converted value here instead?" */}
                  <span className="whitespace-nowrap font-medium">
                    <AmountInCurrency amount={BigNumber.from(surplus.surplus)} currency="ETH" />
                  </span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <span>
          <AmountInCurrency amount={BigNumber.from(totalEthSurplus)} currency="ETH" hideTooltip />
        </span>
      </Tooltip>
    )
  }, [totalEthSurplus, ethSurplusByChain])

  const availableToPayout = useMemo(() => {
    return (
      <Tooltip
        title={
          distributableAmountByChain?.length &&
          distributableAmountByChain.length > 0 ? (
            <div className="flex flex-col gap-2">
              {distributableAmountByChain?.map(
                (distributableAmountObj, index) => (
                  <div
                    className="flex items-center justify-between gap-4"
                    key={distributableAmountByChain[index].chainId}
                  >
                    <div
                      key={distributableAmountByChain[index].chainId}
                      className="flex items-center gap-2"
                    >
                      <ChainLogo
                        chainId={
                          distributableAmountByChain[index].chainId as JBChainId
                        }
                      />
                      <span>
                        {NETWORKS[distributableAmountObj.chainId].label}
                      </span>
                    </div>
                    <span className="whitespace-nowrap font-medium">
                      <AmountInCurrency amount={BigNumber.from(distributableAmountObj.distributableAmount ?? 0n)} currency="ETH" />
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : undefined
        }
      >
        <span>
          <AmountInCurrency amount={BigNumber.from(totalDistributableAmount ?? 0n)} currency="ETH" hideTooltip />
        </span>
      </Tooltip>
    )
  }, [totalDistributableAmount, distributableAmountByChain])

  return {
    totalTreasuryBalance: totalTreasuryBalance,
    suckersBalance: suckersBalance
      ? suckersBalance.toSorted((a, b) => Number(b.balance - a.balance))
      : [],
    availableToPayout,
    surplusElement,
    cashOutTaxRate: rulesetMetadata?.cashOutTaxRate,
  }
}
