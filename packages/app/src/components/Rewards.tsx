import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, Input, Space } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import { erc20Contract } from '../helpers/erc20Contract'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'

export default function Rewards({
  transactor,
  contracts,
  budget,
  providerAddress,
}: {
  transactor?: Transactor
  contracts?: Contracts
  budget?: Budget
  providerAddress?: string
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>()

  const claimableProportion = BigNumber.from(618).toHexString()

  const ticketAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'tickets',
    args: [budget?.owner],
  })
  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'symbol',
    formatter: (value: string) => Web3.utils.hexToString(value),
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: erc20Contract(ticketAddress),
    functionName: 'balanceOf',
    args: [providerAddress],
    callback: balance => setRedeemAmount(balance),
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: erc20Contract(ticketAddress),
    functionName: 'totalSupply',
  })
  const rewardTokenAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'getTicketRewardToken',
    args: [budget?.owner],
  })
  const rewardTokenName = useContractReader<string>({
    contract: erc20Contract(rewardTokenAddress),
    functionName: 'name',
  })
  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(budget?.want),
    functionName: 'name',
  })
  const swappableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'swappable',
    args: [budget?.owner, budget?.want, rewardTokenAddress],
  })
  const totalClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'claimable',
    args: [budget?.owner, rewardTokenAddress],
  })
  const yourClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'getClaimableRewardsAmount',
    args: [
      providerAddress,
      ticketsBalance?.toHexString(),
      budget?.owner,
      claimableProportion,
    ],
  })
  const reserveAmounts = useContractReader<{
    _admins: BigNumber
    _beneficiaries: BigNumber
    _issuers: BigNumber
  }>({
    contract: contracts?.Juicer,
    functionName: 'getReservedTickets',
    args: [budget?.owner],
  })

  console.log('reserves', reserveAmounts)

  const share = ticketSupply?.gt(0)
    ? ticketsBalance?.div(ticketSupply).toString()
    : '0'

  function swap() {
    if (!transactor || !contracts || !budget || swappableAmount === undefined)
      return

    const _swappable = swappableAmount.toHexString()
    // TODO handle conversion. Use 1:1 for now
    const _expectedAmount = _swappable

    console.log(
      '🧃 Calling Juicer.swap(owner, want, swappable, target, expectedAmount)',
      {
        owner: budget.owner,
        want: budget.want,
        swappable: _swappable,
        target: rewardTokenAddress,
        expectedAmount: _expectedAmount,
      },
    )

    transactor(
      contracts.Juicer.swap(
        budget.owner,
        budget.want,
        _swappable,
        rewardTokenAddress,
        _expectedAmount,
      ),
    )
  }

  function redeem() {
    if (!transactor || !contracts) return

    const _amount = redeemAmount?.toHexString()

    console.log('🧃 Calling Juicer.redeem(issuerAddress, amount)', {
      issuerAddress: budget?.owner,
      amount: _amount,
    })

    transactor(contracts?.Juicer.redeem(budget?.owner, _amount))
  }

  function mint() {
    if (!transactor || !contracts || !budget) return

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: budget.owner,
    })

    transactor(contracts.Juicer.mintReservedTickets(budget.owner))
  }

  const descriptionsStyle = {
    labelStyle: { fontWeight: 600 },
  }

  return (
    <div>
      <Descriptions {...descriptionsStyle} column={1} bordered>
        <Descriptions.Item label={'Your ' + ticketSymbol + ' balance'}>
          {ticketsBalance?.toString() ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Your share">
          {(share ?? '--') + '%'}
        </Descriptions.Item>
        <Descriptions.Item label="Reward token">
          {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Overflow needing swap">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            {swappableAmount?.toString() ?? '--'} {wantTokenName}
            {swappableAmount?.gt(0) ? (
              <Button htmlType="submit" onClick={swap}>
                Swap
              </Button>
            ) : (
              undefined
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Unclaimed">
          {totalClaimableAmount?.toString() ?? '--'} {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Claimable by you">
          {yourClaimableAmount?.toString() ?? '--'} {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Admin reserves">
          {reserveAmounts?._admins?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Beneficiaries reserves">
          {reserveAmounts?._beneficiaries?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Issuers reserves">
          {reserveAmounts?._issuers?.toString()}
        </Descriptions.Item>
      </Descriptions>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 25,
          textAlign: 'right',
          width: '100%',
        }}
      >
        <Button onClick={mint}>Mint reserves</Button>
        <Space align="baseline">
          <Input
            defaultValue={ticketsBalance?.toString()}
            suffix={rewardTokenName ?? '--'}
            value={redeemAmount?.toString()}
            onChange={e => setRedeemAmount(BigNumber.from(e.target.value))}
          />
          <Button onClick={redeem}>Redeem</Button>
        </Space>
      </div>
    </div>
  )
}
