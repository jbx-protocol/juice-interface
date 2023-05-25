import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import { IssueErc20TokenButton } from 'components/buttons/IssueErc20TokenButton'
import EthereumAddress from 'components/EthereumAddress'
import ManageTokensModal from 'components/modals/ManageTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import SectionHeader from 'components/SectionHeader'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import useERC20BalanceOf from 'hooks/ERC20/useERC20BalanceOf'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/useCanPrintPreminedTokens'
import useReservedTokensOfProject from 'hooks/v1/contractReader/useReservedTokensOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/useTotalBalanceOf'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/useTotalSupplyOfProjectToken'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { useV1UnclaimedBalance } from 'hooks/v1/contractReader/useV1UnclaimedBalance'
import { useTransferTokensTx } from 'hooks/v1/transactor/useTransferTokensTx'
import { useWallet } from 'hooks/Wallet'
import { V1OperatorPermission } from 'models/v1/permissions'
import { CSSProperties, useContext, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { formatPercent, formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import ConfirmUnstakeTokensModal from './modals/ConfirmUnstakeTokensModal'
import PrintPreminedModal from './modals/PrintPreminedModal'
import RedeemModal from './modals/RedeemModal'

const labelStyle: CSSProperties = {
  width: 128,
}

export function TokensSection() {
  const { tokenAddress, tokenSymbol, currentFC, terminal, overflow } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  const { userAddress } = useWallet()

  const fundingCycleMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const unclaimedBalance = useV1UnclaimedBalance({
    projectId,
    userAddress,
  })
  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)
  const reservedTicketBalance = useReservedTokensOfProject(
    fundingCycleMetadata?.reservedRate,
  )
  const totalSupply = useTotalSupplyOfProjectToken(projectId)
  const totalSupplyWithReservedTicketBalance = totalSupply?.add(
    reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0),
  )
  const hasIssueTicketsPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Issue,
  )
  const userHasMintPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.PrintTickets,
  )
  const canPrintPreminedV1Tickets = Boolean(useCanPrintPreminedTokens())

  const share = formatPercent(
    totalBalance,
    totalSupplyWithReservedTicketBalance,
  )

  const ticketsIssued = Boolean(tokenAddress && !isZeroAddress(tokenAddress))

  const projectAllowsMint = Boolean(
    fundingCycleMetadata &&
      (fundingCycleMetadata.version === 0
        ? canPrintPreminedV1Tickets
        : fundingCycleMetadata.ticketPrintingIsAllowed),
  )

  const hasOverflow = Boolean(overflow?.gt(0))
  const redeemDisabled = Boolean(
    !hasOverflow || fundingCycleMetadata?.bondingCurveRate === 0,
  )

  const tokensLabel = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              className="normal-case"
              text={t`Tokens`}
              tip={t`Anyone who pays this project will receive ${tokensLabel}. ${tokensLabel} can also be burned to reclaim a portion of the ETH not needed for payouts.`}
            />
          }
          valueRender={() => (
            <Descriptions layout="horizontal" column={1}>
              {ticketsIssued && (
                <Descriptions.Item label={t`Address`} labelStyle={labelStyle}>
                  <div className="w-full">
                    <EthereumAddress address={tokenAddress} />
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item
                label={t`Total supply`}
                labelStyle={labelStyle}
              >
                <div className="flex w-full flex-wrap items-baseline justify-between gap-1">
                  {formatWad(totalSupplyWithReservedTicketBalance, {
                    precision: 0,
                  })}
                  <Button
                    size="small"
                    onClick={() => setParticipantsModalVisible(true)}
                  >
                    <Trans>Holders</Trans>
                  </Button>
                </div>
              </Descriptions.Item>
              {userAddress ? (
                <Descriptions.Item
                  label={t`Your balance`}
                  labelStyle={labelStyle}
                >
                  <div className="flex w-full flex-wrap justify-between gap-1">
                    <div>
                      {ticketsIssued && (
                        <div>
                          {`${formatWad(claimedBalance ?? 0, {
                            precision: 0,
                          })} ${tokenSymbol}`}
                        </div>
                      )}
                      <div>
                        <Trans>
                          {formatWad(unclaimedBalance ?? 0, { precision: 0 })}
                          {ticketsIssued ? <> claimable</> : null}
                        </Trans>
                      </div>

                      <div className="cursor-default text-sm font-medium text-grey-400 dark:text-slate-200">
                        <Trans>{share || 0}% of supply</Trans>
                      </div>
                    </div>

                    <Button
                      size="small"
                      onClick={() => setManageTokensModalVisible(true)}
                    >
                      <Trans>Manage</Trans>
                    </Button>
                  </div>
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          )}
        />

        {!ticketsIssued && hasIssueTicketsPermission && (
          <IssueErc20TokenButton />
        )}
      </Space>

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
        transferUnclaimedTokensTx={useTransferTokensTx}
        RedeemModal={RedeemModal}
        ClaimTokensModal={ConfirmUnstakeTokensModal}
        MintModal={PrintPreminedModal}
      />
      <ParticipantsModal
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        totalTokenSupply={totalSupply}
        open={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
    </div>
  )
}
