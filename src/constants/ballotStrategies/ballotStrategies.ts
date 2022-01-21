import { constants } from 'ethers'
import { t } from '@lingui/macro'

export type Strategy = {
  address: string
  name: string
  description?: string
  unknown?: boolean
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
      address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: '0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
    },
  ]
}

export const customStrategy = (address: string) => ({
  address,
  name: t`Custom strategy`,
  description: t`Unrecognized strategy contract. Make sure this is correct!`,
  unknown: true,
})
