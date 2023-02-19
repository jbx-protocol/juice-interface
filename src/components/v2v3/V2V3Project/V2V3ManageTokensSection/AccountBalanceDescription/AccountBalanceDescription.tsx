import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import RichButton from 'components/buttons/RichButton'
import ManageTokensModal from 'components/ManageTokensModal'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import useERC20BalanceOf from 'hooks/ERC20/ERC20BalanceOf'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import useUserUnclaimedTokenBalance from 'hooks/v2v3/contractReader/UserUnclaimedTokenBalance'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useIsOwnerConnected } from 'hooks/v2v3/IsOwnerConnected'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/TransferUnclaimedTokensTx'
import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import {
  formatPercent,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/format/formatNumber'
import { veNftPagePath } from 'utils/routes'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2V3BurnOrRedeemModal } from './V2V3BurnOrRedeemModal'
import { V2V3ClaimTokensModal } from './V2V3ClaimTokensModal'
import { V2V3MintModal } from './V2V3MintModal'

export function AccountBalanceDescription() {
  const { contractAddress: veNftAddress } = useContext(VeNftContext)
  const {
    tokenAddress,
    tokenSymbol,
    handle,
    totalTokenSupply,
    fundingCycleMetadata,
    primaryTerminalCurrentOverflow,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>(false)

  const { userAddress } = useWallet()
  const { totalLocked } = useVeNftSummaryStats()
  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const userHasMintPermission = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.MINT,
  )
  const ownerIsConnected = useIsOwnerConnected()

  const claimedBalanceFormatted = formatWad(claimedBalance ?? 0, {
    precision: 0,
  })
  const unclaimedBalanceFormatted = formatWad(unclaimedBalance ?? 0, {
    precision: 0,
  })

  const totalTokenSupplyDiscrete = parseInt(fromWad(totalTokenSupply))
  const totalBalanceWithLock = parseInt(fromWad(totalBalance)) + totalLocked
  // %age of tokens the user owns.
  const userOwnershipPercentage =
    formatPercent(
      parseWad(totalBalanceWithLock),
      parseWad(totalTokenSupplyDiscrete),
    ) || '0'

  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))
  const hasIssuedERC20 = tokenAddress !== constants.AddressZero
  const redeemDisabled = Boolean(
    !hasOverflow || fundingCycleMetadata?.redemptionRate.eq(0),
  )
  const veNftEnabled = Boolean(
    featureFlagEnabled(FEATURE_FLAGS.VENFT) && veNftAddress,
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
        <div>
          {veNftAddress && (
            <div>
              {totalLocked} {tokenText}{' '}
              <Link
                href={veNftPagePath('myvenfts', {
                  projectId,
                  handle,
                })}
              >
                locked
              </Link>
            </div>
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
      >
        {veNftEnabled && (
          <Link href={veNftPagePath('mint', { projectId, handle })}>
            <RichButton
              heading={<Trans>Lock {tokenText} for Governance NFTs</Trans>}
              description={
                <Trans>
                  Lock your {tokenText} to increase your voting weight and claim
                  Governance NFTs.
                </Trans>
              }
            />
          </Link>
        )}
      </ManageTokensModal>
    </>
  )
}
