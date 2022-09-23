import { ballotStrategies } from 'constants/v2v3/ballotStrategies'
import { BallotStrategy } from 'models/ballot'
import { createCustomStrategy } from 'utils/ballot'

// Put in separate files because lingui.js t macro was not working on ballot strategies
export const getBallotStrategyByAddress = (address: string): BallotStrategy => {
  const s =
    ballotStrategies().find(
      s => s.address.toLowerCase() === address.toLowerCase(),
    ) ?? createCustomStrategy(address)
  return s
}
