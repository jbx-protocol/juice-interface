import { isEqualAddress } from 'utils/address'
import { createCustomStrategy } from 'utils/ballot'

import { ballotStrategies } from '.'

// Put in separate files because lingui.js t macro was not working on ballot strategies
export const getBallotStrategyByAddress = (address: string) => {
  const s =
    ballotStrategies().find(s => isEqualAddress(s.address, address)) ??
    createCustomStrategy(address)
  return s
}
