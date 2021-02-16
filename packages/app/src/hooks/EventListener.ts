import { JsonRpcProvider, Listener } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

import { ContractName } from '../constants/contract-name'
import { Contracts } from '../models/contracts'

export default function useEventListener({
  contracts,
  contractName,
  eventName,
  provider,
  startBlock,
  topics,
  getInitial,
}: {
  contracts?: Contracts
  contractName?: ContractName
  eventName?: string
  provider?: JsonRpcProvider
  startBlock?: number
  topics?: (any | any[])[]
  getInitial?: boolean
}) {
  const [events, setEvents] = useState<any[]>([])
  const [needsInitialGet, setNeedsInitialGet] = useState<boolean>(!!getInitial)

  const contract = contracts && contractName && contracts[contractName]

  function formatEvent(event: any) {
    return {
      ...event.args,
      ...event.blockNumber,
    }
  }

  const eventTopic =
    contracts &&
    contractName &&
    eventName &&
    contracts[contractName].interface.getEventTopic(eventName)

  const filter = contract &&
    eventName && {
      address: contract.address,
      topics: [...(eventTopic ? [eventTopic] : []), ...(topics ?? [])],
    }

  if (needsInitialGet && filter) {
    contract?.queryFilter(filter).then(initialEvents => {
      // Slice last (most recent) event, will be retrieved by listener
      setEvents(
        initialEvents
          .slice(0, initialEvents.length - 1)
          .map(e => formatEvent(e)),
      )
      setNeedsInitialGet(false)
    })
  }

  useEffect(() => {
    if (provider && startBlock !== undefined) {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock)
    }

    if (contract && eventTopic) {
      try {
        const listener: Listener = (..._events: any[]) => {
          const event = _events[_events.length - 1]

          setEvents((events: any[]) => [formatEvent(event), ...events])
        }

        contract.on(eventTopic, listener)

        return () => {
          contract.off(eventTopic, listener)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [provider, startBlock, contract, eventName])

  return events
}
