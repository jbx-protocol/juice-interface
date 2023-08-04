import { PlusOutlined } from '@ant-design/icons'
import { ReceiptPercentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'

import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { PopupMenu } from 'components/ui/PopupMenu'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutsTableCell } from './PayoutsTableCell'
import { PayoutsTableRow } from './PayoutsTableRow'

const Row = PayoutsTableRow
const Cell = PayoutsTableCell

export function HeaderRows() {
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState<boolean>()
  const { distributionLimitIsInfinite, handleNewPayoutSplit } =
    usePayoutsTable()
  const menuItemsLabelClass = 'flex gap-2 items-center'
  const menuItemsIconClass = 'h-5 w-5'
  const menuItems = [
    {
      id: 'unlimited',
      label: (
        <div className={menuItemsLabelClass}>
          <ReceiptPercentIcon className={menuItemsIconClass} />
          <Trans>Switch to unlimited</Trans>
        </div>
      ),
      onClick: () => console.info('Switch to unlimited modal open'),
    },
    {
      id: 'delete',
      label: (
        <div className={menuItemsLabelClass}>
          <TrashIcon className={menuItemsIconClass} />
          <Trans>Delete all</Trans>
        </div>
      ),
      onClick: () => console.info('Delete clicked'),
    },
  ]

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
                className="text-primary border-primary"
              >
                <span>
                  <Trans>Add recipient</Trans>
                </span>
              </Button>
              <PopupMenu items={menuItems} className="w-50" />
            </div>
          </Cell>
        </Row>
        <Row className="font-medium" highlighted>
          <Cell>
            <Trans>Address or ID</Trans>
          </Cell>
          <Cell>
            <Trans>Amount</Trans>
          </Cell>
        </Row>
      </thead>
      <AddEditAllocationModal
        allocationName="payout"
        availableModes={
          new Set([distributionLimitIsInfinite ? 'percentage' : 'amount'])
        }
        open={addRecipientModalOpen}
        onOk={handleAddRecipientModalOk}
        onCancel={() => setAddRecipientModalOpen(false)}
      />
    </>
  )
}
