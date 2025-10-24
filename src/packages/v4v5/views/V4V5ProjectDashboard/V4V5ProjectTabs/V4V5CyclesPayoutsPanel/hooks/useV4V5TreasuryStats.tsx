import {
  JBChainId,
  useJBChainId,
  useJBContractContext,
  useJBRulesetMetadata,
  useSuckersNativeTokenBalance,
  useSuckersNativeTokenSurplus
} from 'juice-sdk-react'

import { BigNumber } from '@ethersproject/bignumber'
import { Tooltip } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { NETWORKS } from 'constants/networks'
import { useProjectQuery } from 'generated/v4v5/graphql'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useMemo } from 'react'
import { formatCurrencyAmount, getCurrencySymbol } from 'utils/format/formatCurrencyAmount'

export const useV4V5TreasuryStats = () => {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const { data: rulesetMetadata } = useJBRulesetMetadata()

  // Query project token and decimals
  const { data: project } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: version
    },
    skip: !chainId || !projectId,
  })

  const projectToken = project?.project?.token ?? undefined
  const projectDecimals = project?.project?.decimals ? Number(project.project.decimals) : 18
  const currencySymbol = getCurrencySymbol(projectToken)

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
    if (currencySymbol === 'ETH') {
      return <AmountInCurrency amount={BigNumber.from(totalBalance ?? 0n)} currency="ETH" />
    }
    // For USDC and other tokens, use formatted text
    return <span>{formatCurrencyAmount(totalBalance, projectDecimals, currencySymbol)}</span>
  }, [totalBalance, currencySymbol, projectDecimals])

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
                    {currencySymbol === 'ETH' ? (
                      <AmountInCurrency amount={BigNumber.from(surplus.surplus)} currency="ETH" />
                    ) : (
                      formatCurrencyAmount(surplus.surplus, projectDecimals, currencySymbol)
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <span>
          {currencySymbol === 'ETH' ? (
            <AmountInCurrency amount={BigNumber.from(totalEthSurplus)} currency="ETH" hideTooltip />
          ) : (
            formatCurrencyAmount(totalEthSurplus, projectDecimals, currencySymbol)
          )}
        </span>
      </Tooltip>
    )
  }, [totalEthSurplus, ethSurplusByChain, currencySymbol, projectDecimals])

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
                      {currencySymbol === 'ETH' ? (
                        <AmountInCurrency amount={BigNumber.from(distributableAmountObj.distributableAmount ?? 0n)} currency="ETH" />
                      ) : (
                        formatCurrencyAmount(distributableAmountObj.distributableAmount ?? 0n, projectDecimals, currencySymbol)
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : undefined
        }
      >
        <span>
          {currencySymbol === 'ETH' ? (
            <AmountInCurrency amount={BigNumber.from(totalDistributableAmount ?? 0n)} currency="ETH" hideTooltip />
          ) : (
            formatCurrencyAmount(totalDistributableAmount ?? 0n, projectDecimals, currencySymbol)
          )}
        </span>
      </Tooltip>
    )
  }, [totalDistributableAmount, distributableAmountByChain, currencySymbol, projectDecimals])

  return {
    totalTreasuryBalance: totalTreasuryBalance,
    suckersBalance: suckersBalance
      ? suckersBalance.toSorted((a, b) => Number(b.balance - a.balance))
      : [],
    availableToPayout,
    surplusElement,
    cashOutTaxRate: rulesetMetadata?.cashOutTaxRate,
    currencySymbol,
    projectDecimals,
  }
}
