import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Descriptions, Input, Space } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { colors } from '../constants/styles/colors'
import { bigNumbersEq } from '../utils/bigNumbersEq'
import { erc20Contract } from '../utils/erc20Contract'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'

export default function BudgetDetail({
  budget,
  contracts,
  transactor,
  showSustained,
  showMinted,
  userAddress,
  provider,
}: {
  budget?: Budget
  contracts?: Contracts
  transactor?: Transactor
  showSustained?: boolean
  showMinted?: boolean
  userAddress?: string
  provider?: JsonRpcProvider
}) {
  const [tapAmount, setTapAmount] = useState<BigNumber>(BigNumber.from(0))

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(budget?.want, provider),
    functionName: 'name',
  })

  const tappableAmount = useContractReader<BigNumber>({
    contract: contracts?.BudgetStore,
    functionName: 'getTappableAmount',
    args: [budget?.id],
    shouldUpdate: bigNumbersEq,
  })

  const secondsLeft =
    budget &&
    Math.floor(
      budget.start.toNumber() +
        budget.duration.toNumber() -
        new Date().valueOf() / 1000,
    )

  function expandedTimeString(millis: number) {
    if (!millis || millis <= 0) return 0

    const days = millis && millis / 1000 / SECONDS_IN_DAY
    const hours = days && (days % 1) * 24
    const minutes = hours && (hours % 1) * 60
    const seconds = minutes && (minutes % 1) * 60

    return `${days && days >= 1 ? Math.floor(days) + 'd ' : ''}${
      hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
    }
        ${minutes && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
        ${seconds && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`
  }

  const isOwner = budget?.owner === userAddress

  function tap() {
    if (!transactor || !contracts?.Juicer || !budget) return

    const id = budget.id.toHexString()
    const amount = tapAmount.toHexString()

    console.log('🧃 Calling Juicer.tapBudget(number, amount, address)', {
      id,
      amount,
      userAddress,
    })

    transactor(contracts.Juicer?.tapBudget(id, amount, userAddress))
  }

  if (!budget) return null

  const surplus = budget.total.sub(budget.target)

  const descriptionsStyle = {
    labelStyle: { fontWeight: 600 },
  }

  const gutter = 25

  return (
    <div>
      {budget.id.gt(0) ? (
        <h3
          style={{
            paddingTop: 15,
            marginBottom: 0,
            paddingBottom: 15,
            paddingLeft: gutter,
            fontWeight: 600,
            borderBottom: '1px solid black',
          }}
        >
          ID: {budget.id.toString()}
        </h3>
      ) : null}

      <Descriptions
        {...descriptionsStyle}
        column={showSustained ? 2 : 1}
        bordered
      >
        <Descriptions.Item label="Start">
          {new Date(budget.start.toNumber() * 1000).toISOString()}
        </Descriptions.Item>

        {showSustained ? (
          <Descriptions.Item label="Target">
            {budget.target.toString()} {wantTokenName}
          </Descriptions.Item>
        ) : null}

        <Descriptions.Item label="Duration">
          {expandedTimeString(budget && budget.duration.toNumber() * 1000)}
        </Descriptions.Item>

        {showSustained ? (
          <Descriptions.Item label="Sustained">
            {budget.total.toString()} {wantTokenName}{' '}
            {surplus.gt(0) ? (
              <span style={{ color: colors.secondary, fontWeight: 600 }}>
                +{surplus.toString()}
              </span>
            ) : null}
          </Descriptions.Item>
        ) : null}

        <Descriptions.Item label="Time left">
          {(secondsLeft && expandedTimeString(secondsLeft * 1000)) || 'Ended'}
        </Descriptions.Item>

        {showSustained ? (
          <Descriptions.Item label="Tapped">
            {budget.tapped.toString()} {wantTokenName}
          </Descriptions.Item>
        ) : null}
      </Descriptions>

      {budget?.link ? (
        <div
          style={{
            display: 'block',
            margin: gutter,
          }}
        >
          <Link to={budget.link}>{budget.link}</Link>
        </div>
      ) : null}

      <div style={{ margin: gutter }}>
        <Descriptions {...descriptionsStyle} size="small" column={2}>
          <Descriptions.Item label="Weight">
            {budget.weight.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="Discount rate">
            {budget.discountRate.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="Reserved for owner">
            {budget.o.toString()}%
          </Descriptions.Item>
          {budget.bAddress ? (
            <Descriptions.Item label="Reserved for beneficiary">
              {budget.b.toString()}%
            </Descriptions.Item>
          ) : null}
          {budget.bAddress ? (
            <Descriptions.Item label="Beneficiary address" span={2}>
              {budget.bAddress.toString()}%
            </Descriptions.Item>
          ) : null}
          {showMinted && surplus.gt(0) ? (
            <Descriptions.Item label="Reserves">
              {budget?.hasMintedReserves ? (
                'Minted'
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    whiteSpace: 'pre',
                  }}
                >
                  <span>Not minted</span>
                </div>
              )}
            </Descriptions.Item>
          ) : null}
          {showSustained ? (
            <Descriptions.Item label="Withdrawable">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  whiteSpace: 'pre',
                }}
              >
                <span style={{ flex: 1 }}>
                  {tappableAmount?.toString() ?? '--'} {wantTokenName}
                </span>
                {isOwner && tappableAmount?.gt(0) ? (
                  <div style={{ width: '100%', textAlign: 'end' }}>
                    <Space>
                      <Input
                        name="withdrawable"
                        placeholder="0"
                        suffix={wantTokenName}
                        value={tapAmount.toString()}
                        max={tappableAmount?.toString()}
                        onChange={e =>
                          setTapAmount(BigNumber.from(e.target.value))
                        }
                      />
                      <Button onClick={tap}>Withdraw</Button>
                    </Space>
                  </div>
                ) : null}
              </div>
            </Descriptions.Item>
          ) : null}
        </Descriptions>
      </div>
    </div>
  )
}
