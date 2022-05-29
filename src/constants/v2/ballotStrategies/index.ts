import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'

type BallotOption = Record<
  'THREE_DAY' | 'SEVEN_DAY',
  Partial<Record<NetworkName, string>>
>

export const DEPRECATED_BALLOT_ADDRESSES: BallotOption = {
  THREE_DAY: {
    rinkeby: '0xf91150aa07a1AC707148420713cefd299b8D094A',
    mainnet: '0x9733F02d3A1068A11B07516fa2f3C3BaEf90e7eF',
  },
  SEVEN_DAY: {
    // No 7 day delay contract deployed with original V2
    rinkeby: constants.AddressZero,
    mainnet: constants.AddressZero,
  },
}

export const BALLOT_ADDRESSES: BallotOption = {
  THREE_DAY: {
    rinkeby: '0xbb5fe3f1c422a13700d8F990a17813e554c5b380',
    mainnet: '0x138D6d59afC6DbBD1DC0bDdF05Ae27f645Eb4305',
  },
  SEVEN_DAY: {
    rinkeby: '0xeC2a134FE6FC50798057dcd2d72f34d84f2aaEa7',
    mainnet: '0xf341D09b5eEA92B1C1C9bB8C0D7be4467743c84a',
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
      address: BALLOT_ADDRESSES.THREE_DAY[readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 3,
    },
    {
      name: t`7-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
      address: BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 7,
    },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[1]
