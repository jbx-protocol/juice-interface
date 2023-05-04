import { t } from '@lingui/macro'
import { constants } from 'ethers'

import { BallotStrategy } from 'models/ballot'

import { SECONDS_IN_DAY } from 'constants/numbers'

export function ballotStrategies(): BallotStrategy[] {
  return [
    {
      name: t`No deadline`,
      description: t`Edits to upcoming cycles will take effect when the current cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
    {
      name: t`7-day deadline`,
      description: t`Edits to an upcoming cycle must be submitted at least 7 days before that cycle starts.`,
      address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
      durationSeconds: SECONDS_IN_DAY * 7,
    },
    {
      name: t`3-day deadline`,
      description: t`Edits to an upcoming cycle must be submitted at least 3 days before that cycle starts.`,
      address: '0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
      durationSeconds: SECONDS_IN_DAY * 3,
    },
  ]
}
