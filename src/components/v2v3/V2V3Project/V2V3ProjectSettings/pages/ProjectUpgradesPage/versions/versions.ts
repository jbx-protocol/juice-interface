import { t } from '@lingui/macro'
import { UpgradeController } from './upgradeForms/JBController3_0_1'
import { UpgradeFundingCycle } from './upgradeForms/V3/UpgradeFundingCycle'

export type JBVersion =
  | '3' // upgrades to layer 2 contracts
  | 'JBController3_0_1' // upgrades to a new JBController

export const VERSIONS: {
  [k in JBVersion]: {
    name: string
    description?: () => string | JSX.Element
    component: () => JSX.Element | null
  }
} = {
  '3': {
    name: 'Juicebox v3',
    component: UpgradeFundingCycle,
  },
  JBController3_0_1: {
    name: 'JBController v3.0.1',
    description: () =>
      t`Upgrade your project's JBController contract. This upgrade is required to deploy a migration token (JBV3Token).`,
    component: UpgradeController,
  },
}
