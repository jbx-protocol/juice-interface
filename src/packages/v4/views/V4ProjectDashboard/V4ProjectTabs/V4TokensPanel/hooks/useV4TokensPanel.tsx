import { JBChainId, JBProjectToken } from 'juice-sdk-core'

import { Tooltip } from 'antd'
import { NETWORKS } from 'constants/networks'
import { useJBTokenContext } from 'juice-sdk-react'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { useV4UserTotalTokensBalance } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { useSuckersTotalSupply } from 'packages/v4/hooks/useSuckersTotalSupply'
import { useV4TotalTokenSupply } from 'packages/v4/hooks/useV4TotalTokenSupply'
import { useV4WalletHasPermission } from 'packages/v4/hooks/useV4WalletHasPermission'
import { V4OperatorPermission } from 'packages/v4/models/v4Permissions'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const useV4TokensPanel = () => {
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
    useV4UserTotalTokensBalance()

  const userTokenBalance =
    _userTokenBalance !== undefined
      ? new JBProjectToken(_userTokenBalance ?? 0n)
      : undefined

  // const { totalLegacyTokenBalance, v1ClaimedBalance } =
  //   useTotalLegacyTokenBalance({ projectId })

  const { data: suckersTotalSupply } = useSuckersTotalSupply()
  const aggregatedTotalSupply = 
      suckersTotalSupply?.reduce(
        (acc, curr) => acc + curr.totalSupply,
        0n,
      ) ?? 0n

  const _aggregatedTotalSupply = new JBProjectToken(aggregatedTotalSupply)

  const totalTokenSupplyElement = (
    <Tooltip
        title={
          suckersTotalSupply?.length &&
          suckersTotalSupply.length > 0 ? (
            <div className="flex flex-col gap-2">
              {suckersTotalSupply.map(({ chainId, totalSupply }) => {
                const _totalSupply = new JBProjectToken(totalSupply)
                return (
                  <div
                    className="flex items-center justify-between gap-4"
                    key={chainId}
                  >
                    <div className="flex items-center gap-2">
                      <ChainLogo chainId={chainId as JBChainId} />
                      <span>{NETWORKS[chainId].label}</span>
                    </div>
                    <span className="whitespace-nowrap font-medium">
                      {_totalSupply.format(8)}{' '}
                      {projectToken}
                    </span>
                  </div>
                )
            })}
            </div>
          ) : undefined
        }
      >
        <span>
          {_aggregatedTotalSupply.format(8)}
        </span>
      </Tooltip>
  )

  const totalTokenSupply = new JBProjectToken(_totalTokenSupply ?? 0n)

  const canCreateErc20Token = !projectHasErc20Token && hasDeployErc20Permission

  return {
    userTokenBalance,
    userTokenBalanceLoading,
    // userLegacyTokenBalance: totalLegacyTokenBalance,
    // projectHasLegacyTokens,
    // userV1ClaimedBalance: v1ClaimedBalance,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply: totalTokenSupply,
    totalTokenSupplyElement,
    projectHasErc20Token,
    canCreateErc20Token,
  }
}
