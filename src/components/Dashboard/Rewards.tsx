import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Descriptions, Modal, Space, Statistic, Tooltip } from 'antd'
import ConfirmUnstakeTokensModal from 'components/modals/ConfirmUnstakeTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import RedeemModal from 'components/modals/RedeemModal'
import FormattedAddress from 'components/shared/FormattedAddress'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import useERC20BalanceOf from 'hooks/v1/contractReader/ERC20BalanceOf'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import useReservedTokensOfProject from 'hooks/v1/contractReader/ReservedTokensOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import useTotalSupplyOfProjectToken from 'hooks/v1/contractReader/TotalSupplyOfProjectToken'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { CSSProperties, useContext, useState } from 'react'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import PrintPreminedModal from '../modals/PrintPreminedModal'
import IssueTickets from './IssueTickets'
import SectionHeader from './SectionHeader'

export default function Rewards() {
  const [manageTokensModalVisible, setManageTokensModalVisible] =
    useState<boolean>()
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [mintModalVisible, setMintModalVisible] = useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)
  const { userAddress } = useContext(NetworkContext)

  const {
    projectId,
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    currentFC,
    terminal,
  } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)

  const canPrintPreminedV1Tickets = useCanPrintPreminedTokens()

  const claimedBalance = useERC20BalanceOf(tokenAddress, userAddress)
  const unclaimedBalance = useUnclaimedBalanceOfUser()
  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const reservedTicketBalance = useReservedTokensOfProject(
    metadata?.reservedRate,
  )

  const totalSupply = useTotalSupplyOfProjectToken(projectId)?.add(
    reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0),
  )

  const share = formatPercent(totalBalance, totalSupply)

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const hasIssueTicketsPermission = useHasPermission(OperatorPermission.Issue)
  const hasPrintPreminePermission = useHasPermission(
    OperatorPermission.PrintTickets,
  )

  const mintingTokensIsAllowed =
    metadata &&
    (metadata.version === 0
      ? canPrintPreminedV1Tickets
      : metadata.ticketPrintingIsAllowed)

  const labelStyle: CSSProperties = {
    width: 128,
  }

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={tokenSymbol ? tokenSymbol + ' ' + t`tokens` : t`Tokens`}
              tip={
                `${tokenSymbol ? tokenSymbol + ' ' + t`ERC20` : t`Tokens`}` +
                t` are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet.`
              }
            />
          }
          valueRender={() => (
            <Descriptions layout="horizontal" column={1}>
              {ticketsIssued && (
                <Descriptions.Item
                  label={t`Address`}
                  labelStyle={labelStyle}
                  children={
                    <div style={{ width: '100%' }}>
                      <FormattedAddress address={tokenAddress} />
                    </div>
                  }
                />
              )}
              <Descriptions.Item
                label={t`Total supply`}
                labelStyle={labelStyle}
                children={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      width: '100%',
                    }}
                  >
                    {formatWad(totalSupply, { precision: 0 })}
                    <Button
                      size="small"
                      onClick={() => setParticipantsModalVisible(true)}
                      disabled={isPreviewMode}
                    >
                      <Trans>Holders</Trans>
                    </Button>
                  </div>
                }
              />
              <Descriptions.Item
                label={t`Your balance`}
                labelStyle={labelStyle}
                children={
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <div>
                      {ticketsIssued && (
                        <div>
                          {claimedBalance?.gt(0) ? (
                            <>
                              {`${formatWad(claimedBalance ?? 0, {
                                precision: 0,
                              })} ${tokenSymbol}`}
                            </>
                          ) : (
                            <>0 {tokenSymbol || 'tokens'}</>
                          )}
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
                }
              />
            </Descriptions>
          )}
        />

        {!ticketsIssued && hasIssueTicketsPermission && !isPreviewMode && (
          <IssueTickets />
        )}
      </Space>

      <Modal
        title={t`Manage ${tokenSymbol ? tokenSymbol + ' ' : ''}tokens`}
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        okButtonProps={{ hidden: true }}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={() => setRedeemModalVisible(true)} block>
            <Trans>Return my ETH</Trans>
          </Button>
          <Button onClick={() => setUnstakeModalVisible(true)} block>
            <Trans>Claim {tokenSymbol || 'tokens'} as ERC20</Trans>
          </Button>
          {hasPrintPreminePermission && projectId?.gt(0) && (
            <Tooltip
              title={t`Minting tokens can be enabled or disabled by reconfiguring a v1.1 project's funding cycle. Tokens can only be minted by the project owner.`}
            >
              <Button
                disabled={!mintingTokensIsAllowed}
                onClick={() => setMintModalVisible(true)}
                block
              >
                <Trans>
                  Mint {tokenSymbol ? tokenSymbol + ' ' : ''}tokens{' '}
                </Trans>
              </Button>
            </Tooltip>
          )}
        </Space>
      </Modal>
      <RedeemModal
        visible={redeemModalVisible}
        onOk={() => {
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          setRedeemModalVisible(false)
        }}
      />
      <ConfirmUnstakeTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
      />
      <ParticipantsModal
        visible={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
      <PrintPreminedModal
        visible={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
      />
    </div>
  )
}
