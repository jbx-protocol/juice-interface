import { Trans } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'
import { MigrateProjectController } from '../../../components/MigrateProjectController'

export function UpgradeController() {
  const { contracts } = useContext(V2V3ContractsContext)

  if (!contracts?.JBController3_0_1) return null

  return (
    <div>
      <h3 className="text-black dark:text-slate-100">
        <Trans>Upgrade to JBController 3.0.1</Trans>
      </h3>
      <MigrateProjectController
        controllerAddress={contracts.JBController3_0_1.address}
      />
    </div>
  )
}
