import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { Budget } from 'models/budget'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'

import TooltipLabel from '../shared/TooltipLabel'

export default function Rewards({
  budget,
  ticketAddress,
  ticketSymbol,
  isOwner,
}: {
  budget?: Budget | undefined | null
  ticketAddress?: string
  ticketSymbol?: string
  isOwner?: boolean
}) {
  const {
    weth,
    contracts,
    transactor,
    userAddress,
    onNeedProvider,
    signingProvider,
  } = useContext(UserContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [minRedeemAmount, setMinRedeemAmount] = useState<BigNumber>()
  const [loadingClaimIou, setLoadingClaimIou] = useState<boolean>()

  const converter = useCurrencyConverter()

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: budget?.id ? [budget.id.toHexString()] : undefined,
      },
      {
        contract: ContractName.Juicer,
        eventName: 'Redeem',
        topics: budget?.project ? [[], budget.project] : undefined,
      },
    ],
    [budget?.id, budget?.project],
  )

  const bondingCurveRate = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'bondingCurveRate',
    valueDidChange: bigNumbersDiff,
  })
  const ticketContract = useErc20Contract(ticketAddress, signingProvider)
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'totalSupply',
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'iOweYous',
    args: userAddress && budget ? [budget?.project, userAddress] : null,
    valueDidChange: bigNumbersDiff,
    formatter: useCallback(
      (value?: BigNumber) => value ?? BigNumber.from(0),
      [],
    ),
    updateOn: [
      ...ticketsUpdateOn,
      {
        contract: contracts?.TicketStore,
        eventName: 'Issue',
        topics: budget ? [budget.project] : undefined,
      },
    ],
  })
  const iouSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'totalIOweYous',
    args: budget ? [budget?.project] : null,
    valueDidChange: bigNumbersDiff,
    formatter: useCallback(
      (value?: BigNumber) => value ?? BigNumber.from(0),
      [],
    ),
    updateOn: ticketsUpdateOn,
  })
  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'getOverflow',
    args: useMemo(() => (budget?.project ? [budget?.project] : null), [
      budget?.project,
    ]),
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        budget?.project
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], budget.project],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], budget.project],
              },
            ]
          : undefined,
      [budget?.project],
    ),
  })

  const totalBalance = useMemo(
    () => BigNumber.from(ticketsBalance ?? 0).add(iouBalance ?? 0),
    [ticketsBalance, iouBalance],
  )
  const combinedSupply = useMemo(
    () => BigNumber.from(ticketSupply ?? 0).add(iouSupply ?? 0),
    [ticketSupply, iouSupply],
  )

  const onChangeRedeemAmount = useCallback(
    (amount: string | undefined) => {
      setRedeemAmount(amount)

      if (
        amount === undefined ||
        !totalOverflow ||
        !bondingCurveRate ||
        !combinedSupply ||
        combinedSupply.eq(0)
      ) {
        setMinRedeemAmount(undefined)
      } else {
        setMinRedeemAmount(
          parseWad(amount)
            ?.mul(totalOverflow)
            .mul(bondingCurveRate)
            .div(1000)
            .div(combinedSupply),
        )
      }
    },
    [
      setRedeemAmount,
      setMinRedeemAmount,
      bondingCurveRate,
      combinedSupply,
      totalOverflow,
    ],
  )

  useEffect(() => onChangeRedeemAmount(fromWad(totalBalance)), [
    totalBalance,
    totalOverflow,
    combinedSupply,
    bondingCurveRate,
    onChangeRedeemAmount,
  ])

  const share = combinedSupply?.gt(0)
    ? totalBalance
        ?.mul(100)
        .div(combinedSupply)
        .toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!minRedeemAmount) return

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad) return

    transactor(
      contracts.Juicer,
      'redeem',
      [
        budget?.project,
        redeemWad?.toHexString(),
        minRedeemAmount?.toHexString(),
        userAddress,
      ],
      {
        onConfirmed: () => onChangeRedeemAmount(undefined),
      },
    )
  }

  function claimIou() {
    if (!transactor || !contracts) return onNeedProvider()

    setLoadingClaimIou(true)

    transactor(contracts.TicketStore, 'convert', [budget?.project], {
      onDone: () => setLoadingClaimIou(false),
    })
  }

  const subText = (text: string) => (
    <div
      style={{
        fontSize: '.8rem',
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  )

  const awaitingIssueTicketsTag = (
    <Tag
      style={{
        background: 'transparent',
        borderColor: colors.grape,
        color: colors.grape,
      }}
    >
      ERC-20 tickets not minted yet
    </Tag>
  )

  const iouSymbol = ticketSymbol ?? 'tickets'

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  return (
    <Space direction="vertical" size="large" align="start">
      <Statistic
        title={
          <TooltipLabel
            label="Unclaimed overflow"
            tip="You'll receive this project's tickets in return for making payments
          towards the active budget."
            placement="bottom"
          />
        }
        valueRender={() => (
          <div>
            {formatWad(totalOverflow ?? 0)} {weth?.symbol}
            <div style={{ fontSize: '.8rem' }}>
              {formattedNum(converter.weiToUsd(totalOverflow))} USD
            </div>
          </div>
        )}
      />

      {iouBalance?.gt(0) || !addressExists(ticketAddress) ? (
        <Statistic
          title={
            <TooltipLabel
              label="Your wallet"
              tip="Tickets can be redeemed for your contract's overflow on a bonding
            curve – a ticket is redeemable for 38.2% of its proportional
            overflowed tokens. Meaning, if there are 100 overflow tokens available
            and 100 of your tickets in circulation, 10 tickets could be redeemed
            for 3.82 of the overflow tokens. The rest is left to share between the
            remaining ticket hodlers."
              placement="bottom"
            />
          }
          valueRender={() => (
            <div>
              <div>
                {formatWad(iouBalance ?? 0)} {iouSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatWad(combinedSupply) ??
                  0} ${iouSymbol} in circulation`,
              )}
              {!ticketSymbol ? (
                isOwner ? (
                  <Tooltip
                    title="Issue tickets in the back office"
                    placement="right"
                  >
                    {awaitingIssueTicketsTag}
                  </Tooltip>
                ) : (
                  awaitingIssueTicketsTag
                )
              ) : null}
              {!addressExists(ticketAddress) ? null : (
                <Button loading={loadingClaimIou} onClick={claimIou}>
                  Convert tickets
                </Button>
              )}
            </div>
          )}
        ></Statistic>
      ) : null}

      {addressExists(ticketAddress) && !iouSupply?.gt(0) ? (
        <Statistic
          title={
            <TooltipLabel
              label="Your wallet"
              tip="If this project has minted ERC-20 tokens to track tickets, you'll see
            yours in your wallet once you contribute a payment."
              placement="bottom"
            />
          }
          valueRender={() => (
            <div>
              <div>
                {formatWad(ticketsBalance)} {ticketSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatWad(
                  ticketSupply?.toString(),
                )} ${ticketSymbol} in circulation`,
              )}
              {!addressExists(ticketAddress) ? (
                isOwner ? (
                  <Tooltip
                    title="Issue tickets in the back office"
                    placement="right"
                  >
                    {awaitingIssueTicketsTag}
                  </Tooltip>
                ) : (
                  awaitingIssueTicketsTag
                )
              ) : null}
            </div>
          )}
        />
      ) : null}

      <Statistic
        title={
          redeemDisabled ? (
            <TooltipLabel
              label="Redeem tickets"
              tip="Tickets can be redeemed once this project has overflow."
            />
          ) : (
            'Redeem tickets'
          )
        }
        valueRender={() => (
          <Space>
            <Input
              type="number"
              disabled={redeemDisabled}
              placeholder="0"
              value={redeemAmount}
              suffix={
                redeemDisabled ? null : (
                  <InputAccessoryButton
                    content="MAX"
                    onClick={() => onChangeRedeemAmount(fromWad(totalBalance))}
                  />
                )
              }
              max={fromWad(totalBalance)}
              onChange={e => onChangeRedeemAmount(e.target.value)}
            />
            <Button
              type="primary"
              onClick={() => setRedeemModalVisible(true)}
              disabled={redeemDisabled}
            >
              Redeem
            </Button>

            <Modal
              title="Redeem tickets"
              visible={redeemModalVisible}
              onOk={() => {
                redeem()
                setRedeemModalVisible(false)
              }}
              onCancel={() => {
                onChangeRedeemAmount(undefined)
                setRedeemModalVisible(false)
              }}
              okText="Confirm"
              width={540}
            >
              <Space direction="vertical">
                <div>
                  Redeem {redeemAmount} {ticketSymbol ?? iouSymbol}
                </div>
                <div>
                  You will receive minimum {formatWad(minRedeemAmount)}{' '}
                  {weth?.symbol}
                </div>
              </Space>
            </Modal>
          </Space>
        )}
      />
    </Space>
  )
}
