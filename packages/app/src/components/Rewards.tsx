import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { colors } from '../constants/styles/colors'
import useContractReader, { ContractUpdateOn } from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { bigNumbersDiff } from '../utils/bigNumbersDiff'
import { erc20Contract } from '../utils/erc20Contract'
import { formatBigNum } from '../utils/formatBigNum'
import TooltipLabel from './TooltipLabel'

export default function Rewards({
  transactor,
  contracts,
  budget,
  userAddress,
  ticketAddress,
  onNeedProvider,
  isOwner,
}: {
  transactor?: Transactor
  contracts?: Contracts
  budget?: Budget
  userAddress?: string
  ticketAddress?: string
  isOwner?: boolean
  onNeedProvider: () => Promise<void>
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingClaimIou, setLoadingClaimIou] = useState<boolean>()

  const ticketsUpdateOn: ContractUpdateOn = [
    {
      contract: contracts?.Juicer,
      eventName: 'Pay',
      topics: budget ? [budget.id.toHexString()] : undefined,
    },
    {
      contract: contracts?.Juicer,
      eventName: 'Redeem',
      topics: budget ? [[], budget.project] : undefined,
    },
  ]

  const bondingCurveRate = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'bondingCurveRate',
    valueDidChange: bigNumbersDiff,
  })
  const ticketContract = erc20Contract(ticketAddress)
  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: [userAddress],
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
    args: [budget?.project, userAddress],
    valueDidChange: bigNumbersDiff,
    formatter: (value?: BigNumber) => value ?? BigNumber.from(0),
    updateOn: [
      ...ticketsUpdateOn,
      // {
      //   contract: contracts?.Juicer,
      //   event: TODO add convert event,
      // },
    ],
  })
  const iouSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'totalIOweYous',
    args: [budget?.project],
    valueDidChange: bigNumbersDiff,
    formatter: (value?: BigNumber) => value ?? BigNumber.from(0),
    updateOn: ticketsUpdateOn,
  })
  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'getOverflow',
    args: [budget?.project],
    valueDidChange: bigNumbersDiff,
    updateOn: [
      {
        contract: contracts?.Juicer,
        eventName: 'Pay',
        topics: budget ? [budget.id.toHexString()] : undefined,
      },
    ],
  })
  const wantTokenAddress = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'stablecoin',
  })
  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(wantTokenAddress),
    functionName: 'symbol',
  })

  const totalBalance = ticketsBalance?.add(iouBalance || 0) || BigNumber.from(0)
  const totalSupply = ticketSupply?.add(iouSupply || 0) || BigNumber.from(0)

  const share = totalSupply?.gt(0)
    ? totalBalance
        ?.mul(100)
        .div(totalSupply)
        .toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (
      !ticketsBalance ||
      !bondingCurveRate ||
      !totalOverflow ||
      totalSupply.eq(0)
    )
      return

    setLoadingRedeem(true)

    const minReturn = ticketsBalance
      .mul(totalOverflow)
      .mul(bondingCurveRate)
      .div(totalSupply)

    transactor(
      contracts.Juicer,
      'redeem',
      [budget?.project, redeemAmount?.toHexString(), minReturn, userAddress],
      {
        onDone: () => setLoadingRedeem(false),
        onConfirmed: () => setRedeemAmount(BigNumber.from(0)),
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

  if (!budget) return null

  const subText = (text: string) => (
    <div
      style={{
        fontSize: '.75rem',
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

  const iouSymbol = 'tickets'

  return (
    <Space direction="horizontal" size="large" align="start">
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
            {formatBigNum(totalOverflow) ?? 0} {wantTokenName}
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
                {formatBigNum(iouBalance) ?? 0} {iouSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatBigNum(totalSupply) ??
                  0} ${iouSymbol} in circulation`,
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
              {!addressExists(ticketAddress) ? null : (
                <Button loading={loadingClaimIou} onClick={claimIou}>
                  Convert tickets
                </Button>
              )}
            </div>
          )}
        ></Statistic>
      ) : null}

      {addressExists(ticketAddress) && iouSupply?.eq(0) ? (
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
                {formatBigNum(ticketsBalance) ?? 0} {ticketSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatBigNum(ticketSupply) ??
                  0} ${ticketSymbol} in circulation`,
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

      {!addressExists(ticketAddress) ? null : (
        <Statistic
          title="Redeem tickets"
          valueRender={() => (
            <Space>
              <Input
                type="number"
                placeholder="0"
                max={formatBigNum(ticketsBalance)}
                onChange={e => setRedeemAmount(BigNumber.from(e.target.value))}
              />
              <Button type="primary" onClick={redeem} loading={loadingRedeem}>
                Redeem
              </Button>
            </Space>
          )}
        />
      )}
    </Space>
  )
}
