import { constants } from 'ethers'
import { useMemo } from 'react'
import { formatAmount, formatAmountWithScale } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useProjectContext } from './useProjectContext'
import { useUserTokenBalanceWad } from './useUserTokenBalanceWad'

export const useTokensPanel = () => {
  const {
    tokenSymbol: tokenSymbolRaw,
    totalTokenSupply,
    tokenAddress,
  } = useProjectContext()
  const projectToken = tokenSymbolText({
    tokenSymbol: tokenSymbolRaw,
    capitalize: false,
    plural: true,
  })
  const { data: userTokenBalanceWad, loading: userTokenBalanceLoading } =
    useUserTokenBalanceWad()

  const userTokenBalance = useMemo(() => {
    if (!userTokenBalanceWad) return undefined
    return formatAmount(fromWad(userTokenBalanceWad))
  }, [userTokenBalanceWad])

  const totalSupply = useMemo(() => {
    return formatAmountWithScale(fromWad(totalTokenSupply))
  }, [totalTokenSupply])

  const projectHasErc20Token = useMemo(
    () => tokenAddress !== undefined && tokenAddress !== constants.AddressZero,
    [tokenAddress],
  )

  return {
    userTokenBalance,
    userTokenBalanceLoading,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply,
    projectHasErc20Token,
  }
}
