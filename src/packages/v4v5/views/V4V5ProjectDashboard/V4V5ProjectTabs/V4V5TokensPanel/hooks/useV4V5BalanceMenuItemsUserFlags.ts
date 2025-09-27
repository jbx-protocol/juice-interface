import { useWallet } from 'hooks/Wallet'
import { useJBContractContext, useJBRulesetMetadata, useNativeTokenSurplus } from 'juice-sdk-react'
import { jbTokensAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract, useChainId } from 'wagmi'
import { useV4WalletHasPermission } from 'packages/v4v5/hooks/useV4V5WalletHasPermission'
import { V4V5OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { zeroAddress } from 'viem'

export const useV4BalanceMenuItemsUserFlags = () => {
  const { data: rulesetMetadata } = useJBRulesetMetadata()
  const chainId = useChainId()
  const tokensAddress = jbContractAddress['4'][JBCoreContracts.JBTokens][chainId as unknown as keyof typeof jbContractAddress['4'][JBCoreContracts.JBTokens]]

  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadContract({
    abi: jbTokensAbi,
    address: tokensAddress,
    functionName: 'tokenOf',
    args: [projectId],
    chainId,
  })

  const { data: surplusInNativeToken } = useNativeTokenSurplus()
  const { userAddress } = useWallet()
  const isDev = useMemo(() => process.env.NODE_ENV === 'development', [])

  const userHasMintPermission = useV4WalletHasPermission(
    V4V5OperatorPermission.MINT_TOKENS,
  )
  const hasOverflow = useMemo(
    () => !!(surplusInNativeToken && surplusInNativeToken > 0n),
    [surplusInNativeToken],
  )
  const cashOutTaxRateIsZero = !!(rulesetMetadata && rulesetMetadata.cashOutTaxRate.value === 0n)
  const redeemDisabled = useMemo(
    () => !hasOverflow || cashOutTaxRateIsZero,
    [hasOverflow, cashOutTaxRateIsZero],
  )
  const projectHasIssuedTokens = useMemo(
    () => !!tokenAddress && !isZeroAddress(tokenAddress),
    [tokenAddress],
  )
  const projectAllowsMint = useMemo(
    () => !!rulesetMetadata?.allowOwnerMinting,
    [rulesetMetadata],
  )
  const { data: creditBalance } = useReadContract({ // previously `unclaimedTokenBalance`
    abi: jbTokensAbi,
    address: tokensAddress,
    functionName: 'creditBalanceOf',
    args: [
      userAddress ?? zeroAddress,
      projectId
    ],
    chainId,
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
