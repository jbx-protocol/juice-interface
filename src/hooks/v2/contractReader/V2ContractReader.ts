import { Contract, EventFilter } from '@ethersproject/contracts'
import { V2UserContext } from 'contexts/v2/userContext'

import * as Sentry from '@sentry/browser'
import { V2ContractName, V2Contracts } from 'models/v2/contracts'
import { useCallback, useContext, useState } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

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
  const [value, setValue] = useState<V | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const { contracts } = useContext(V2UserContext)

  const _formatter = useCallback(
    (val: any) => (formatter ? formatter(val) : val), // eslint-disable-line @typescript-eslint/no-explicit-any
    [formatter],
  )
  const _callback = useCallback(
    (val: any) => (callback ? callback(val) : val), // eslint-disable-line @typescript-eslint/no-explicit-any
    [callback],
  )
  const _valueDidChange = useCallback(
    (a?: any, b?: any) => (valueDidChange ? valueDidChange(a, b) : a !== b), // eslint-disable-line @typescript-eslint/no-explicit-any
    [valueDidChange],
  )

  useDeepCompareEffectNoCheck(() => {
    async function getValue() {
      const readContract = contractToRead(contract, contracts)

      console.info(readContract, functionName, args, contract, contracts)

      if (!readContract || !functionName || args === null) return

      try {
        console.info('📚 [V2] Read >', functionName)

        setLoading(true)
        const result = await readContract[functionName](...(args ?? []))

        const newValue = _formatter(result)

        if (_valueDidChange(value, newValue)) {
          console.info(
            '📗 [V2] New >',
            functionName,
            { args },
            { newValue },
            { contract: readContract.address },
          )
          setValue(newValue)
          _callback(newValue)
        }
      } catch (err) {
        console.error(
          '📕 [V2] Read error >',
          functionName,
          { args },
          { err },
          { contract: readContract.address },
          contracts,
        )

        Sentry.captureException(err, {
          tags: {
            contract: typeof contract === 'string' ? contract : undefined,
            contract_function: functionName,
          },
        })

        setValue(_formatter(undefined))
        _callback(_formatter(undefined))
      } finally {
        setLoading(false)
      }
    }

    getValue()

    const listener = () => getValue()

    const subscriptions: {
      contract: Contract
      filter: EventFilter
    }[] = []

    if (updateOn?.length) {
      try {
        // Subscribe listener to updateOn events
        updateOn.forEach(u => {
          const _contract = contractToRead(u.contract, contracts)

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
  }, [
    contract,
    contracts,
    functionName,
    updateOn,
    args,
    _formatter,
    _callback,
    _valueDidChange,
  ])

  return { data: value, loading }
}

function contractToRead(
  contractConfig?: ContractConfig,
  contracts?: V2Contracts,
): Contract | undefined {
  if (!contractConfig) return

  if (typeof contractConfig === 'string') {
    return contracts ? contracts[contractConfig] : undefined
  } else return contractConfig
}
