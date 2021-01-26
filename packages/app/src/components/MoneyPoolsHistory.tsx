import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { MoneyPool } from '../models/money-pool'
import { Transactor } from '../models/transactor'
import MoneyPoolDetail from './MoneyPoolDetail'

export default function MoneyPoolsHistory({
  contracts,
  transactor,
  address,
}: {
  contracts?: Contracts
  transactor?: Transactor
  address?: string
}) {
  const [moneyPools, setMoneyPools] = useState<MoneyPool[]>([])
  const [poolNumbers, setPoolNumbers] = useState<BigNumber[]>([])

  const { number }: { number?: string } = useParams()

  if (number !== undefined && !poolNumbers.length) setPoolNumbers([BigNumber.from(number)])

  const allPoolsLoaded = moneyPools.length >= poolNumbers.length
  const poolNumber = allPoolsLoaded ? undefined : poolNumbers[poolNumbers.length - 1]
  const pollTime = allPoolsLoaded ? undefined : 100

  useContractReader<MoneyPool>({
    contract: contracts?.MpStore,
    functionName: 'getMp',
    args: [poolNumber],
    pollTime,
    callback: mp => {
      if (!mp || !poolNumber || poolNumbers.includes(mp.previous)) return
      setMoneyPools([...moneyPools, mp])
      setPoolNumbers([...poolNumbers, ...(mp.previous.toNumber() > 0 ? [mp.previous] : [])])
    },
  })

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 40,
      }}
    >
      {moneyPools.map((mp, index) => (
        <div key={index}>
          <MoneyPoolDetail
            address={address}
            mp={mp}
            showSustained={true}
            transactor={transactor}
            contracts={contracts}
          />
        </div>
      ))}

      {allPoolsLoaded ? null : <div>Loading...</div>}
    </div>
  )
}
