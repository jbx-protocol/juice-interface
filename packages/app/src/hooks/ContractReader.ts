import { Contract } from '@ethersproject/contracts'
import { useState } from 'react'

import { usePoller } from './Poller'

export default function useContractReader<V>({
  contract,
  functionName,
  args,
  pollTime,
  formatter,
  callback,
  shouldUpdate,
}: {
  contract?: Contract
  functionName: string
  args?: unknown[]
  pollTime?: number
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
    adjustPollTime,
    [contract, ...(args ? (args as []) : [])],
  )

  return value
}
