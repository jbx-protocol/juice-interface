import { ExportOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Space, Statistic, Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import Loading from 'components/shared/Loading'
import { ThemeOption } from 'constants/theme/theme-option'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import TooltipLabel from '../shared/TooltipLabel'
import IssueTickets from './IssueTickets'

export default function Rewards({
  totalOverflow,
  tokenSymbol,
}: {
  totalOverflow: BigNumber | undefined
  tokenSymbol?: string
}) {
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(UserContext)

  const { projectId, currentFC, isOwner, tokenAddress } = useContext(
    ProjectContext,
  )

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingConvert, setLoadingConvert] = useState<boolean>()

  const metadata = decodeFCMetadata(currentFC?.metadata)

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
  const stakedTokenSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedTotalSupplyOf',
    args: [projectId?.toHexString()],
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const unstakedTokenSupply = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'totalSupply',
    valueDidChange: bigNumbersDiff,
  })
  const reservedTickets = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [
            projectId.toHexString(),
            BigNumber.from(metadata.reservedRate).toHexString(),
          ]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () => [
        ...ticketsUpdateOn,
        {
          contract: ContractName.TerminalV1,
          eventName: 'PrintReserveTickets',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
      ],
      [ticketsUpdateOn],
    ),
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

  const totalSupply = stakedTokenSupply
    ?.add(unstakedTokenSupply ?? 0)
    .add(reservedTickets ?? 0)

  const sharePct = totalSupply?.gt(0)
    ? totalBalance?.mul(100).div(totalSupply)
    : BigNumber.from(0)

  const share =
    sharePct?.toString() === '0' && totalBalance?.gt(0)
      ? '<1'
      : sharePct?.toString()

  function convert() {
    if (!transactor || !contracts || !userAddress || !projectId) return

    setLoadingConvert(true)

    transactor(
      contracts.TicketBooth,
      'unstake',
      [userAddress, projectId.toHexString(), iouBalance?.toHexString()],
      {
        onDone: () => setLoadingConvert(false),
      },
    )
  }

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
            <TooltipLabel
              label={
                <span>{tokenSymbol ? tokenSymbol + ' tokens' : 'Tokens'}</span>
              }
              tip={`${
                tokenSymbol ? tokenSymbol + ' ERC20' : 'tokens'
              } are distributed to anyone who pays this project. If the project has set a funding target, tokens can be redeemed for a portion of the project's overflow whether or not they have been claimed yet. ${
                tokenAddress && tokenAddress !== constants.AddressZero
                  ? 'Address: ' + tokenAddress
                  : ''
              }`}
              style={{
                fontWeight:
                  forThemeOption &&
                  forThemeOption({
                    [ThemeOption.light]: 600,
                    [ThemeOption.dark]: 400,
                  }),
              }}
            />
          }
          valueRender={() => (
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item
                label={<div style={{ width: 110 }}>Total supply</div>}
                children={<div>{formatWad(totalSupply)}</div>}
              />
              <Descriptions.Item
                label={<div style={{ width: 110 }}>Your balance</div>}
                children={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div>
                      {ticketsIssued && (
                        <div>
                          {ticketsBalance?.gt(0)
                            ? formatWad(ticketsBalance ?? 0)
                            : '0 in your wallet'}{' '}
                        </div>
                      )}
                      {(iouBalance?.gt(0) || ticketsIssued === false) && (
                        <div>
                          {ticketsIssued &&
                          iouBalance?.gt(0) &&
                          loadingConvert ? (
                            <Loading />
                          ) : (
                            <div style={{ color: colors.text.secondary }}>
                              {formatWad(iouBalance ?? 0)} staked{' '}
                              <Tooltip title={'Unstake ' + tokenSymbol}>
                                <ExportOutlined
                                  style={{ color: colors.icon.action.primary }}
                                  onClick={convert}
                                />
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Space>
                      <div
                        style={{
                          fontSize: '.8rem',
                          color: colors.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {share ?? 0}%
                      </div>
                      <Button
                        loading={loadingRedeem}
                        size="small"
                        onClick={() => setRedeemModalVisible(true)}
                      >
                        Redeem
                      </Button>
                    </Space>
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
    </div>
  )
}
