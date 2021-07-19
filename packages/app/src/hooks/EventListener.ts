import { Listener } from '@ethersproject/providers'
import { readProvider } from 'constants/readProvider'
import { useContractLoader } from 'hooks/ContractLoader'
import { ContractName } from 'models/contract-name'
import { useEffect, useMemo, useState } from 'react'

export default function useEventListener<E>({
  contractName,
  eventName,
  startBlock,
  topics,
  includeHistory,
}: {
  contractName?: ContractName
  eventName?: string
  startBlock?: number
  topics?: (any | any[])[]
  includeHistory?: boolean
}) {
  const contracts = useContractLoader()
  const [events, setEvents] = useState<(E & { timestamp: number })[]>([])
  const [shouldGetHistory, setShouldGetHistory] = useState<boolean>(
    !!includeHistory,
  )
  const provider = readProvider

  const contract = contracts && contractName && contracts[contractName]

  const formatEvent = async (event: any) => {
    const timestamp = (await event.getBlock()).timestamp
    return {
      ...event.args,
      timestamp,
    }
  }

  const eventTopic =
    contracts &&
    contractName &&
    eventName &&
    contracts[contractName].interface.getEventTopic(eventName)

  const filter = useMemo(() => {
    return (
      contract &&
      eventName && JSON.stringify({
        address: contract.address,
        topics: [...(eventTopic ? [eventTopic] : []), ...(topics ?? [])],
      }
    ))
  }, [contract, eventName, eventTopic, topics])

  // Get all events history
  useEffect(() => {
    if (shouldGetHistory && filter) {
      contract?.queryFilter(JSON.parse(filter)).then(async initialEvents => {
        // Slice last (most recent) event, will be retrieved by listener
        const events = await Promise.all(
          initialEvents
            .slice(0, initialEvents.length - 1)
            .map(e => formatEvent(e))
            .reverse(),
        )

        setEvents(events)
        setShouldGetHistory(false)
      })
    }
  }, [shouldGetHistory, filter, contract])

  // Setup listener for future events
  useEffect(() => {
    if (provider && startBlock !== undefined) {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock)
    }

    if (contract && filter) {
      try {
        const filterParsed = JSON.parse(filter);

        const listener: Listener = async (..._events: any[]) => {
          const event = await formatEvent(_events[_events.length - 1])

          setEvents((events: any[]) => [event, ...events])
        }

        contract.on(filterParsed, listener)

        return () => {
          contract.off(filterParsed, listener)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [provider, startBlock, contract, eventName, filter])

  return events
}
