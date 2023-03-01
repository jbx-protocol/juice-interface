import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTransactionExecutor } from 'hooks/TransactionExecutor'
import { useMigrateControllerTx } from 'hooks/v2v3/transactor/MigrateControllerTx'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'

/**
 * Component to call `migrateController` on a project.
 */
export function MigrateProjectController({
  controllerAddress,
  onDone,
}: {
  controllerAddress: string
  onDone?: VoidFunction
}) {
  const { execute, loading } = useTransactionExecutor(
    useMigrateControllerTx(),
    {
      onConfirmed() {
        onDone?.()
      },
    },
  )
  const { projectId } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata, handle } = useContext(V2V3ProjectContext)

  function onClick() {
    execute({
      projectId,
      newControllerAddress: controllerAddress,
    })
  }

  if (!fundingCycleMetadata?.allowControllerMigration) {
    return (
      <div>
        <InfoCallout className="mb-5">
          <p>
            <Trans>
              You must edit your funding cycle rules to allow controller
              migrations.
            </Trans>
          </p>
          <Link href={settingsPagePath('reconfigurefc', { projectId, handle })}>
            <Button type="primary">
              <Trans>Edit funding cycle</Trans>
            </Button>
          </Link>
        </InfoCallout>
      </div>
    )
  }

  return (
    <div>
      <InfoCallout className="mb-5">
        <Trans>
          This transaction will set your project's Controller contract to:{' '}
          <EtherscanLink type="address" value={controllerAddress}>
            {controllerAddress}
          </EtherscanLink>
          . Any reserved tokens will be distributed.
        </Trans>
      </InfoCallout>
      <Button onClick={onClick} type="primary" loading={loading}>
        <Trans>Upgrade Controller</Trans>
      </Button>
    </div>
  )
}
