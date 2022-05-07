import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'

const BALLOT_ADDRESSES: { [k: string]: { [j: string]: string } } = {
  THREE_DAY: {
    rinkeby: '0x63f683ef542779Cc151608b48aFB7Ec3E8e9BF7E',
    mainnet: '0xedfCFdCB621aFA76781eFBe7586fAe83D1578Ac2',
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
