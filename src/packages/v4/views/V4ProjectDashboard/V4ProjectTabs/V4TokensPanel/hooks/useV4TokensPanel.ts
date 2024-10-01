import { useWallet } from 'hooks/Wallet'
import { JBProjectToken } from 'juice-sdk-core'
import { useJBContractContext, useJBTokenContext, useReadJbTokensTotalBalanceOf } from 'juice-sdk-react'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { useV4TotalTokenSupply } from 'packages/v4/hooks/useV4TotalTokenSupply'
import { useV4WalletHasPermission } from 'packages/v4/hooks/useV4WalletHasPermission'
import { V4OperatorPermission } from 'packages/v4/models/v4Permissions'
import { useMemo } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { zeroAddress } from 'viem'

export const useV4TokensPanel = () => {
  const { projectId } = useJBContractContext()
  const { userAddress } = useWallet()
  const { token } = useJBTokenContext()
  const tokenAddress = token?.data?.address
  
  const { data: _totalTokenSupply } = useV4TotalTokenSupply()

  const projectToken = tokenSymbolText({
    tokenSymbol: token?.data?.symbol,
    capitalize: false,
    plural: true,
  })
  // const projectHasLegacyTokens = useProjectHasLegacyTokens()
  const hasDeployErc20Permission = useV4WalletHasPermission(
    V4OperatorPermission.DEPLOY_ERC20,
  )
  const projectHasErc20Token = useProjectHasErc20Token()

  const { data: _userTokenBalance, isLoading: userTokenBalanceLoading } =
    useReadJbTokensTotalBalanceOf({
      args: [
        userAddress ?? zeroAddress,
        projectId
      ]
    })
  const userTokenBalance = useMemo(() => {
    if (_userTokenBalance === undefined) return
    return new JBProjectToken(_userTokenBalance ?? 0n)
  }, [_userTokenBalance])

  // const { totalLegacyTokenBalance, v1ClaimedBalance } =
  //   useTotalLegacyTokenBalance({ projectId })

  const totalTokenSupply = useMemo(() => {
    return new JBProjectToken(_totalTokenSupply ?? 0n)
  }, [_totalTokenSupply])

  const canCreateErc20Token = useMemo(() => {
    return !projectHasErc20Token && hasDeployErc20Permission
  }, [hasDeployErc20Permission, projectHasErc20Token])

  return {
    userTokenBalance,
    userTokenBalanceLoading,
    // userLegacyTokenBalance: totalLegacyTokenBalance,
    // projectHasLegacyTokens,
    // userV1ClaimedBalance: v1ClaimedBalance,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply: totalTokenSupply,
    projectHasErc20Token,
    canCreateErc20Token,
  }
}
