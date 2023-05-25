import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTransactionExecutor } from 'hooks/useTransactionExecutor'
import { useSetTerminalsTx } from 'hooks/v2v3/transactor/useSetTerminalsTx'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { RequiredFlagsList } from './RequiredFlagsList'

/**
 * Component to call `migrateTerminal` on a project.
 */
export function SetProjectTerminal({
  terminalAddress,
  onDone,
}: {
  terminalAddress: string
  onDone: VoidFunction
}) {
  const { execute, loading } = useTransactionExecutor(useSetTerminalsTx(), {
    onConfirmed() {
      onDone?.()
    },
  })
  const { projectId } = useContext(ProjectMetadataContext)
  const { fundingCycleMetadata, handle } = useContext(V2V3ProjectContext)

  function onClick() {
    execute({
      projectId,
      newTerminalAddress: terminalAddress,
    })
  }

  if (!fundingCycleMetadata?.global.allowSetTerminals) {
    return (
      <div>
        <InfoCallout className="mb-5">
          <RequiredFlagsList />
          <Link
            href={settingsPagePath('cycle', { projectId, handle })}
            legacyBehavior
          >
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
          This transaction will set your project's Payment Terminal contract to:{' '}
          <EtherscanLink type="address" value={terminalAddress}>
            {terminalAddress}
          </EtherscanLink>
          .
        </Trans>
      </InfoCallout>
      <Button onClick={onClick} type="primary" loading={loading}>
        <Trans>Upgrade JBETHPaymentTerminal</Trans>
      </Button>
    </div>
  )
}
