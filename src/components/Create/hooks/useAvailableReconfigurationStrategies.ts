import { ballotStrategiesFn } from 'constants/v2v3/ballotStrategies'
import { NetworkName } from 'models/networkName'
import { ArrayElement } from 'utils/arrayElement'

export const useAvailableReconfigurationStrategies = (network: NetworkName) => {
  const strategies = ballotStrategiesFn({ network }).map(s =>
    s.id === 'threeDay'
      ? { ...s, isDefault: true }
      : { ...s, isDefault: false },
  )
  const threeDay = strategies.find(s => s.id === 'threeDay')
  const oneDay = strategies.find(s => s.id === 'oneDay')
  const sevenDay = strategies.find(s => s.id === 'sevenDay')
  const none = strategies.find(s => s.id === 'none')

  if (!threeDay || !oneDay || !sevenDay || !none) {
    console.error(
      'Unexpected error occurred - missing field in edit deadlines',
      { threeDay, oneDay, sevenDay, none },
    )
    throw new Error(
      'Unexpected error occurred - missing field in edit deadlines',
    )
  }

  return [threeDay, oneDay, sevenDay, none]
}

export type AvailableReconfigurationStrategy = ArrayElement<
  ReturnType<typeof useAvailableReconfigurationStrategies>
>
