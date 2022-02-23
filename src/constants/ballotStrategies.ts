import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

export type Strategy = {
  address: string
  name: string
  description: string
}

export type CustomStrategy = Omit<Strategy, 'address'> & {
  unknown: true
  address: string | undefined
}

const NO_BALLOT_STRATEGY: Strategy = {
  name: t`No strategy`,
  description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
  address: constants.AddressZero,
}

const SEVEN_DAY_DELAY_STRATEGY: Strategy = {
  name: t`7-day delay`,
  description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
  address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
}

const THREE_DAY_DELAY_STRATEGY: Strategy = {
  name: t`3-day delay`,
  description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
  address: '0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
}

export const BALLOT_STRATEGIES: Strategy[] = [
  NO_BALLOT_STRATEGY,
  SEVEN_DAY_DELAY_STRATEGY,
  THREE_DAY_DELAY_STRATEGY,
]
