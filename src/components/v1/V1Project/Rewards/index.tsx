import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Space, Statistic } from 'antd'

import FormattedAddress from 'components/FormattedAddress'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import * as constants from '@ethersproject/constants'
import useERC20BalanceOf from 'hooks/v1/contractReader/ERC20BalanceOf'
import { useIssueTokensTx } from 'hooks/v1/transactor/IssueTokensTx'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { V1OperatorPermission } from 'models/v1/permissions'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/TotalSupplyOfProjectToken'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { CSSProperties, useContext, useState } from 'react'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import IssueTokenButton from 'components/IssueTokenButton'
import SectionHeader from 'components/SectionHeader'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import ManageTokensModal from 'components/ManageTokensModal'

import RedeemModal from '../modals/RedeemModal'
import ConfirmUnstakeTokensModal from '../modals/ConfirmUnstakeTokensModal'
import PrintPreminedModal from '../modals/PrintPreminedModal'

export default function Rewards() {
  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  const { userAddress } = useContext(NetworkContext)
  const {
    projectId,
    handle,
    tokenAddress,
    tokenSymbol,
    cv,
    isPreviewMode,
    currentFC,
    terminal,
    overflow,
  } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const claimedBalance = useERC20BalanceOf(tokenAddress, userAddress)
  const unclaimedBalance = useUnclaimedBalanceOfUser()
  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const reservedTicketBalance = useReservedTokensOfProject(
    metadata?.reservedRate,
  )

  const totalSupply = useTotalSupplyOfProjectToken(projectId)
  const totalSupplyWithReservedTicketBalance = totalSupply?.add(
    reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0),
  )

  const share = formatPercent(
    totalBalance,
    totalSupplyWithReservedTicketBalance,
  )

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const hasIssueTicketsPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Issue,
  )

  const labelStyle: CSSProperties = {
    width: 128,
  }

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: true,
    plural: true,
  })

  const canPrintPreminedV1Tickets = Boolean(useCanPrintPreminedTokens())
  const userHasMintPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.PrintTickets,
  )

  const projectAllowsMint = Boolean(
    metadata &&
      (metadata.version === 0
        ? canPrintPreminedV1Tickets
        : metadata.ticketPrintingIsAllowed),
  )

  const hasOverflow = Boolean(overflow?.gt(0))

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
          <IssueTokenButton useIssueTokensTx={useIssueTokensTx} />
        )}
      </Space>

      <ManageTokensModal
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        projectAllowsMint={projectAllowsMint}
        userHasMintPermission={userHasMintPermission}
        veNftEnabled={false}
        hasOverflow={hasOverflow}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        RedeemModal={RedeemModal}
        ClaimTokensModal={ConfirmUnstakeTokensModal}
        MintModal={PrintPreminedModal}
      />
      <ParticipantsModal
        projectId={projectId}
        projectName={handle}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        cv={cv}
        totalTokenSupply={totalSupply}
        visible={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
    </div>
  )
}
