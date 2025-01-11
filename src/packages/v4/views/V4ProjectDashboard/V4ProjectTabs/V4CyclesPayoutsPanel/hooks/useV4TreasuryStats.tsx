import {
  JBChainId,
  NativeTokenValue,
  useJBRulesetMetadata,
  useSuckersNativeTokenSurplus
} from 'juice-sdk-react'

import { Tooltip } from 'antd'
import { NETWORKS } from 'constants/networks'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { useV4BalanceOfNativeTerminal } from 'packages/v4/hooks/useV4BalanceOfNativeTerminal'
import { useMemo } from 'react'
import { useV4DistributableAmount } from './useV4DistributableAmount'

export const useV4TreasuryStats = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { distributableAmount } = useV4DistributableAmount()

  const { data: _treasuryBalance } = useV4BalanceOfNativeTerminal()

  const surplusQuery = useSuckersNativeTokenSurplus();

  // NOTE: if loading state or conversion to USD necessary
  // const { data: ethPrice, isLoading: isEthLoading } = useEtherPrice();
  // const loading = isEthLoading || surplusQuery.isLoading;

  const ethSurplusByChain = surplusQuery?.data 
  const totalEthSurplus =
    ethSurplusByChain?.reduce((acc, curr) => {
      return acc + curr.surplus;
    }, 0n) ?? 0n;

  const treasuryBalance = <NativeTokenValue wei={_treasuryBalance ?? 0n} />

  const surplusElement = useMemo(() => {
    // NOTE: Don't think we need this since other chains payouts limits may be different?
    // if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT)
    //   return t`No surplus`
    return (
      <Tooltip
        title={ethSurplusByChain?.length && ethSurplusByChain.length > 0 ?
          <div className="flex flex-col gap-2">
            {ethSurplusByChain?.map((surplus, index) => (
              <div className="flex justify-between gap-4 items-center" key={ethSurplusByChain[index].chainId}>
                <div key={ethSurplusByChain[index].chainId} className="flex items-center gap-2">
                  <ChainLogo chainId={ethSurplusByChain[index].chainId as JBChainId} />
                  <span>{NETWORKS[surplus.chainId].label}</span>
                </div>
                {/* (NOTE: Following comment copied from Revnet: 
                  "TODO maybe show USD-converted value here instead?" */}
                <span className="font-medium whitespace-nowrap">
                  <NativeTokenValue wei={surplus.surplus ?? 0n} />
                </span>
              </div>
            ))}
            
          </div>
        : undefined}
      >
        <span><NativeTokenValue wei={totalEthSurplus ?? 0n} /></span>
      </Tooltip>
    )
  }, [totalEthSurplus, ethSurplusByChain])

  const availableToPayout = <NativeTokenValue wei={distributableAmount.value} />
  return {
    treasuryBalance,
    availableToPayout,
    surplusElement,
    cashOutTaxRate: rulesetMetadata?.cashOutTaxRate,
  }
}
