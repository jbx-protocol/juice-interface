import { Contract } from '@ethersproject/contracts'
import { useState } from 'react'

import { usePoller } from './Poller'

export default function useContractReader<V>({
  contract,
  functionName,
  args,
  pollTime,
  updateEvent,
  formatter,
  callback,
  shouldUpdate,
}: {
  contract?: Contract
  functionName: string
  args?: unknown[]
  pollTime?: number
  updateEvent?: string
  formatter?: (val?: any) => V | undefined
  callback?: (val?: V) => void
  shouldUpdate?: (a?: V, b?: V) => boolean
}) {
  const adjustPollTime = pollTime ?? 3000

  const [value, setValue] = useState<V>()

  usePoller(
    async () => {
      if (!contract) return

      try {
        const newValue = await contract[functionName](...(args ?? []))

        const result = formatter ? formatter(newValue) : (newValue as V)

        const _shouldUpdate = shouldUpdate ?? ((a?: V, b?: V) => a != b)

        if (_shouldUpdate(result, value)) {
          setValue(result)

          if (callback) callback(result)
        }
      } catch (e) {
        console.log('Read contract >>>', functionName, args, e.error?.message)
        setValue(formatter ? formatter(undefined) : undefined)
        if (callback) callback(undefined)
      }
    },
    [contract?.address, ...(args ? (args as []) : [])],
    adjustPollTime,
  )

  // useEffect(() => {
  //   getValue()

  //   if (updateEvent && contract) {
  //     contract.on(updateEvent, blockNumber => getValue())
  //   }
  // }, [
  //   contract?.address,
  //   functionName,
  //   updateEvent,
  //   ...(args ? (args as []) : []),
  // ])

  // async function getValue() {
  //   if (!contract) return

  //   try {
  //     const newValue = await contract[functionName](...(args ?? []))

  //     const result = formatter ? formatter(newValue) : (newValue as V)

  //     const _shouldUpdate = shouldUpdate ?? ((a?: V, b?: V) => a != b)

  //     if (_shouldUpdate(result, value)) {
  //       setValue(result)

  //       if (callback) callback(result)
  //     }
  //   } catch (e) {
  //     console.log('Read contract >>>', functionName, args, e.error?.message)
  //     setValue(formatter ? formatter(undefined) : undefined)
  //     if (callback) callback(undefined)
  //   }
  // }

  return value
}
