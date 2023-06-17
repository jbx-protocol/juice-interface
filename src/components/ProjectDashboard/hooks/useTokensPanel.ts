import { constants } from 'ethers'
import { useMemo } from 'react'
import { formatAmountWithScale } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useProjectContext } from './useProjectContext'
import { useUserTokenBalance } from './useUserTokenBalance'

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
  const { data: userTokenBalance, loading: userTokenBalanceLoading } =
    useUserTokenBalance()

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
