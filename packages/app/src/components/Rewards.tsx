import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { erc20Contract } from '../utils/erc20Contract'
import WtfCard from './WtfCard'

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
    functionName: 'claimable',
    args: [budget?.owner],
    shouldUpdate: bigNumbersEq,
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

  const rewardTokenName = 'DAI'

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
    <Tag color="geekblue">ERC-20 tickets not minted yet</Tag>
  )

  const iouSymbol = 'tickets'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Space direction="horizontal" size="large" align="start">
        <Statistic
          title="Unclaimed overflow"
          valueRender={() => (
            <div>
              {totalClaimableAmount?.toString() ?? 0} {rewardTokenName}
            </div>
          )}
        />

        {iouBalance?.gt(0) || !addressExists(ticketAddress) ? (
          <Statistic
            title="Your IOU wallet"
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
            title="Your wallet"
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
                  onChange={e =>
                    setRedeemAmount(BigNumber.from(e.target.value))
                  }
                />
                <Button type="primary" onClick={redeem} loading={loadingRedeem}>
                  Redeem
                </Button>
              </Space>
            )}
          />
        )}
      </Space>

      <WtfCard style={{ maxWidth: 400 }}>
        <p>
          {!addressExists(ticketAddress)
            ? 'Tickets do not exist'
            : 'Tickets exist'}
        </p>
      </WtfCard>
    </div>
  )
}
