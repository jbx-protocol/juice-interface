import { Contract, EventFilter } from '@ethersproject/contracts'
import { ContractName } from 'constants/contract-name'
import { localProvider } from 'constants/local-provider'
import { Contracts } from 'models/contracts'
import { useCallback, useEffect, useState } from 'react'

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
  contract?: ContractConfig
  functionName?: string
  args?: unknown[]
  formatter?: (val?: any) => V | undefined
  callback?: (val?: V) => void
  updateOn?: ContractUpdateOn
  valueDidChange?: (a?: V, b?: V) => boolean
}) {
  const [value, setValue] = useState<V | undefined>()

  const contracts = useContractLoader(localProvider, true)

  // Allow properly storing array members in dependencies array
  const updateOnRef: string | undefined = updateOn?.reduce((acc, curr) => {
    if (!curr) return acc
    return acc + typeof curr.contract === 'string'
      ? JSON.stringify(curr)
      : JSON.stringify(curr.eventName) + JSON.stringify(curr.topics)
  }, '')
  const argsRef: string | undefined = JSON.stringify(args)

  const _valueDidChange = useCallback(
    valueDidChange ?? ((a?: V, b?: V) => a !== b),
    [valueDidChange],
  )

  useEffect(() => {
    async function getValue() {
      const readContract = contractToRead(contract, contracts)

      if (!readContract || !functionName) return

      try {
        const result = await readContract[functionName](...(args ?? []))

        const newValue = formatter ? formatter(result) : result

        if (_valueDidChange(newValue, value)) {
          setValue(newValue)

          if (callback) callback(newValue)
        }
      } catch (err) {
        console.log('Read contract >', functionName, { args }, { err })
        setValue(formatter ? formatter(undefined) : undefined)
        if (callback) callback(undefined)
      }
    }

    getValue()

    const listener = (x: any) => getValue()

    let subscriptions: { contract: Contract; filter: EventFilter }[] = []

    if (updateOn) {
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
    }

    return () => subscriptions.forEach(s => s.contract.off(s.filter, listener))
  }, [
    contract,
    contracts,
    functionName,
    updateOnRef,
    _valueDidChange,
    value,
    argsRef,
    callback,
    formatter,
  ])

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
