import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/routes'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function HeaderRows() {
  return (
    <thead>
      <Row className="text-primary">
        <Cell className="py-5">
          <div className="mb-2 text-lg font-medium">
            <Trans>Payout recipients</Trans>
          </div>
          <div className="text-secondary text-sm">
            <Trans>
              Juicebox provides trustless payroll capabilities to run automated
              payouts completely on-chain.{' '}
              <ExternalLink href={helpPagePath(`/dao/reference/jbx/`)}>
                Learn more about payouts
              </ExternalLink>
            </Trans>
          </div>
        </Cell>
        {/* Add recipient button */}
        {/* 3-dots overall payout settings button */}
      </Row>
      <Row className="font-medium" highlighted>
        <Cell>
          <Trans>Address or ID</Trans>
        </Cell>
        <Cell>
          <Trans>Amount</Trans>
        </Cell>
        <Cell></Cell>
      </Row>
    </thead>
  )
}
