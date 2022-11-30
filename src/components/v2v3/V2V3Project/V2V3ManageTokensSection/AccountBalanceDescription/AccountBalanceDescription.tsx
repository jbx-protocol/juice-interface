import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ManageTokensModal from 'components/ManageTokensModal'
import RichButton from 'components/RichButton'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { VeNftContext } from 'contexts/veNftContext'
import useERC20BalanceOf from 'hooks/ERC20BalanceOf'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import useUserUnclaimedTokenBalance from 'hooks/v2v3/contractReader/UserUnclaimedTokenBalance'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/TransferUnclaimedTokensTx'
import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2v3/permissions'
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
import V2ClaimTokensModal from './V2ClaimTokensModal'
import V2MintModal from './V2MintModal'
import V2RedeemModal from './V2RedeemModal'

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
    V2OperatorPermission.MINT,
  )

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
        <div className="cursor-default text-sm font-medium text-grey-400 dark:text-slate-200">
          <Trans>{userOwnershipPercentage}% of total supply</Trans>
        </div>
      </div>

      <Button size="small" onClick={() => setManageTokensModalVisible(true)}>
        <Trans>Manage {tokenText}</Trans>
      </Button>

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
        RedeemModal={V2RedeemModal}
        ClaimTokensModal={V2ClaimTokensModal}
        MintModal={V2MintModal}
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
