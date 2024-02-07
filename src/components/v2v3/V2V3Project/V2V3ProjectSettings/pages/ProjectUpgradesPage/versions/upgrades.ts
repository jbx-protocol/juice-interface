import { t } from '@lingui/macro'
import { UpgradeController } from './upgradeForms/JBController3_1/UpgradeController'

export type JBUpgrade = '3_1' // upgrades to a new JBController

export const UPGRADES: {
  [k in JBUpgrade]: {
    name: string
    description?: () => string | JSX.Element
    component: () => JSX.Element | null
  }
} = {
  '3_1': {
    name: 'Juicebox v3.1',
    description: () =>
      t`Upgrade your project's JBController and JBETHPaymentTerminal contracts. This upgrade is required to deploy a migration token (JBV3Token).`,
    component: UpgradeController,
  },
}
