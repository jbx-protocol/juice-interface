import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useMemo } from 'react'
import { isZeroAddress } from 'utils/address'
import { useProjectContext } from '../useProjectContext'
import { useUnclaimedTokenBalance } from '../useUnclaimedTokenBalance'

export const useBalanceMenuItemsUserFlags = () => {
  const { primaryTerminalCurrentOverflow, fundingCycleMetadata, tokenAddress } =
    useProjectContext()
  const userHasMintPermission = useV2V3WalletHasPermission(
    V2V3OperatorPermission.MINT,
  )
  const hasOverflow = useMemo(
    () => !!primaryTerminalCurrentOverflow?.gt(0),
    [primaryTerminalCurrentOverflow],
  )
  const redeemDisabled = useMemo(
    () => !hasOverflow || fundingCycleMetadata?.redemptionRate.eq(0),
    [hasOverflow, fundingCycleMetadata],
  )
  const projectHasIssuedTokens = useMemo(
    () => !!tokenAddress && !isZeroAddress(tokenAddress),
    [tokenAddress],
  )
  const projectAllowsMint = useMemo(
    () => !!fundingCycleMetadata?.allowMinting,
    [fundingCycleMetadata],
  )
  const unclaimedTokenBalance = useUnclaimedTokenBalance()

  const canBurnTokens = useMemo(() => redeemDisabled, [redeemDisabled])

  const canClaimErcTokens = useMemo(
    () => projectHasIssuedTokens,
    [projectHasIssuedTokens],
  )

  const canMintTokens = useMemo(
    () => projectAllowsMint && userHasMintPermission,
    [projectAllowsMint, userHasMintPermission],
  )

  const canTransferTokens = useMemo(
    () => !!unclaimedTokenBalance?.gt(0),
    [unclaimedTokenBalance],
  )

  return {
    canBurnTokens,
    canClaimErcTokens,
    canMintTokens,
    canTransferTokens,
  }
}
