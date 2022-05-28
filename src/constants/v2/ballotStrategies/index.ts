import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'

const BALLOT_ADDRESSES: { [k: string]: { [j: string]: string } } = {
  THREE_DAY: {
    rinkeby: '0xf91150aa07a1AC707148420713cefd299b8D094A',
    mainnet: '0xE81a1c3D4f12824712770F50252d8FeE797F3A04',
  },
  SEVEN_DAY: {
    rinkeby: '0x22223769a43502EFef4231eB49aa2e22F2745420',
    mainnet: '0x3EA16DeFF07f031e86bd13C55961eB576cd579a6',
  },
}

export function ballotStrategies() {
  return [
    {
      name: t`No strategy`,
      description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: BALLOT_ADDRESSES.THREE_DAY[readNetwork.name as string],
      durationSeconds: SECONDS_IN_DAY * 3,
    },
    {
      name: t`7-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
      address: BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name as string],
      durationSeconds: SECONDS_IN_DAY * 7,
    },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[1]
