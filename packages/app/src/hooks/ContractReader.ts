import { Contract, EventFilter } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { localProvider } from '../constants/local-provider'
import { Contracts } from '../models/contracts'
import { useContractLoader } from './ContractLoader'

export type ContractUpdateOn = {
  contract?: ContractConfig
  eventName?: string
  topics?: EventFilter['topics']
}[]

export type ContractConfig = ContractName | Contract | undefined

export default function useContractReader<V>({
  contract,
  functionName,
  args,
  formatter,
  callback,
  updateOn,
  valueDidChange,
}: {
  contract: ContractConfig
  functionName: string
  args?: unknown[]
  formatter?: (val?: any) => V | undefined
  callback?: (val?: V) => void
  updateOn?: ContractUpdateOn
  valueDidChange?: (a?: V, b?: V) => boolean
}) {
  const [value, setValue] = useState<V>()

  const listener = (x: any) => getValue()

  const contracts = useContractLoader(localProvider, true)

  useEffect(() => {
    getValue()

    if (!updateOn) return

    let subscriptions: { contract: Contract; filter: EventFilter }[] = []

    try {
      // Subscribe listener to updateOn events
      updateOn.forEach(u => {
        const _contract = contractToRead(u.contract, contracts)

        if (!u.eventName || !_contract) return

        const filter = _contract.filters[u.eventName](...(u.topics ?? []))
        _contract?.on(filter, listener)
        subscriptions.push({ contract: _contract, filter })
      })
    } catch (error) {
      console.log('Read contract >', { functionName, error })
    }

    return () => subscriptions.forEach(s => s.contract.off(s.filter, listener))
  }, [contract, contracts, functionName, ...(args ? (args as []) : [])])

  async function getValue() {
    const readContract = contractToRead(contract, contracts)

    if (!readContract) return

    try {
      const newValue = await readContract[functionName](...(args ?? []))

      const result = formatter ? formatter(newValue) : (newValue as V)

      const _valueDidChange = valueDidChange ?? ((a?: V, b?: V) => a !== b)

      if (_valueDidChange(result, value)) {
        setValue(result)

        if (callback) callback(result)
      }
    } catch (err) {
      console.log('Read contract >', functionName, { args }, { err })
      setValue(formatter ? formatter(undefined) : undefined)
      if (callback) callback(undefined)
    }
  }

  return value
}

function contractToRead(
  contractConfig?: ContractConfig,
  contracts?: Contracts,
): Contract | undefined {
  if (!contractConfig) return

  if (typeof contractConfig === 'string') {
    return contracts ? contracts[contractConfig] : undefined
  } else return contractConfig
}
