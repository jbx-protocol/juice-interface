import { useWallet } from 'hooks/Wallet'
import { useJBContractContext, useJBTokenContext, useReadJbTokensTotalBalanceOf } from 'juice-sdk-react'
import round from 'lodash/round'
import { useV4TotalTokenSupply } from 'packages/v4/hooks/useV4TotalTokenSupply'
import { useV4WalletHasPermission } from 'packages/v4/hooks/useV4WalletHasPermission'
import { V4OperatorPermission } from 'packages/v4/models/v4Permissions'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { formatAmount } from 'utils/format/formatAmount'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { zeroAddress } from 'viem'

export const useV4TokensPanel = () => {
  const { projectId } = useJBContractContext()
  const { userAddress } = useWallet()
  const { token } = useJBTokenContext()
  const tokenAddress = token?.data?.address
  
  const { data: totalTokenSupply } = useV4TotalTokenSupply()

  const projectToken = tokenSymbolText({
    tokenSymbol: token?.data?.symbol,
    capitalize: false,
    plural: true,
  })
  // const projectHasLegacyTokens = useProjectHasLegacyTokens()
  const hasDeployErc20Permission = useV4WalletHasPermission(
    V4OperatorPermission.DEPLOY_ERC20,
  )
  const projectHasErc20Token = Boolean(tokenAddress && !isZeroAddress(tokenAddress))

  const { data: userTokenBalance, isLoading: userTokenBalanceLoading } =
    useReadJbTokensTotalBalanceOf({
      args: [
        userAddress ?? zeroAddress,
        projectId
      ]
    })
  const userTokenBalanceFormatted = useMemo(() => {
    if (userTokenBalance === undefined) return
    return round(Number(userTokenBalance), 2)
  }, [userTokenBalance])

  // const { totalLegacyTokenBalance, v1ClaimedBalance } =
  //   useTotalLegacyTokenBalance({ projectId })

  const totalTokenSupplyFormatted = useMemo(() => {
    return formatAmount(Number(totalTokenSupply), { maximumFractionDigits: 2 })
  }, [totalTokenSupply])

  const canCreateErc20Token = useMemo(() => {
    return !projectHasErc20Token && hasDeployErc20Permission
  }, [hasDeployErc20Permission, projectHasErc20Token])

  return {
    userTokenBalance: userTokenBalanceFormatted,
    userTokenBalanceLoading,
    // userLegacyTokenBalance: totalLegacyTokenBalance,
    // projectHasLegacyTokens,
    // userV1ClaimedBalance: v1ClaimedBalance,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply: totalTokenSupplyFormatted,
    projectHasErc20Token,
    canCreateErc20Token,
  }
}
