import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'

const BALLOT_ADDRESSES: { [k: string]: { [j: string]: string } } = {
  THREE_DAY: {
    rinkeby: '',
    mainnet: '',
  },
  SEVEN_DAY: {
    rinkeby: '',
    mainnet: '',
  },
}

export function ballotStrategies() {
  return [
    {
      name: t`No strategy`,
      description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
      address: constants.AddressZero,
    },
    {
      name: t`7-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
      address: BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name as string],
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: BALLOT_ADDRESSES.THREE_DAY[readNetwork.name as string],
    },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[2]
