import * as constants from '@ethersproject/constants'
import { plural, t } from '@lingui/macro'

import { NetworkName } from 'models/networkName'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'

type BallotOption = Record<
  'ONE_DAY' | 'THREE_DAY' | 'SEVEN_DAY',
  Partial<Record<NetworkName, string>>
>

// based on @jbx-protocol/v2-contracts@4.0.0
export const DEPRECATED_BALLOT_ADDRESSES: BallotOption = {
  ONE_DAY: {
    // No 1 day delay contract deployed with original V2
    mainnet: constants.AddressZero,
  },
  THREE_DAY: {
    mainnet: '0x9733F02d3A1068A11B07516fa2f3C3BaEf90e7eF',
  },
  SEVEN_DAY: {
    // No 7 day delay contract deployed with original V2
    mainnet: constants.AddressZero,
  },
}

export const BALLOT_ADDRESSES: BallotOption = {
  ONE_DAY: {
    mainnet: '0xDd9303491328F899796319C2b6bD614324b86314',
    goerli: '0x9d5687A9A175308773Bb289159Aa61D326E3aDB5',
  },
  THREE_DAY: {
    mainnet: '0x19D8C293D35EA4b2879A864A68D45a2025694929',
    goerli: '0xAa818525455C52061455a87C4Fb6F3a5E6f91090',
  },
  SEVEN_DAY: {
    mainnet: '0x8E1AEc30063565e597705E71Ba14Dffc4C390Ef0',
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
  plural(days, {
    one: 'Edits to an upcoming cycle must be submitted at least # day before that cycle starts.',
    other:
      'Edits to an upcoming cycle must be submitted at least # days before that cycle starts.',
  })

export function ballotStrategiesFn(network?: NetworkName): BallotStrategy[] {
  return [
    {
      id: 'none',
      name: t`No deadline`,
      description: t`Edits to upcoming cycles will take effect when the current cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
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
  ]
}

export const ballotStrategies = ballotStrategiesFn()

export const DEFAULT_BALLOT_STRATEGY = ballotStrategiesFn()[0]
