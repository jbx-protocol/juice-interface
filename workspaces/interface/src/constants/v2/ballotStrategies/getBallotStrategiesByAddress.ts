import { BallotStrategy } from 'models/ballot'
import { createCustomStrategy } from 'utils/ballot'

import { ballotStrategies } from '.'

// Put in separate files because lingui.js t macro was not working on ballot strategies
export const getBallotStrategyByAddress = (address: string): BallotStrategy => {
  const s =
    ballotStrategies().find(
      s => s.address.toLowerCase() === address.toLowerCase(),
    ) ?? createCustomStrategy(address)
  return s
}
