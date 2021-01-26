import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'

export default function Gimme({
  transactor,
  contracts,
  address,
}: {
  transactor?: Transactor
  contracts?: Contracts
  address?: string
}) {
  const [gimmeAmount, setGimmeAmount] = useState<number>(0)
  const [allowanceAmount, setAllowanceAmount] = useState<number>(0)

  const allowance: BigNumber | undefined = useContractReader({
    contract: contracts?.Token,
    functionName: 'allowance',
    args: [address, contracts?.Controller?.address],
  })

  const balance: BigNumber | undefined = useContractReader({
    contract: contracts?.Token,
    functionName: 'balanceOf',
    args: [address],
  })

  function gimme() {
    if (!transactor || !contracts?.Token) return

    const eth = new Web3(Web3.givenProvider).eth

    transactor(contracts.Token.gimme(eth.abi.encodeParameter('uint256', gimmeAmount)))
  }

  function approve() {
    if (!transactor || !contracts?.Controller || !contracts?.Token) return

    const eth = new Web3(Web3.givenProvider).eth

    transactor(
      contracts.Token.approve(contracts.Controller?.address, eth.abi.encodeParameter('uint256', allowanceAmount)),
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 30,
      }}
    >
      <div>
        <h4>Current allowance: {allowance?.toNumber() ?? 0}</h4>
        <input placeholder="0" onChange={e => setAllowanceAmount(parseFloat(e.target.value))} />
        <button onClick={approve}>Update</button>
      </div>
      <div>
        <h2>Current token balance {balance?.toNumber()}</h2>
        <h4>Get Token</h4>
        <input placeholder="0" onChange={e => setGimmeAmount(parseFloat(e.target.value))} />
        <button onClick={gimme}>Gimme</button>
      </div>
    </div>
  )
}
