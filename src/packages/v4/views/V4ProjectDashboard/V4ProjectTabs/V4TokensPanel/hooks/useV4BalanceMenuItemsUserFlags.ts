import { useWallet } from 'hooks/Wallet'
import { useJBContractContext, useJBRulesetMetadata, useNativeTokenSurplus, useReadJbTokensCreditBalanceOf, useReadJbTokensTokenOf } from 'juice-sdk-react'
import { useV4WalletHasPermission } from 'packages/v4/hooks/useV4WalletHasPermission'
import { V4OperatorPermission } from 'packages/v4/models/v4Permissions'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { zeroAddress } from 'viem'

export const useV4BalanceMenuItemsUserFlags = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: surplusInNativeToken } = useNativeTokenSurplus()
  const { userAddress } = useWallet()
  
  const { projectId } = useJBContractContext()
  const isDev = useMemo(() => process.env.NODE_ENV === 'development', [])

  const userHasMintPermission = useV4WalletHasPermission(
    V4OperatorPermission.MINT_TOKENS,
  )
  const hasOverflow = useMemo(
    () => !!(surplusInNativeToken && surplusInNativeToken > 0n),
    [surplusInNativeToken],
  )
  const redemptionRateIsZero = !!(rulesetMetadata && rulesetMetadata.redemptionRate.value === 0n)
  const redeemDisabled = useMemo(
    () => !hasOverflow || redemptionRateIsZero,
    [hasOverflow, redemptionRateIsZero],
  )
  const projectHasIssuedTokens = useMemo(
    () => !!tokenAddress && !isZeroAddress(tokenAddress),
    [tokenAddress],
  )
  const projectAllowsMint = useMemo(
    () => !!rulesetMetadata?.allowOwnerMinting,
    [rulesetMetadata],
  )
  const { data: creditBalance } = useReadJbTokensCreditBalanceOf({ // previously `unclaimedTokenBalance`
    args: [
      userAddress ?? zeroAddress,
      projectId
    ]
  })

  const canBurnTokens = useMemo(
    () => redeemDisabled || isDev,
    [isDev, redeemDisabled],
  )

  const canClaimErcTokens = useMemo(
    () => projectHasIssuedTokens || isDev,
    [isDev, projectHasIssuedTokens],
  )

  const canMintTokens = useMemo(
    () => (projectAllowsMint && userHasMintPermission) || isDev,
    [isDev, projectAllowsMint, userHasMintPermission],
  )
  const creditBalanceZero = !!(creditBalance && creditBalance > 0n)
  const canTransferTokens = useMemo(
    () => creditBalanceZero || isDev,
    [creditBalanceZero, isDev],
  )

  return {
    canBurnTokens,
    canClaimErcTokens,
    canMintTokens,
    canTransferTokens,
  }
}
