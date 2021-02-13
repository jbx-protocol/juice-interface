import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Descriptions, DescriptionsProps, Input, Space } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'

export default function Rewards({
  transactor,
  contracts,
  budget,
  userAddress,
  ticketAddress,
  provider,
}: {
  transactor?: Transactor
  contracts?: Contracts
  budget?: Budget
  userAddress?: string
  ticketAddress?: string
  provider?: JsonRpcProvider
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingMint, setLoadingMint] = useState<boolean>()

  const claimableProportion = BigNumber.from(618).toHexString()

  const ticketContract = erc20Contract(ticketAddress, provider)

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
  const rewardTokenAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'getTicketRewardToken',
    args: [budget?.owner],
  })
  const rewardTokenName = useContractReader<string>({
    contract: erc20Contract(rewardTokenAddress, provider),
    functionName: 'name',
  })
  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(budget?.want, provider),
    functionName: 'name',
  })
  const swappableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'swappable',
    args: [budget?.owner, budget?.want, rewardTokenAddress],
    shouldUpdate: bigNumbersEq,
  })
  const totalClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'claimable',
    args: [budget?.owner, rewardTokenAddress],
    shouldUpdate: bigNumbersEq,
  })
  const yourClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'getClaimableRewardsAmount',
    args: [
      userAddress,
      ticketsBalance?.toHexString(),
      budget?.owner,
      claimableProportion,
    ],
  })
  const reserveAmounts = useContractReader<{
    admins: BigNumber
    beneficiaries: BigNumber
    issuers: BigNumber
  }>({
    contract: contracts?.Juicer,
    functionName: 'getReservedTickets',
    args: [budget?.owner],
    shouldUpdate: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.admins.eq(old?.admins ?? 0) &&
        val.beneficiaries.eq(old?.beneficiaries ?? 0) &&
        val.issuers.eq(old?.issuers ?? 0)
      )
    },
  })

  const share = ticketSupply?.gt(0)
    ? ticketsBalance
        ?.mul(100)
        .div(ticketSupply)
        .toString()
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

    setLoadingRedeem(true)

    const _amount = redeemAmount?.toHexString()

    console.log('🧃 Calling Juicer.redeem(issuerAddress, amount)', {
      issuerAddress: budget?.owner,
      amount: _amount,
    })

    transactor(contracts?.Juicer.redeem(budget?.owner, _amount), () =>
      setLoadingRedeem(false),
    )
  }

  function mint() {
    if (!transactor || !contracts || !budget) return

    setLoadingMint(true)

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: budget.owner,
    })

    transactor(contracts.Juicer.mintReservedTickets(budget.owner), () =>
      setLoadingMint(false),
    )
  }

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
  }

  if (!budget) return null

  return (
    <div>
      <Descriptions {...descriptionsStyle} column={1} bordered>
        <Descriptions.Item label={'Your ticket balance'}>
          {orEmpty(ticketsBalance?.toString())} {ticketSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Your ticket share">
          {orEmpty(share) + '%'}
        </Descriptions.Item>
        <Descriptions.Item label="Reward token">
          {orEmpty(rewardTokenName)}
        </Descriptions.Item>
        <Descriptions.Item label="Overflow needing swap">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            {orEmpty(swappableAmount?.toString())} {wantTokenName}
            {swappableAmount?.gt(0) ? (
              <Button htmlType="submit" onClick={swap}>
                Swap
              </Button>
            ) : null}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Unclaimed">
          {orEmpty(totalClaimableAmount?.toString())} {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Claimable by you">
          {orEmpty(yourClaimableAmount?.toString())} {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Admin reserves">
          {orEmpty(reserveAmounts?.admins?.toString())}
        </Descriptions.Item>
        <Descriptions.Item label="Beneficiaries reserves">
          {orEmpty(reserveAmounts?.beneficiaries?.toString())}
        </Descriptions.Item>
        <Descriptions.Item label="Issuers reserves">
          {orEmpty(reserveAmounts?.issuers?.toString())}
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
        <Button onClick={mint} loading={loadingMint}>
          Mint reserves
        </Button>
        <Space align="baseline">
          <Input
            defaultValue={ticketsBalance?.toString()}
            suffix={orEmpty(rewardTokenName)}
            value={redeemAmount?.toString()}
            onChange={e => setRedeemAmount(BigNumber.from(e.target.value))}
          />
          <Button type="primary" onClick={redeem} loading={loadingRedeem}>
            Redeem
          </Button>
        </Space>
      </div>
    </div>
  )
}
