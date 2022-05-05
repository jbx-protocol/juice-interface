import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'

const BALLOT_ADDRESSES: { [k: string]: { [j: string]: string } } = {
  THREE_DAY: {
    rinkeby: '0xcA65D0348E6d53BD29d52e298140375cbC6d3C0D',
    mainnet: '0x5eaBF1D7A8c6942534cCb3489Ff221b2CBc0255b',
  },
  // TODO waiting on 7-day buffer contract to be deployed.
  // SEVEN_DAY: {
  //   rinkeby: '',
  //   mainnet: '',
  // },
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
    // {
    //   name: t`7-day delay`,
    //   description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
    //   address: BALLOT_ADDRESSES.SEVEN_DAY[readNetwork.name as string],
    //   durationSeconds: SECONDS_IN_DAY * 7
    // },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[1]
