import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/routes'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { EditCycleHeader } from '../EditCycleHeader'
import PayoutsTable from './PayoutsTable'

export function PayoutsSection() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <EditCycleHeader
          title={<Trans>Payout recipients</Trans>}
          description={
            <Trans>
              Juicebox provides trustless payroll capabilities to run automated
              payouts completely on-chain.{' '}
              <ExternalLink href={helpPagePath(`/dao/reference/jbx/`)}>
                Learn more about payouts
              </ExternalLink>
            </Trans>
          }
        />
        {/* Add recipient button */}
        {/* 3-dots overall payout settings button */}
      </div>
      <PayoutsTable />
      <AdvancedDropdown>
        {/* "Enable unlimited payouts" switch */}
        {/* "Hold fees in project" switch */}
      </AdvancedDropdown>
    </div>
  )
}
