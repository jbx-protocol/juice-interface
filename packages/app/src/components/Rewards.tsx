import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import { colors } from '../constants/styles/colors'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { erc20Contract } from '../utils/erc20Contract'
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

  const ticketContract = erc20Contract(ticketAddress)

  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
    formatter: (value: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: [userAddress],
    shouldUpdate: bigNumbersEq,
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'totalSupply',
    shouldUpdate: bigNumbersEq,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'iOweYous',
    args: [budget?.owner, userAddress],
    shouldUpdate: bigNumbersEq,
    formatter: (value?: BigNumber) => value ?? BigNumber.from(0),
  })
  const iouSupply = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'totalIOweYous',
    args: [budget?.owner],
    shouldUpdate: bigNumbersEq,
    formatter: (value?: BigNumber) => value ?? BigNumber.from(0),
  })
  const totalClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'getOverflow',
    args: [budget?.owner],
    shouldUpdate: bigNumbersEq,
  })
  const wantToken = useContractReader<string>({
    contract: contracts?.Juicer,
    functionName: 'stablecoin',
  })

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(wantToken),
    functionName: 'symbol',
  })

  const share = ticketSupply?.gt(0)
    ? ticketsBalance
        ?.mul(100)
        .div(ticketSupply)
        .toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    setLoadingRedeem(true)

    const _amount = redeemAmount?.toHexString()

    console.log('🧃 Calling Juicer.redeem(issuerAddress, amount)', {
      issuerAddress: budget?.owner,
      amount: _amount,
    })

    transactor(
      contracts.Juicer.redeem(budget?.owner, _amount),
      () => {
        setLoadingRedeem(false)
        setRedeemAmount(BigNumber.from(0))
      },
      true,
    )
  }

  function claimIou() {
    if (!transactor || !contracts) return onNeedProvider()

    setLoadingClaimIou(true)

    transactor(
      contracts.TicketStore.claimIOweYou(budget?.owner),
      () => {
        setLoadingClaimIou(false)
      },
      true,
    )
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
            {totalClaimableAmount?.toString() ?? 0} {wantTokenName}
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
                {iouBalance?.toString() ?? 0} {iouSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${ticketSupply
                  ?.add(iouSupply ?? 0)
                  .toString() ?? 0} ${iouSymbol} in circulation`,
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
                {ticketsBalance?.toString() ?? 0} {ticketSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${ticketSupply?.toString() ??
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
                max={ticketsBalance?.toString()}
                value={redeem.toString()}
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
