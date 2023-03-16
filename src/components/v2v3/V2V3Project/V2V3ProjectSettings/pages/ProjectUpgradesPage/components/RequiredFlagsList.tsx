import { Trans } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

export function RequiredFlagsList() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  return (
    <p>
      <Trans>
        You must enable the following cycle rules:
        <ul>
          {!fundingCycleMetadata?.allowControllerMigration ? (
            <li>Allow Controller Migrations</li>
          ) : null}
          {!fundingCycleMetadata?.allowTerminalMigration ? (
            <li>Allow Payment Terminal Migrations</li>
          ) : null}
          {!fundingCycleMetadata?.global.allowSetTerminals ? (
            <li>Allow Payment Terminal Configurations</li>
          ) : null}
        </ul>
      </Trans>
    </p>
  )
}
