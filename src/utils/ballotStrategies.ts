import { t } from '@lingui/macro'

import {
  BALLOT_STRATEGIES,
  CustomStrategy,
} from '../constants/ballotStrategies'

export const createCustomStrategy = (
  address: string | undefined,
): CustomStrategy => ({
  address,
  name: t`Custom strategy`,
  description: t`This address is an unrecognized strategy contract. Make sure it is correct!`,
  unknown: true,
})

export const getBallotStrategyByAddress = (address: string) => {
  return (
    BALLOT_STRATEGIES.find(
      s => s.address.toLowerCase() === address.toLowerCase(),
    ) ?? createCustomStrategy(address)
  )
}
