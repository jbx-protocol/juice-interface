import { Contract, EventFilter } from '@ethersproject/contracts'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContractReadValue } from 'hooks/ContractReadValue'
import { V2ContractName } from 'models/v2/contracts'
import { useCallback, useContext } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { getContract } from 'utils/getContract'

type ContractUpdateOn = {
  contract?: ContractConfig
  eventName?: string
  topics?: EventFilter['topics']
}[]

type ContractConfig = V2ContractName | Contract | undefined

export type ContractReadResult<V> = { data: V | undefined; loading: boolean }

export default function useV2ContractReader<V>({
  contract,
  functionName,
  args,
  updateOn,
  formatter,
  callback,
  valueDidChange,
}: {
  contract?: ContractConfig
  functionName?: string
  args?: unknown[] | null
  updateOn?: ContractUpdateOn
  formatter?: (val?: any) => V | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  callback?: (val?: V) => void
  valueDidChange?: (oldVal?: V, newVal?: V) => boolean
}): ContractReadResult<V> {
  const { contracts } = useContext(V2UserContext)

  const _callback = useCallback(
    (val: any) => (callback ? callback(val) : val), // eslint-disable-line @typescript-eslint/no-explicit-any
    [callback],
  )

  const { value, loading, refetchValue } = useContractReadValue({
    contract,
    contracts,
    functionName,
    args,
    formatter,
    valueDidChange,
  })

  // Call the callback on contract read value changed
  useDeepCompareEffectNoCheck(() => {
    _callback(value)
  }, [value])

  useDeepCompareEffectNoCheck(() => {
    const listener = () => refetchValue()

    const subscriptions: {
      contract: Contract
      filter: EventFilter
    }[] = []

    if (updateOn?.length) {
      try {
        // Subscribe listener to updateOn events
        updateOn.forEach(u => {
          const _contract = getContract(u.contract, contracts)

          if (!u.eventName || !_contract) return

          const filter = _contract.filters[u.eventName](...(u.topics ?? []))
          _contract?.on(filter, listener)
          subscriptions.push({
            contract: _contract,
            filter,
          })
        })
      } catch (error) {
        console.error('[V2] Read contract >', {
          functionName,
          error,
        })
      }
    }

    return () => subscriptions.forEach(s => s.contract.off(s.filter, listener))
  }, [contract, contracts, functionName, updateOn, args, _callback])

  return { data: value, loading }
}
