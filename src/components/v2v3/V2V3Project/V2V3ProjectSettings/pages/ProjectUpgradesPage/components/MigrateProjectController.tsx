import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTransactionExecutor } from 'hooks/useTransactionExecutor'
import { useMigrateControllerTx } from 'hooks/v2v3/transactor/useMigrateControllerTx'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { RequiredFlagsList } from './RequiredFlagsList'

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
          <RequiredFlagsList />
          <Link
            href={settingsPagePath('reconfigurefc', { projectId, handle })}
            legacyBehavior
          >
            <Button type="primary">
              <Trans>Edit cycle</Trans>
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
          . <strong>Any reserved tokens will be sent out.</strong>
        </Trans>
      </InfoCallout>
      <Button onClick={onClick} type="primary" loading={loading}>
        <Trans>Upgrade Controller</Trans>
      </Button>
    </div>
  )
}
