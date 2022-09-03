import { Contract } from '@ethersproject/contracts'
import { useCallback, useState } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { callContractRead, getContract } from './util'

/**
 * Reads a `contract` value from `contracts`, using the `functionName`.
 *
 * Upon load, the contract is initially read. From there, `refetchValue` must be
 * called.
 *
 * @returns refetchValue - Call to refetch and hydrate the `value`.
 * @returns value - Value returned from the contract.
 * @returns loading - Whether the contract is currently being read.
 */
export function useContractReadValue<C extends string, V>({
  contract,
  contracts,
  functionName,
  args,
  formatter,
  valueDidChange,
}: {
  contract: C | Contract | undefined
  contracts: Record<C, Contract> | undefined
  functionName: string | undefined
  args: unknown[] | null | undefined
  formatter?: (val?: any) => V | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  valueDidChange?: (oldVal?: V, newVal?: V) => boolean
}) {
  const [value, setValue] = useState<V | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const _formatter = useCallback(
    (val: any) => (formatter ? formatter(val) : val), // eslint-disable-line @typescript-eslint/no-explicit-any
    [formatter],
  )
  const _valueDidChange = useCallback(
    (a?: any, b?: any) => (valueDidChange ? valueDidChange(a, b) : a !== b), // eslint-disable-line @typescript-eslint/no-explicit-any
    [valueDidChange],
  )

  const fetchValue = useCallback(async () => {
    const readContract = getContract(contract, contracts)
    try {
      setLoading(true)
      const result = await callContractRead({
        readContract,
        contracts,
        functionName,
        args,
      })
      const newValue = _formatter(result)

      if (_valueDidChange(value, newValue)) {
        console.info(
          `📗 New >`,
          functionName,
          { args },
          { newValue },
          { contract: readContract?.address },
        )
        setValue(newValue)
      }
    } catch (err) {
      console.error('Read contract >', {
        functionName,
        error: err,
      })
      setValue(_formatter(undefined))
    } finally {
      setLoading(false)
    }
  }, [
    _formatter,
    _valueDidChange,
    args,
    contract,
    contracts,
    functionName,
    value,
  ])

  // Fetch the value on load or when args change.
  useDeepCompareEffectNoCheck(() => {
    fetchValue()

    // args and contracts may initially be not defined, so we want to keep
    // calling until they are
  }, [args, contracts])

  return { refetchValue: fetchValue, value, loading }
}
