import { Contract, EventFilter } from 'ethers'
import { ContractUpdateOn } from '../types'
import { getContract } from './getContract'

export function convertUpdateOnArrayToSubscriptions<C extends string>({
  updateOn,
  contracts,
}: // listener,
{
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
    })
  }
  return subscriptions
}
