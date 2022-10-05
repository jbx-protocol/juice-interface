import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'

type BallotOption = Record<
  'THREE_DAY' | 'SEVEN_DAY',
  Partial<Record<NetworkName, string>>
>

// based on @jbx-protocol/v2-contracts@4.0.0
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
    rinkeby: '0xC3890c4Dac5D06C4DAA2eE3Fdc95eC1686A4718e',
    mainnet: '0x4b9f876c7Fc5f6DEF8991fDe639b2C812a85Fb12',
    goerli: '0xAa818525455C52061455a87C4Fb6F3a5E6f91090',
  },
  SEVEN_DAY: {
    rinkeby: '0x69f9aAC8e68cBa3685b84A1990a0F29F131Ca791',
    mainnet: '0x642EFF5259624FD09D021AB764a4b47d1DbD5770',
    goerli: '0xd2eEEdB22f075eBFf0a2A7D38781AA320CBc357E',
  },
}

interface BallotStrategy {
  id: ReconfigurationStrategy
  name: string
  description: string
  address: string
  durationSeconds: number
}

const durationBallotStrategyDescription = (days: number) =>
  t`A reconfiguration to an upcoming funding cycle must be submitted at least ${days} days before it starts.`

export function ballotStrategies(network?: NetworkName): BallotStrategy[] {
  return [
    {
      id: 'none',
      name: t`No strategy`,
      description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
    {
      id: 'threeDay',
      name: t`3-day delay`,
      description: durationBallotStrategyDescription(3),
      address: BALLOT_ADDRESSES.THREE_DAY[network ?? readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 3,
    },
    {
      id: 'sevenDay',
      name: t`7-day delay`,
      description: durationBallotStrategyDescription(7),
      address: BALLOT_ADDRESSES.SEVEN_DAY[network ?? readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 7,
    },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[1]
