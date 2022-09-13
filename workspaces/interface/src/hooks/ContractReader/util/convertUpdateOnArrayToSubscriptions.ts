import { Contract, EventFilter } from '@ethersproject/contracts'
import { ContractUpdateOn } from '../types'
import { getContract } from './getContract'

export function convertUpdateOnArrayToSubscriptions<C extends string>({
  updateOn,
  contracts,
  listener,
}: {
  updateOn: ContractUpdateOn<C>[] | undefined
  contracts: Record<C, Contract> | undefined
  listener: VoidFunction
}) {
  const subscriptions: {
    contract: Contract
    filter: EventFilter
  }[] = []

  if (updateOn?.length) {
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
  }
  return subscriptions
}
