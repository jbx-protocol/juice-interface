import { Trans } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

export function RequiredFlagsList() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  return (
    <p>
      <Trans>
        You must enable the following cycle rules:
        <ul className="list-disc pl-10">
          {!fundingCycleMetadata?.global.allowSetTerminals ? (
            <li>Enable payment terminal configurations</li>
          ) : null}
          {!fundingCycleMetadata?.allowTerminalMigration ? (
            <li>Enable payment terminal migrations</li>
          ) : null}
          {!fundingCycleMetadata?.allowControllerMigration ? (
            <li>Enable controller migrations</li>
          ) : null}
        </ul>
      </Trans>
    </p>
  )
}
