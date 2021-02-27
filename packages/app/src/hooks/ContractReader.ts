import { Contract, EventFilter } from '@ethersproject/contracts'
import { useEffect, useState } from 'react'

export type ContractUpdateOn = {
  contract?: Contract
  eventName?: string
  topics?: EventFilter['topics']
}[]

export default function useContractReader<V>({
  contract,
  functionName,
  args,
  formatter,
  callback,
  updateOn,
  valueDidChange,
}: {
  contract?: Contract
  functionName: string
  args?: unknown[]
  formatter?: (val?: any) => V | undefined
  callback?: (val?: V) => void
  updateOn?: ContractUpdateOn
  valueDidChange?: (a?: V, b?: V) => boolean
}) {
  const [value, setValue] = useState<V>()

  const listener = (x: any) => getValue()

  useEffect(() => {
    getValue()

    let subscriptions: { contract: Contract; filter: EventFilter }[] = []

    try {
      if (updateOn) {
        // Subscribe listener to updateOn events

        updateOn.forEach(u => {
          if (!u.eventName || !u.contract) return

          const filter = u.contract.filters[u.eventName](...(u.topics ?? []))
          u.contract?.on(filter, listener)
          subscriptions.push({ contract: u.contract, filter })
        })
      } else {
        // Subscribe listener to all events

        if (!contract) return

        const allEvents: EventFilter = { topics: [] }
        contract.on(allEvents, listener)
        subscriptions = [{ contract, filter: allEvents }]
      }
    } catch (error) {
      console.log('Read contract ', { functionName, error })
    }

    return () => subscriptions.forEach(s => s.contract.off(s.filter, listener))
  }, [contract?.address, functionName, ...(args ? (args as []) : [])])

  async function getValue() {
    if (!contract) return

    try {
      const newValue = await contract[functionName](...(args ?? []))

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
