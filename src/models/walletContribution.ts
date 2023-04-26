import { BigNumber } from '@ethersproject/bignumber'
import { WalletContributionsQuery } from 'generated/graphql'

import { PV } from './pv'

export type WalletContribution = WalletContributionsQuery['participants'][0] & {
  volume: BigNumber
  pv: PV
}
