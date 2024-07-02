import { Contract, ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { callContractRead, getContract } from './util'

/**
 * Ethers v6 returns a `Result` object when calling a contract function.
 *
 * This function recursively converts the `Result` object to a plain object.
 *
 * If the object is not a `Result`, it is returned as is.
 */
const ethersResultToObjectOrArray =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (result: any): any => {
    if (result instanceof ethers.Result) {
      // try to convert the result to an object, and get the entries.
      try {
        const obj = result.toObject()
        // const entries = Object.entries(obj)
        const retVal = Object.entries(obj).reduce((acc, [key, value]) => {
          if (value instanceof ethers.Result) {
            return { ...acc, [key]: ethersResultToObjectOrArray(value) }
          }
          return { ...acc, [key]: value }
        }, {})
        if (Object.keys(retVal).length === 0) {
          return []
        }
        return retVal
      } catch (e) {
        // Let it be free - an error will sometimes be thrown when trying to
        // convert a Result to an object which usually means it's an array so we
        // can return it as is and pray the ethers team got it right.
        return result
      }
    }
    return result
  }

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
  functionName,
  args,
  contracts,
  formatter,
  valueDidChange,
}: {
  contract: C | Contract | undefined
  functionName: string | undefined
  args: unknown[] | null | undefined // if null, don't call. Useful when you don't want the hook to run (for whatever reason).
  contracts?: Record<C, Contract> | undefined
  formatter?: (val?: any) => V | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  valueDidChange?: (oldVal?: V, newVal?: V) => boolean
}) {
  const [value, setValue] = useState<V | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const _formatter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (val: any) => {
      if (val instanceof ethers.Result) {
        const obj = ethersResultToObjectOrArray(val)
        return formatter ? formatter(obj) : obj
      }
      return formatter ? formatter(val) : val
    },
    [formatter],
  )
  const _valueDidChange = useCallback(
    (a?: any, b?: any) => (valueDidChange ? valueDidChange(a, b) : a !== b), // eslint-disable-line @typescript-eslint/no-explicit-any
    [valueDidChange],
  )

  const fetchValue = useCallback(async () => {
    const readContract = getContract(contract, contracts)
    try {
      if (!readContract || !functionName || args === null) return

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
          { contract: readContract?.target },
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
    setValue,
    value,
  ])

  // Fetch the value on load or when args change.
  useDeepCompareEffectNoCheck(() => {
    fetchValue()

    // args and contracts may initially be not defined, so we want to keep
    // calling until they are
  }, [args, contracts, functionName, contract])

  return { refetchValue: fetchValue, value, loading }
}
