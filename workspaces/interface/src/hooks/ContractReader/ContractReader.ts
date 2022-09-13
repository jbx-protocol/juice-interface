import { Contract } from '@ethersproject/contracts'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { useContractReadValue } from './ContractReadValue'
import { ContractConfig, ContractUpdateOn } from './types'
import { convertUpdateOnArrayToSubscriptions } from './util'

export interface ContractReaderProps<ContractName extends string, V> {
  contract: ContractConfig<ContractName> | undefined
  contracts: Record<ContractName, Contract> | undefined
  functionName: string | undefined
  args?: unknown[] | null
  updateOn?: ContractUpdateOn<ContractName>[]
  formatter?: (val?: any) => V | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  callback?: (val?: V) => void
  valueDidChange?: (oldVal?: V, newVal?: V) => boolean
}

export function useContractReader<ContractName extends string, V>({
  contract,
  contracts,
  functionName,
  args,
  updateOn,
  formatter,
  callback,
  valueDidChange,
}: ContractReaderProps<ContractName, V>) {
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
    callback?.(value)
  }, [value])

  useDeepCompareEffectNoCheck(() => {
    const listener = () => refetchValue()

    try {
      const subscriptions = convertUpdateOnArrayToSubscriptions({
        updateOn,
        contracts,
        listener,
      })
      return () =>
        subscriptions.forEach(s => s.contract.off(s.filter, listener))
    } catch (error) {
      console.error('Read contract >', {
        functionName,
        error,
      })
    }
  }, [contract, contracts, functionName, updateOn, args])

  return { data: value, loading }
}
