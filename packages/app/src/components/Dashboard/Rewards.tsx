import { ExportOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Space, Statistic, Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import ConfirmUnstakeTokensModal from 'components/modals/ConfirmUnstakeTokensModal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { NetworkContext } from 'contexts/networkContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

import IssueTickets from './IssueTickets'
import SectionHeader from './SectionHeader'

export default function Rewards({
  totalOverflow,
}: {
  totalOverflow: BigNumber | undefined
}) {
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext);

  const { projectId, isOwner, tokenAddress, tokenSymbol } =
    useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()

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
    [projectId],
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
  const totalSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: [projectId?.toHexString()],
    valueDidChange: bigNumbersDiff,
  })
  const rewardAmount = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && projectId && redeemAmount
        ? [
            userAddress,
            projectId.toHexString(),
            parseWad(redeemAmount).toHexString(),
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId && userAddress
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)

  const maxClaimable = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && projectId
        ? [userAddress, projectId.toHexString(), totalBalance?.toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId && userAddress
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const sharePct = totalSupply?.gt(0)
    ? totalBalance?.mul(100).div(totalSupply)
    : BigNumber.from(0)

  const share =
    sharePct?.toString() === '0' && totalBalance?.gt(0)
      ? '<1'
      : sharePct?.toString()

  // function convert() {
  //   if (!transactor || !contracts || !userAddress || !projectId) return

  //   setLoadingConvert(true)

  //   transactor(
  //     contracts.TicketBooth,
  //     'unstake',
  //     [userAddress, projectId.toHexString(), iouBalance?.toHexString()],
  //     {
  //       onDone: () => setLoadingConvert(false),
  //     },
  //   )
  // }

  function redeem() {
    if (!transactor || !contracts || !rewardAmount) return

    setLoadingRedeem(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    // Arbitrary discrete value (wei) subtracted
    const minAmount = rewardAmount?.sub(1e12).toHexString()

    transactor(
      contracts.TerminalV1,
      'redeem',
      [
        userAddress,
        projectId.toHexString(),
        redeemWad.toHexString(),
        minAmount,
        userAddress,
        false, // TODO preferconverted
      ],
      {
        onConfirmed: () => setRedeemAmount(undefined),
        onDone: () => setLoadingRedeem(false),
      },
    )
  }

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  const ticketsIssued = tokenAddress
    ? tokenAddress !== constants.AddressZero
    : undefined

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <SectionHeader
              text={tokenSymbol ? tokenSymbol + ' tokens' : 'Tokens'}
              tip={`${
                tokenSymbol ? tokenSymbol + ' ERC20' : 'tokens'
              } are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet. ${
                tokenAddress && tokenAddress !== constants.AddressZero
                  ? 'Address: ' + tokenAddress
                  : ''
              }`}
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
              <Descriptions.Item
                label={<div style={{ width: 110 }}>Total supply</div>}
                children={formatWad(totalSupply)}
              />
              <Descriptions.Item
                label={<div style={{ width: 110 }}>Your balance</div>}
                children={
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div>
                      {ticketsIssued && (
                        <div>
                          {ticketsBalance?.gt(0)
                            ? `${formatWad(ticketsBalance ?? 0, {
                                decimals: 0,
                              })} ${tokenSymbol}`
                            : `0 ${
                                tokenSymbol || 'tokens'
                              } in your wallet`}{' '}
                        </div>
                      )}
                      {(iouBalance?.gt(0) || ticketsIssued === false) && (
                        <div>
                          {formatWad(iouBalance ?? 0, { decimals: 0 })} staked{' '}
                          <Button
                            onClick={() => setUnstakeModalVisible(true)}
                            type="text"
                            size="small"
                            style={{ color: colors.text.action.primary }}
                          >
                            Unstake
                          </Button>
                        </div>
                      )}

                      <div
                        style={{
                          cursor: 'default',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: colors.text.tertiary,
                        }}
                      >
                        {share ?? 0}% of supply
                      </div>
                    </div>
                    <Button
                      loading={loadingRedeem}
                      size="small"
                      onClick={() => setRedeemModalVisible(true)}
                    >
                      Redeem
                    </Button>
                  </div>
                }
              />
            </Descriptions>
          )}
        />

        {!ticketsIssued && isOwner && <IssueTickets projectId={projectId} />}
      </Space>

      <Modal
        title={`Redeem ${tokenSymbol ?? 'Tokens'}`}
        visible={redeemModalVisible}
        onOk={() => {
          redeem()
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          setRedeemAmount(undefined)
          setRedeemModalVisible(false)
        }}
        okText="Redeem"
        okButtonProps={{ disabled: redeemDisabled }}
        width={540}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            Balance: {formatWad(totalBalance ?? 0)} {tokenSymbol ?? 'tokens'}
          </div>
          <p>
            Currently worth: <CurrencySymbol currency={0} />
            {formatWad(maxClaimable)}
          </p>
          <p>
            Tokens can be redeemed for a project's overflow according to the
            bonding curve rate of the current funding cycle.
          </p>
          {redeemDisabled ? (
            <div style={{ color: colors.text.secondary, fontWeight: 500 }}>
              You can redeem tokens once this project has overflow.
            </div>
          ) : (
            <div>
              <FormattedNumberInput
                min={0}
                step={0.001}
                placeholder="0"
                value={redeemAmount}
                disabled={redeemDisabled}
                accessory={
                  <InputAccessoryButton
                    content="MAX"
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                }
                onChange={val => setRedeemAmount(val)}
              />
              You will receive minimum {formatWad(rewardAmount) || '--'} ETH
            </div>
          )}
        </Space>
      </Modal>

      <ConfirmUnstakeTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
      />
    </div>
  )
}
