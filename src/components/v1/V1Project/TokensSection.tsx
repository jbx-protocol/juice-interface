import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { IssueErc20TokenButton } from 'components/IssueErc20TokenButton'
import ManageTokensModal from 'components/ManageTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import SectionHeader from 'components/SectionHeader'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useERC20BalanceOf from 'hooks/ERC20BalanceOf'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/TotalSupplyOfProjectToken'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'
import { useWallet } from 'hooks/Wallet'
import { V1OperatorPermission } from 'models/v1/permissions'
import { CSSProperties, useContext, useState } from 'react'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    currentFC,
    terminal,
    overflow,
  } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  const { userAddress } = useWallet()

  const fundingCycleMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const unclaimedBalance = useUnclaimedBalanceOfUser()
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

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

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
    capitalize: true,
    plural: true,
  })

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={tokensLabel}
              tip={t`${tokensLabel} are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet.`}
            />
          }
          valueRender={() => (
            <Descriptions layout="horizontal" column={1}>
              {ticketsIssued && (
                <Descriptions.Item label={t`Address`} labelStyle={labelStyle}>
                  <div style={{ width: '100%' }}>
                    <FormattedAddress address={tokenAddress} />
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item
                label={t`Total supply`}
                labelStyle={labelStyle}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    width: '100%',
                    gap: 5,
                    flexWrap: 'wrap',
                  }}
                >
                  {formatWad(totalSupplyWithReservedTicketBalance, {
                    precision: 0,
                  })}
                  <Button
                    size="small"
                    onClick={() => setParticipantsModalVisible(true)}
                    disabled={isPreviewMode}
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
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 5,
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
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

                      <div
                        style={{
                          cursor: 'default',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: colors.text.tertiary,
                        }}
                      >
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

        {!ticketsIssued && hasIssueTicketsPermission && !isPreviewMode && (
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
