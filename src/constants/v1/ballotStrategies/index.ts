import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { BallotStrategy } from 'models/ballot'

export function ballotStrategies(): BallotStrategy[] {
  return [
    {
      name: t`No strategy`,
      description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
      address: constants.AddressZero,
    },
    {
      name: t`7-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
      address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: '0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
    },
  ]
}
