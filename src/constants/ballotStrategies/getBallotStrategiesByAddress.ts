import { ballotStrategies, customStrategy } from './ballotStrategies'

// Put in separate files because lingui.js t macro was not working on ballot strategies
export const getBallotStrategyByAddress = (address: string) => {
  const s =
    ballotStrategies().find(
      s => s.address.toLowerCase() === address.toLowerCase(),
    ) ?? customStrategy(address)
  return s
}
