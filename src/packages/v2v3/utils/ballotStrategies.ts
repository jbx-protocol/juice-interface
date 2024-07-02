import { BallotStrategy } from 'models/ballot'
import { ballotStrategiesFn } from 'packages/v2v3/constants/ballotStrategies'
import { isEqualAddress } from 'utils/address'
import { createCustomStrategy } from 'utils/ballot'

// Put in separate files because lingui.js t macro was not working on ballot strategies
export const getBallotStrategyByAddress = (address: string): BallotStrategy => {
  const s =
    ballotStrategiesFn().find(s => isEqualAddress(s.address, address)) ??
    createCustomStrategy(address)
  return s
}
