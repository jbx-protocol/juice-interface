import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space } from 'antd'
import { useState } from 'react'

import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { erc20Contract } from '../helpers/erc20Contract'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import KeyValRow from './KeyValRow'

export default function BudgetDetail({
  budget,
  contracts,
  transactor,
  showSustained,
  showTimeLeft,
  providerAddress,
}: {
  budget?: Budget
  contracts?: Contracts
  transactor?: Transactor
  showSustained?: boolean
  showTimeLeft?: boolean
  providerAddress?: string
}) {
  const [tapAmount, setTapAmount] = useState<BigNumber>(BigNumber.from(0))

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(budget?.want),
    functionName: 'name',
  })

  const tappableAmount = useContractReader<BigNumber>({
    contract: contracts?.BudgetStore,
    functionName: 'getTappableAmount',
    args: [budget?.id],
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

  const link = budget?.link

  const isOwner = budget?.owner === providerAddress

  function tap() {
    if (!transactor || !contracts?.Juicer || !budget) return

    const id = budget.id.toHexString()
    const amount = tapAmount.toHexString()

    console.log('🧃 Calling Juicer.tapBudget(number, amount, address)', {
      id,
      amount,
      providerAddress,
    })

    transactor(contracts.Juicer?.tapBudget(id, amount, providerAddress))
  }

  if (!budget) return null

  return (
    <div>
      <a href={link} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
      {KeyValRow('ID', budget.id.toString())}
      {KeyValRow('Target', budget.target.toString() + ' ' + wantTokenName)}
      {showSustained
        ? KeyValRow('Sustained', budget.total.toString() + ' ' + wantTokenName)
        : null}
      {KeyValRow(
        'Start',
        new Date(budget.start.toNumber() * 1000).toISOString(),
      )}
      {KeyValRow(
        'Duration',
        expandedTimeString(budget && budget.duration.toNumber() * 1000),
      )}
      {showTimeLeft
        ? KeyValRow(
            'Time left',
            (secondsLeft && expandedTimeString(secondsLeft * 1000)) || 'Ended',
          )
        : null}
      {KeyValRow('Reserved for owner', <span>{budget.o?.toString()}%</span>)}
      {budget?.bAddress
        ? KeyValRow(
            'Reserved for beneficiary',
            <span>{budget.b?.toString()}%</span>,
          )
        : null}
      {budget?.bAddress
        ? KeyValRow(
            'Beneficiary address',
            <span
              style={{
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              {budget.bAddress}
            </span>,
          )
        : null}
      {KeyValRow('Bias', <span>{budget.bias?.toString()}%</span>)}
      {KeyValRow('Weight', <span>{budget.weight?.toString()}</span>)}
      {isOwner
        ? KeyValRow(
            'Withdrawable',
            <Space align="center">
              <span style={{ whiteSpace: 'pre' }}>
                {tappableAmount?.toString()} {wantTokenName}
              </span>
              <Input
                name="withdrawable"
                placeholder="0"
                suffix={wantTokenName}
                value={tapAmount.toString()}
                max={tappableAmount?.toString()}
                onChange={e => setTapAmount(BigNumber.from(e.target.value))}
                addonAfter={
                  <Button type="text" onClick={tap}>
                    Withdraw
                  </Button>
                }
              />
            </Space>,
          )
        : null}
    </div>
  )
}
