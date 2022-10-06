import { ballotStrategies } from 'constants/v2v3/ballotStrategies'
import { NetworkName } from 'models/network-name'
import { ArrayElement } from 'utils/arrayElement'

export const useAvailableReconfigurationStrategies = (network: NetworkName) => {
  const strategies = ballotStrategies(network).map(s =>
    s.id === 'threeDay'
      ? { ...s, isDefault: true }
      : { ...s, isDefault: false },
  )
  const threeDay = strategies.find(s => s.id === 'threeDay')
  const sevenDay = strategies.find(s => s.id === 'sevenDay')
  const none = strategies.find(s => s.id === 'none')

  if (!threeDay || !sevenDay || !none) {
    console.error(
      'Unexpected error occurred - missing field in reconfiguration strategies',
      { threeDay, sevenDay, none },
    )
    throw new Error(
      'Unexpected error occurred - missing field in reconfiguration strategies',
    )
  }

  return [threeDay, sevenDay, none]
}

export type AvailableReconfigurationStrategy = ArrayElement<
  ReturnType<typeof useAvailableReconfigurationStrategies>
>
