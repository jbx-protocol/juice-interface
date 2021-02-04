import { BigNumber } from '@ethersproject/bignumber'
import React, { useState } from 'react'
import Web3 from 'web3'

import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { padding } from '../constants/styles/padding'
import { Button } from 'antd'

export default function Gimme({
  transactor,
  contracts,
  providerAddress,
}: {
  transactor?: Transactor
  contracts?: Contracts
  providerAddress?: string
}) {
  const [gimmeAmount, setGimmeAmount] = useState<number>(10000)
  const [allowanceAmount, setAllowanceAmount] = useState<number>(10000)

  const allowance: BigNumber | undefined = useContractReader({
    contract: contracts?.Token,
    functionName: 'allowance',
    args: [providerAddress, contracts?.Juicer?.address],
  })

  const balance: BigNumber | undefined = useContractReader({
    contract: contracts?.Token,
    functionName: 'balanceOf',
    args: [providerAddress],
  })

  function gimme() {
    if (!transactor || !contracts?.Token) return

    const eth = new Web3(Web3.givenProvider).eth

    transactor(
      contracts.Token.gimme(eth.abi.encodeParameter('uint256', gimmeAmount)),
    )
  }

  function approve() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const eth = new Web3(Web3.givenProvider).eth

    transactor(
      contracts.Token.approve(
        contracts.Juicer?.address,
        eth.abi.encodeParameter('uint256', allowanceAmount),
      ),
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 30,
        padding: padding.app,
      }}
    >
      <div>
        <h4>Current allowance: {allowance?.toNumber() ?? 0}</h4>
        <input
          defaultValue={allowanceAmount}
          placeholder="0"
          onChange={e => setAllowanceAmount(parseFloat(e.target.value))}
        />
        <Button onClick={approve}>Update</Button>
      </div>
      <div>
        <h2>Current token balance {balance?.toNumber()}</h2>
        <h4>Get Token</h4>
        <input
          defaultValue={gimmeAmount}
          placeholder="0"
          onChange={e => setGimmeAmount(parseFloat(e.target.value))}
        />
        <Button onClick={gimme}>Gimme</Button>
      </div>
    </div>
  )
}
