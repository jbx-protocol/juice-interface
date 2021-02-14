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
  descriptionsStyle,
}: {
  transactor?: Transactor
  contracts?: Contracts
  budget?: Budget
  userAddress?: string
  ticketAddress?: string
  provider?: JsonRpcProvider
  descriptionsStyle?: DescriptionsProps
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()

  const claimableProportion = BigNumber.from(382).toHexString()

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
  const totalClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'claimable',
    args: [budget?.owner],
    shouldUpdate: bigNumbersEq,
  })
  const yourClaimableAmount = useContractReader<BigNumber>({
    contract: contracts?.TicketStore,
    functionName: 'getClaimableAmount',
    args: [
      userAddress,
      ticketsBalance?.toHexString(),
      budget?.owner,
      claimableProportion,
    ],
  })

  const share = ticketSupply?.gt(0)
    ? ticketsBalance
        ?.mul(100)
        .div(ticketSupply)
        .toString()
    : '0'

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

  if (!budget) return null

  const rewardTokenName = 'DAI'

  return (
    <div>
      <Descriptions {...descriptionsStyle} column={1}>
        <Descriptions.Item label={'Your ticket balance'}>
          {orEmpty(ticketsBalance?.toString())} {ticketSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Your ticket share">
          {orEmpty(share) + '%'}
        </Descriptions.Item>
        <Descriptions.Item label="Unclaimed">
          {orEmpty(totalClaimableAmount?.toString())} {rewardTokenName}
        </Descriptions.Item>
        <Descriptions.Item label="Claimable by you">
          {orEmpty(yourClaimableAmount?.toString())} {rewardTokenName}
        </Descriptions.Item>
      </Descriptions>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}
      >
        <Space align="baseline">
          <Input
            defaultValue={ticketsBalance?.toString()}
            suffix={rewardTokenName}
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
