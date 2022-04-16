import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'

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
      address: '0x7dFB626755dCb7CBddef0307383888331dd63cab',
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: '0x7Db107F1d92CcC9A76299F0BF87Ba506Dbfd0b6c',
    },
  ]
}

export const DEFAULT_BALLOT_STRATEGY = ballotStrategies()[2]
