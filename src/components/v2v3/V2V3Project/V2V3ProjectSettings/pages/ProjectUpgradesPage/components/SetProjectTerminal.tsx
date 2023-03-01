import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTransactionExecutor } from 'hooks/TransactionExecutor'
import { useSetTerminalsTx } from 'hooks/v2v3/transactor/SetTerminalsTx'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'

/**
 * Component to call `migrateTerminal` on a project.
 */
export function SetProjectTerminal({
  terminalAddress,
}: {
  terminalAddress: string
}) {
  const { execute, loading } = useTransactionExecutor(useSetTerminalsTx())
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
          <p>
            <Trans>
              You must edit your funding cycle rules to allow terminal
              configuration.
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
