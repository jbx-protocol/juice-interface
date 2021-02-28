import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import React, { useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { padding } from '../constants/styles/padding'
import useContractReader from '../hooks/ContractReader'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'

export default function Gimme({
  transactor,
  contracts,
  userAddress,
}: {
  transactor?: Transactor
  contracts?: Contracts
  userAddress?: string
}) {
  const [gimmeAmount, setGimmeAmount] = useState<number>(10000)
  const [allowanceAmount, setAllowanceAmount] = useState<number>(10000)

  const wantTokenAddress = useContractReader<string>({
    contract: ContractName.Juicer,
    functionName: 'stablecoin',
  })

  const wantTokenContract = erc20Contract(wantTokenAddress)

  const balance = useContractReader<BigNumber>({
    contract: wantTokenContract,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const allowance = useContractReader<BigNumber>({
    contract: wantTokenContract,
    functionName: 'allowance',
    args: [userAddress, contracts?.Juicer?.address],
  })

  function gimme() {
    if (!transactor || !contracts?.Token) return

    transactor(contracts.Token, 'gimme', [
      BigNumber.from(gimmeAmount).toHexString(),
    ])
  }

  function approve() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    transactor(contracts.Token, 'approve', [
      contracts.Juicer?.address,
      BigNumber.from(allowanceAmount).toHexString(),
    ])
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
