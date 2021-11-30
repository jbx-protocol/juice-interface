import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Modal, Space, Statistic } from 'antd'
import ConfirmUnstakeTokensModal from 'components/modals/ConfirmUnstakeTokensModal'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import RedeemModal from 'components/modals/RedeemModal'
import FormattedAddress from 'components/shared/FormattedAddress'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { ContractName } from 'models/contract-name'
import { useCallback, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatPercent, formatWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import IssueTickets from './IssueTickets'
import SectionHeader from './SectionHeader'

export default function Rewards({
  totalOverflow,
}: {
  totalOverflow: BigNumber | undefined
}) {
  const [manageTokensModalVisible, setManageTokensModalVisible] = useState<
    boolean
  >()
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [participantsModalVisible, setParticipantsModalVisible] = useState<
    boolean
  >(false)
  const { userAddress } = useContext(NetworkContext)

  const {
    projectId,
    tokenAddress,
    tokenSymbol,
    isPreviewMode,
    currentFC,
  } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.TerminalV1,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TerminalV1,
        eventName: 'PrintPreminedTickets',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Redeem',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Convert',
        topics:
          userAddress && projectId
            ? [userAddress, projectId.toHexString()]
            : undefined,
      },
    ],
    [projectId, userAddress],
  )

  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: ticketContract && userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })

  const metadata = decodeFCMetadata(currentFC?.metadata)

  const reservedTicketBalance = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [projectId, metadata.reservedRate]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const totalSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [projectId?.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })?.add(reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0))

  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)

  const share = formatPercent(totalBalance, totalSupply)

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : false

  const hasIssueTicketsPermission = useHasPermission(OperatorPermission.Issue)
  const closeParticipantsModal = useCallback(
    () => setParticipantsModalVisible(false),
    [],
  )

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={tokenSymbol ? tokenSymbol + ' tokens' : 'Tokens'}
              tip={`${
                tokenSymbol ? tokenSymbol + ' ERC20' : 'Tokens'
              } are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet.`}
            />
          }
          valueRender={() => (
            <Descriptions
              layout={
                document.documentElement.clientWidth > 600
                  ? 'horizontal'
                  : 'vertical'
              }
              column={1}
            >
              {ticketsIssued && (
                <Descriptions.Item
                  label="Address"
                  children={
                    <div style={{ width: '100%', textAlign: 'right' }}>
                      <FormattedAddress address={tokenAddress} />
                    </div>
                  }
                />
              )}
              <Descriptions.Item
                label="Total supply"
                children={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      width: '100%',
                    }}
                  >
                    {formatWad(totalSupply, { decimals: 0 })}
                    <Button
                      size="small"
                      type="text"
                      onClick={() => setParticipantsModalVisible(true)}
                      disabled={isPreviewMode}
                    >
                      Holders
                    </Button>
                  </div>
                }
              />
              <Descriptions.Item
                label="Your balance"
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
                          {ticketsBalance?.gt(0) ? (
                            <>
                              {`${formatWad(ticketsBalance ?? 0, {
                                decimals: 0,
                              })} ${tokenSymbol}`}
                            </>
                          ) : (
                            <>0 {tokenSymbol || 'tokens'}</>
                          )}
                        </div>
                      )}
                      <div>
                        {formatWad(iouBalance ?? 0, { decimals: 0 })}
                        {ticketsIssued && <> claimable</>}
                      </div>

                      <div
                        style={{
                          cursor: 'default',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: colors.text.tertiary,
                        }}
                      >
                        {share || 0}% of supply
                      </div>
                    </div>

                    <Button
                      size="small"
                      onClick={() => setManageTokensModalVisible(true)}
                    >
                      Manage
                    </Button>
                  </div>
                }
              />
            </Descriptions>
          )}
        />

        {!ticketsIssued && hasIssueTicketsPermission && !isPreviewMode && (
          <IssueTickets projectId={projectId} />
        )}
      </Space>

      <Modal
        title={`Manage ${tokenSymbol ? tokenSymbol + ' ' : ''}tokens`}
        visible={manageTokensModalVisible}
        onCancel={() => setManageTokensModalVisible(false)}
        okButtonProps={{ hidden: true }}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={() => setRedeemModalVisible(true)} block>
            Return my ETH
          </Button>
          <Button onClick={() => setUnstakeModalVisible(true)} block>
            Claim {tokenSymbol || 'tokens'} as ERC20
          </Button>
        </Space>
      </Modal>
      <RedeemModal
        visible={redeemModalVisible}
        redeemDisabled={redeemDisabled}
        totalBalance={totalBalance}
        totalSupply={totalSupply}
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
        onCancel={closeParticipantsModal}
      />
    </div>
  )
}
