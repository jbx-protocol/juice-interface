import { Tooltip } from 'antd'
import { NETWORKS } from 'constants/networks'
import {
  JBChainId,
  NativeTokenValue,
  useJBRulesetMetadata,
  useSuckersNativeTokenBalance,
  useSuckersNativeTokenSurplus,
} from 'juice-sdk-react'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { useMemo } from 'react'
import { useV4DistributableAmount } from './useV4DistributableAmount'

export const useV4TreasuryStats = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { distributableAmount } = useV4DistributableAmount()

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

  const treasuryBalance = useMemo(() => {
    // NOTE: Don't think we need this since other chains payouts limits may be different?
    // if (payoutLimit && payoutLimit.amount === MAX_PAYOUT_LIMIT)
    //   return t`No surplus`
    return (
      <Tooltip
        title={
          suckersBalance?.length && suckersBalance.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suckersBalance?.map((balance, index) => (
                <div
                  className="flex items-center justify-between gap-4"
                  key={suckersBalance[index].chainId}
                >
                  <div
                    key={suckersBalance[index].chainId}
                    className="flex items-center gap-2"
                  >
                    <ChainLogo
                      chainId={suckersBalance[index].chainId as JBChainId}
                    />
                    <span>{NETWORKS[balance.chainId].label}</span>
                  </div>
                  {/* (NOTE: Following comment copied from Revnet: 
                  "TODO maybe show USD-converted value here instead?" */}
                  <span className="whitespace-nowrap font-medium">
                    <NativeTokenValue wei={balance.balance ?? 0n} />
                  </span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <span>
          <NativeTokenValue wei={totalBalance} />
        </span>
      </Tooltip>
    )
  }, [totalBalance, suckersBalance])

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
                    <NativeTokenValue wei={surplus.surplus ?? 0n} />
                  </span>
                </div>
              ))}
            </div>
          ) : undefined
        }
      >
        <span>
          <NativeTokenValue wei={totalEthSurplus} />
        </span>
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
