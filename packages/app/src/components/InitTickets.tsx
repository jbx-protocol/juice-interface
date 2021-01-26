import React, { useState } from 'react'
import Web3 from 'web3'

import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'

export default function InitTickets({ transactor, contracts }: { transactor?: Transactor; contracts?: Contracts }) {
  const [name, setName] = useState<string>()
  const [symbol, setSymbol] = useState<string>()

  function init() {
    if (!transactor || !contracts) return

    const _name = name && Web3.utils.utf8ToHex(name)
    const _symbol = symbol && Web3.utils.utf8ToHex(symbol)
    const _rewardToken = contracts.Token.address

    console.log('🧃 Calling Controller.issueTickets(name, symbol, rewardToken)', { _name, _symbol, _rewardToken })

    transactor(contracts.Controller.issueTickets(_name, _symbol, _rewardToken), () => (window.location.href = '/'))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 30,
        width: 200,
      }}
    >
      <div>
        <h4>Name</h4>
        <input placeholder="Ticket" onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <h4>Symbol</h4>
        <input placeholder="TIX" onChange={e => setSymbol(e.target.value)} />
      </div>
      <button onClick={init}>Initialize tickets</button>
    </div>
  )
}
