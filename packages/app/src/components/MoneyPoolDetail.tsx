import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'
import Web3 from 'web3'

import { daiAddress } from '../constants/dai-address'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Budget } from '../models/money-pool'
import { Transactor } from '../models/transactor'
import KeyValRow from './KeyValRow'

export default function BudgetDetail({
  mp,
  contracts,
  transactor,
  showSustained,
  showTimeLeft,
  address,
}: {
  mp?: Budget
  contracts?: Contracts
  transactor?: Transactor
  showSustained?: boolean
  showTimeLeft?: boolean
  address?: string
}) {
  const [tapAmount, setTapAmount] = useState<number>(0)

  const secondsLeft = mp && Math.floor(mp.start.toNumber() + mp.duration.toNumber() - new Date().valueOf() / 1000)

  function expandedTimeString(millis: number) {
    if (!millis || millis <= 0) return 0

    const days = millis && millis / 1000 / SECONDS_IN_DAY
    const hours = days && (days % 1) * 24
    const minutes = hours && (hours % 1) * 60
    const seconds = minutes && (minutes % 1) * 60

    return `${days && days >= 1 ? Math.floor(days) + 'd ' : ''}${hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''}
        ${minutes && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
        ${seconds && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`
  }

  const title = mp?.title && Web3.utils.hexToString(mp.title)

  const link = mp?.link && Web3.utils.hexToString(mp.link)

  const isOwner = mp?.owner === address

  const rewardToken = useContractReader({
    contract: contracts?.TicketStore,
    functionName: 'getTicketRewardToken',
    args: [mp?.owner],
  })

  const swappable: number | undefined = useContractReader({
    contract: contracts?.TicketStore,
    functionName: 'swappable',
    args: [mp?.owner, rewardToken, daiAddress],
    formatter: (num: BigNumber | undefined) => num?.toNumber(),
  })

  const tappableAmount: number | undefined = useContractReader<number>({
    contract: contracts?.MpStore,
    functionName: 'getTappableAmount',
    args: [mp?.id],
    formatter: (result: BigNumber) => result?.toNumber(),
  })

  function swap() {
    if (!transactor || !contracts || !mp || swappable === undefined) return

    const eth = new Web3(Web3.givenProvider).eth

    const _swappable = eth.abi.encodeParameter('uint256', swappable)
    // TODO handle conversion. Use 1:1 for now
    const _expectedAmount = _swappable

    console.log('🧃 Calling Controller.swap(owner, want, swappable, target, expectedAmount)', {
      owner: mp.owner,
      want: mp.want,
      swappable: _swappable,
      target: daiAddress,
      expectedAmount: _expectedAmount,
    })

    transactor(contracts.Controller.swap(mp.owner, mp.want, _swappable, daiAddress, _expectedAmount))
  }

  function tap() {
    if (!transactor || !contracts?.Controller || !mp) return

    const eth = new Web3(Web3.givenProvider).eth

    const id = eth.abi.encodeParameter('uint256', mp.id)
    const amount = eth.abi.encodeParameter('uint256', tapAmount)

    console.log('🧃 Calling Controller.tapMp(number, amount, address)', { id, amount, address })

    transactor(contracts.Controller?.tapMp(id, amount, address))
  }

  return mp ? (
    <div>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
      <br />
      {KeyValRow('ID', mp.id.toString())}
      {KeyValRow('Target', mp.target.toString())}
      {showSustained ? KeyValRow('Sustained', mp.total.toString()) : null}
      {KeyValRow('Start', new Date(mp.start.toNumber() * 1000).toISOString())}
      {KeyValRow('Duration', expandedTimeString(mp && mp.duration.toNumber() * 1000))}
      {showTimeLeft ? KeyValRow('Time left', (secondsLeft && expandedTimeString(secondsLeft * 1000)) || 'Ended') : null}
      {KeyValRow('Reserved for owner', <span>{mp.o?.toString()}%</span>)}
      {mp?.bAddress ? KeyValRow('Reserved for beneficiary', <span>{mp.b?.toString()}%</span>) : null}
      {mp?.bAddress
        ? KeyValRow(
            'Beneficiary address',
            <span
              style={{
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              {mp.bAddress}
            </span>,
          )
        : null}
      {KeyValRow('Bias', <span>{mp.bias?.toString()}%</span>)}
      {KeyValRow('Weight', <span>{mp.weight?.toString()}</span>)}
      {KeyValRow('Reserves', mp.hasMintedReserves ? 'Minted' : 'Not minted')}
      {KeyValRow(
        'Swappable',
        <span>
          {swappable}
          {swappable ? (
            <button type="submit" onClick={swap}>
              Swap
            </button>
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
                  <button disabled={tapAmount > tappableAmount} onClick={tap}>
                    Withdraw
                  </button>
                </span>
              ) : null}
            </span>,
          )
        : null}
    </div>
  ) : null
}
