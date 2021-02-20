import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { erc20Contract } from '../utils/erc20Contract'
import { isEmptyAddress } from '../utils/isEmptyAddress'
import WtfCard from './WtfCard'

export default function Rewards({
  transactor,
  contracts,
  budget,
  userAddress,
  ticketAddress,
  onNeedProvider,
}: {
  transactor?: Transactor
  contracts?: Contracts
  budget?: Budget
  userAddress?: string
  ticketAddress?: string
  onNeedProvider: () => Promise<void>
}) {
  const [redeemAmount, setRedeemAmount] = useState<BigNumber>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()

  const ticketContract = erc20Contract(ticketAddress)

  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
    formatter: (value: string) =>
      value ? Web3.utils.hexToString(value) : 'tickets',
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
      contracts?.Juicer.redeem(budget?.owner, _amount),
      () => {
        setLoadingRedeem(false)
        setRedeemAmount(BigNumber.from(0))
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
              <Tooltip
                title="Issue tickets in the back office"
                placement="right"
              >
                <Tag color="geekblue">ERC-20 tickets not minted yet</Tag>
              </Tooltip>
            </div>
          )}
        />

        {isEmptyAddress(ticketAddress) ? null : (
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
          {isEmptyAddress(ticketAddress)
            ? 'Tickets do not exist'
            : 'Tickets exist'}
        </p>
      </WtfCard>
    </div>
  )
}
