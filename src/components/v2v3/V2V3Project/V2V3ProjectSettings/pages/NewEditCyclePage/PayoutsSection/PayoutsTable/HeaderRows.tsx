import { PlusOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutTableSettings } from './PayoutTableSettings'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function HeaderRows() {
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState<boolean>()
  const { distributionLimitIsInfinite, handleNewPayoutSplit, payoutSplits } =
    usePayoutsTable()

  const handleAddRecipientModalOk = (
    newSplit: AddEditAllocationModalEntity,
  ) => {
    handleNewPayoutSplit({ newSplit })
    setAddRecipientModalOpen(false)
  }

  return (
    <>
      <thead>
        <Row className="text-primary">
          <Cell className="py-5">
            <div className="mb-2 text-lg font-medium">
              <Trans>Payout recipients</Trans>
            </div>
            <div className="text-secondary text-sm">
              <Trans>
                Juicebox provides trustless payroll capabilities to run
                automated payouts completely on-chain.{' '}
                <ExternalLink href={helpPagePath(`/dao/reference/jbx/`)}>
                  Learn more about payouts
                </ExternalLink>
              </Trans>
            </div>
          </Cell>
          <Cell className="pt-6 align-top">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="ghost"
                onClick={() => setAddRecipientModalOpen(true)}
                icon={<PlusOutlined />}
              >
                <span>
                  <Trans>Add recipient</Trans>
                </span>
              </Button>
              <PayoutTableSettings />
            </div>
          </Cell>
        </Row>
      </thead>
      <AddEditAllocationModal
        allocationName="payout"
        availableModes={
          new Set([
            distributionLimitIsInfinite && payoutSplits?.length > 0
              ? 'percentage'
              : 'amount',
          ])
        }
        open={addRecipientModalOpen}
        onOk={handleAddRecipientModalOk}
        onCancel={() => setAddRecipientModalOpen(false)}
      />
    </>
  )
}
