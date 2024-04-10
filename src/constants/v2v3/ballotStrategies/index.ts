import { plural, t } from '@lingui/macro'
import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { constants } from 'ethers'
import { CV2V3 } from 'models/v2v3/cv'

import { CV_V2 } from 'constants/cv'
import { NetworkName } from 'models/networkName'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'

type BallotOption = Record<
  'ONE_DAY' | 'THREE_DAY' | 'SEVEN_DAY',
  Partial<Record<NetworkName, string>>
>

const V2_BALLOT_ADDRESSES: BallotOption = {
  ONE_DAY: {
    // No 1 day delay contract deployed with V2
    mainnet: constants.AddressZero,
  },
  THREE_DAY: {
    mainnet: '0x4b9f876c7Fc5f6DEF8991fDe639b2C812a85Fb12',
  },
  SEVEN_DAY: {
    mainnet: '0x642EFF5259624FD09D021AB764a4b47d1DbD5770',
  },
}

const BALLOT_ADDRESSES: BallotOption = {
  ONE_DAY: {
    mainnet: '0xDd9303491328F899796319C2b6bD614324b86314',
    goerli: '0x9d5687A9A175308773Bb289159Aa61D326E3aDB5',
    sepolia: '0x34E2992ea3C3E6CcfCf5bC668B68F285C1EDFE24',
  },
  THREE_DAY: {
    mainnet: '0x19D8C293D35EA4b2879A864A68D45a2025694929',
    goerli: '0xAa818525455C52061455a87C4Fb6F3a5E6f91090',
    sepolia: '0xa2154aBD135be068540073cB4390139906d0FDc6',
  },
  SEVEN_DAY: {
    mainnet: '0x8E1AEc30063565e597705E71Ba14Dffc4C390Ef0',
    goerli: '0xd2eEEdB22f075eBFf0a2A7D38781AA320CBc357E',
    sepolia: '0xb958fEa9089208d0Cc990EceCEcc42458F1B618e',
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
  plural(days, {
    one: 'Edits to an upcoming cycle must be submitted at least # day before that cycle starts.',
    other:
      'Edits to an upcoming cycle must be submitted at least # days before that cycle starts.',
  })

export function ballotStrategiesFn({
  network,
  cv,
}: {
  network?: NetworkName
  cv?: CV2V3
} = {}): BallotStrategy[] {
  const ballotStrategies: BallotStrategy[] = [
    {
      id: 'none',
      name: t`No deadline`,
      description: t`Edits to upcoming cycles will take effect when the current cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
  ]
  if (cv === CV_V2) {
    ballotStrategies.push(
      {
        id: 'threeDayV2',
        name: t`V2 3-day deadline`,
        description: durationBallotStrategyDescription(3),
        address: V2_BALLOT_ADDRESSES.THREE_DAY[network ?? readNetwork.name]!,
        durationSeconds: SECONDS_IN_DAY * 3,
      },
      {
        id: 'sevenDayV2',
        name: t`V2 7-day deadline`,
        description: durationBallotStrategyDescription(7),
        address: V2_BALLOT_ADDRESSES.SEVEN_DAY[network ?? readNetwork.name]!,
        durationSeconds: SECONDS_IN_DAY * 7,
      },
    )
  } else {
    ballotStrategies.push(
      {
        id: 'oneDay',
        name: t`1-day deadline`,
        description: durationBallotStrategyDescription(1),
        address: BALLOT_ADDRESSES.ONE_DAY[network ?? readNetwork.name]!,
        durationSeconds: SECONDS_IN_DAY,
      },
      {
        id: 'threeDay',
        name: t`3-day deadline`,
        description: durationBallotStrategyDescription(3),
        address: BALLOT_ADDRESSES.THREE_DAY[network ?? readNetwork.name]!,
        durationSeconds: SECONDS_IN_DAY * 3,
      },
      {
        id: 'sevenDay',
        name: t`7-day deadline`,
        description: durationBallotStrategyDescription(7),
        address: BALLOT_ADDRESSES.SEVEN_DAY[network ?? readNetwork.name]!,
        durationSeconds: SECONDS_IN_DAY * 7,
      },
    )
  }
  return ballotStrategies
}
