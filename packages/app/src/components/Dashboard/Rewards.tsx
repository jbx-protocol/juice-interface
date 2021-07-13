import { SwapOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Space, Statistic, Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import Loading from 'components/shared/Loading'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import TooltipLabel from '../shared/TooltipLabel'
import IssueTickets from './IssueTickets'

export default function Rewards({
  projectId,
  currentCycle,
  totalOverflow,
  isOwner,
}: {
  projectId: BigNumber | undefined
  currentCycle: FundingCycle | undefined
  totalOverflow: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(UserContext)

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingPrint, setLoadingPrint] = useState<boolean>()
  const [loadingConvert, setLoadingConvert] = useState<boolean>()

  const metadata = decodeFCMetadata(currentCycle?.metadata)

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.Juicer,
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

  const ticketAddress = useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId ? [projectId.toHexString()] : undefined,
        },
      ],
      [],
    ),
  })
  const ticketContract = useErc20Contract(ticketAddress)
  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })
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
    contract: ContractName.Juicer,
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
          contract: ContractName.Juicer,
          eventName: 'PrintReserveTickets',
          topics: projectId ? [[], projectId.toHexString()] : undefined,
        },
      ],
      [ticketsUpdateOn],
    ),
  })
  const claimableOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
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
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)
  const totalSupply = stakedTokenSupply
    ?.add(unstakedTokenSupply ?? 0)
    .add(reservedTickets ?? 0)

  const share = totalSupply?.gt(0)
    ? totalBalance
        ?.mul(100)
        .div(totalSupply)
        .toString()
    : '0'

  function convert() {
    if (!transactor || !contracts || !userAddress || !projectId) return

    setLoadingConvert(true)

    transactor(
      contracts.TicketBooth,
      'convert',
      [userAddress, projectId.toHexString()],
      {
        onDone: () => setLoadingConvert(false),
      },
    )
  }

  function print() {
    if (!transactor || !contracts || !projectId) return

    setLoadingPrint(true)

    transactor(
      contracts.Juicer,
      'printReservedTickets',
      [projectId.toHexString()],
      {
        onDone: () => setLoadingPrint(false),
      },
    )
  }

  function redeem() {
    if (!transactor || !contracts || !claimableOverflow) return

    setLoadingRedeem(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    // Arbitrary discrete value (wei) subtracted
    const minAmount = claimableOverflow?.sub(1e12).toHexString()

    transactor(
      contracts.Juicer,
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

  const ticketsIssued = ticketAddress
    ? ticketAddress !== constants.AddressZero
    : undefined

  return (
    <div>
      <Space direction="vertical" size="large">
        <Statistic
          title={
            <TooltipLabel
              label="Tokens"
              tip="Tokens are distributed to whoever pays a project. Supporters will initially receive staked tokens, which can be redeemed for a project's overflow if it has set a funding target. Once a project has issued its ERC-20 tokens, token holders can withdraw their balance in ERC-20s, which can still be redeemed for overflow."
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
                label="Total supply"
                children={<div>{formatWad(totalSupply)}</div>}
              />
              <Descriptions.Item
                label={
                  <TooltipLabel
                    label="Reserved"
                    tip="A project may reserve a percentage of tokens minted from every payment it receives, for any number of chosen addresses. Minting reserved tokens transfers them to their destined wallets."
                    style={{ marginRight: 14 }}
                  />
                }
                children={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div>{formatWad(reservedTickets) || 0}</div>
                    <Button
                      loading={loadingPrint}
                      size="small"
                      onClick={print}
                      disabled={!reservedTickets?.gt(0)}
                    >
                      Mint
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div>
                      {(iouBalance?.gt(0) || ticketsIssued === false) && (
                        <div>
                          {formatWad(iouBalance ?? 0)}{' '}
                          {ticketsIssued && iouBalance?.gt(0) && (
                            <Tooltip
                              title={
                                'Claim staked token balance in ' + ticketSymbol
                              }
                            >
                              {loadingConvert ? (
                                <Loading />
                              ) : (
                                <SwapOutlined
                                  onClick={convert}
                                  style={{ color: colors.icon.action.primary }}
                                />
                              )}
                            </Tooltip>
                          )}
                        </div>
                      )}
                      {ticketsIssued && (
                        <div>
                          {formatWad(ticketsBalance ?? 0)}{' '}
                          <Tooltip title={ticketSymbol}>
                            {ticketAddress}
                          </Tooltip>
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
        title={`Redeem ${ticketSymbol ?? 'Tokens'}`}
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
          <div>Balance: {formatWad(totalBalance ?? 0)} tickets</div>
          <p>
            Tokens can be redeemed for a project's overflow according to the
            bonding curve rate of the current funding cycle. For example, if the
            rate is 70%, there's 100 ETH overflow available, and 100 tokens in
            circulation, 10 tokens could be redeemed for 7 ETH.
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
              You will receive minimum {formatWad(claimableOverflow) || '--'}{' '}
              ETH
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}
