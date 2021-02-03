import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import { daiAddress } from '../constants/dai-address'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Budget } from '../models/budget'
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
  const [tapAmount, setTapAmount] = useState<number>(0)

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

  const title = budget?.title && Web3.utils.hexToString(budget.title)

  const link = budget?.link

  const isOwner = budget?.owner === providerAddress

  const rewardToken = useContractReader({
    contract: contracts?.TicketStore,
    functionName: 'getTicketRewardToken',
    args: [budget?.owner],
  })

  const swappable: number | undefined = useContractReader({
    contract: contracts?.TicketStore,
    functionName: 'swappable',
    args: [budget?.owner, rewardToken, daiAddress],
    formatter: (num: BigNumber | undefined) => num?.toNumber(),
  })

  const tappableAmount: number | undefined = useContractReader<number>({
    contract: contracts?.BudgetStore,
    functionName: 'getTappableAmount',
    args: [budget?.id],
    formatter: (result: BigNumber) => result?.toNumber(),
  })

  function swap() {
    if (!transactor || !contracts || !budget || swappable === undefined) return

    const eth = new Web3(Web3.givenProvider).eth

    const _swappable = eth.abi.encodeParameter('uint256', swappable)
    // TODO handle conversion. Use 1:1 for now
    const _expectedAmount = _swappable

    console.log(
      '🧃 Calling Juicer.swap(owner, want, swappable, target, expectedAmount)',
      {
        owner: budget.owner,
        want: budget.want,
        swappable: _swappable,
        target: daiAddress,
        expectedAmount: _expectedAmount,
      },
    )

    transactor(
      contracts.Juicer.swap(
        budget.owner,
        budget.want,
        _swappable,
        daiAddress,
        _expectedAmount,
      ),
    )
  }

  function tap() {
    if (!transactor || !contracts?.Juicer || !budget) return

    const eth = new Web3(Web3.givenProvider).eth

    const id = eth.abi.encodeParameter('uint256', budget.id)
    const amount = eth.abi.encodeParameter('uint256', tapAmount)

    console.log('🧃 Calling Juicer.tapBudget(number, amount, address)', {
      id,
      amount,
      providerAddress,
    })

    transactor(contracts.Juicer?.tapBudget(id, amount, providerAddress))
  }

  return budget ? (
    <div>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
      <br />
      {KeyValRow('ID', budget.id.toString())}
      {KeyValRow('Target', budget.target.toString())}
      {showSustained ? KeyValRow('Sustained', budget.total.toString()) : null}
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
      {KeyValRow(
        'Reserves',
        budget.hasMintedReserves ? 'Minted' : 'Not minted',
      )}
      {KeyValRow(
        'Swappable',
        <span>
          {swappable}
          {swappable ? (
            <Button htmlType="submit" onClick={swap}>
              Swap
            </Button>
          ) : (
            undefined
          )}
        </span>,
      )}
      {tappableAmount !== undefined && isOwner
        ? KeyValRow(
            'Withdrawable',
            <span>
              {tappableAmount}
              {tappableAmount ? (
                <span>
                  <input
                    style={{
                      marginRight: 10,
                      marginLeft: 20,
                    }}
                    name="withdrawable"
                    placeholder="0"
                    onChange={e => setTapAmount(parseFloat(e.target.value))}
                  ></input>
                  <Button disabled={tapAmount > tappableAmount} onClick={tap}>
                    Withdraw
                  </Button>
                </span>
              ) : null}
            </span>,
          )
        : null}
    </div>
  ) : null
}
