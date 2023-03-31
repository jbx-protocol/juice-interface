import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ManageTokensModal from 'components/ManageTokensModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useERC20BalanceOf from 'hooks/ERC20/ERC20BalanceOf'
import { useWallet } from 'hooks/Wallet'
import { useIsOwnerConnected } from 'hooks/v2v3/IsOwnerConnected'
import { useProjectHasErc20 } from 'hooks/v2v3/ProjectHasErc20'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/TransferUnclaimedTokensTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import {
  formatPercent,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3BurnOrRedeemModal } from './V2V3BurnOrRedeemModal'
import { V2V3ClaimTokensModal } from './V2V3ClaimTokensModal'
import { V2V3MintModal } from './V2V3MintModal'

export function AccountBalanceDescription() {
  const {
    tokenAddress,
    tokenSymbol,
    totalTokenSupply,
    fundingCycleMetadata,
    primaryTerminalCurrentOverflow,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)

  const { userAddress } = useWallet()
  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const unclaimedBalance = totalBalance?.sub(claimedBalance ?? 0)
  const userHasMintPermission = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.MINT,
  )
  const ownerIsConnected = useIsOwnerConnected()
  const hasIssuedERC20 = useProjectHasErc20()

  const claimedBalanceFormatted = formatWad(claimedBalance ?? 0, {
    precision: 4,
  })
  const unclaimedBalanceFormatted = formatWad(unclaimedBalance ?? 0, {
    precision: 4,
  })

  const totalTokenSupplyDiscrete = parseInt(fromWad(totalTokenSupply))
  const totalBalanceWithLock = parseInt(fromWad(totalBalance))
  // %age of tokens the user owns.
  const userOwnershipPercentage =
    formatPercent(
      parseWad(totalBalanceWithLock),
      parseWad(totalTokenSupplyDiscrete),
    ) || '0'

  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))
  const redeemDisabled = Boolean(
    !hasOverflow || fundingCycleMetadata?.redemptionRate.eq(0),
  )

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const projectAllowsMint = Boolean(fundingCycleMetadata?.allowMinting)
  const showManageTokensButton = Boolean(
    totalBalance?.gt(0) || (projectAllowsMint && ownerIsConnected),
  )

  return (
    <>
      <div>
        {hasIssuedERC20 && (
          <div>
            {claimedBalanceFormatted} {tokenText}
          </div>
        )}
        <div>
          {hasIssuedERC20 ? (
            <Trans>
              {unclaimedBalanceFormatted} {tokenText} claimable
            </Trans>
          ) : (
            <>
              {unclaimedBalanceFormatted} {tokenText}
            </>
          )}
        </div>
        <div className="cursor-default text-xs text-grey-400 dark:text-slate-200">
          <Trans>{userOwnershipPercentage}% of total supply</Trans>
        </div>
      </div>

      {showManageTokensButton ? (
        <Button size="small" onClick={() => setManageTokensModalVisible(true)}>
          <Trans>Manage {tokenText}</Trans>
        </Button>
      ) : null}

      <ManageTokensModal
        open={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        projectAllowsMint={projectAllowsMint}
        userHasMintPermission={userHasMintPermission}
        hasOverflow={hasOverflow}
        redeemDisabled={redeemDisabled}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        tokenUnclaimedBalance={unclaimedBalance}
        transferUnclaimedTokensTx={useTransferUnclaimedTokensTx}
        RedeemModal={V2V3BurnOrRedeemModal}
        ClaimTokensModal={V2V3ClaimTokensModal}
        MintModal={V2V3MintModal}
      />
    </>
  )
}
