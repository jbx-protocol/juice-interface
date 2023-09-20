import { PlusOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

import { Button } from 'antd'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import {
  AddEditAllocationModal,
  AddEditAllocationModalEntity,
} from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { usePayoutsTable } from '../hooks/usePayoutsTable'
import { PayoutTableSettings } from './PayoutTableSettings'
import { PayoutsTableCell } from './PayoutsTableCell'

export function HeaderRows() {
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState<boolean>()
  const { distributionLimitIsInfinite, handleNewPayoutSplit, payoutSplits } =
    usePayoutsTable()

  const handleAddRecipientModalOk = (
    newSplit: AddEditAllocationModalEntity,
  ) => {
    if (newSplit.projectOwner) {
      console.error(
        'Not supporting manually adding project owner splits in Edit cycle form',
      )
      return
    }
    handleNewPayoutSplit({ newSplit })
    setAddRecipientModalOpen(false)
  }

  return (
    <>
      <PayoutsTableCell className="flex flex-col items-start gap-0 md:flex-row md:gap-10">
        <div className="py-5">
          <div className="mb-2 text-lg font-medium">
            <Trans>Payout recipients</Trans>
          </div>
          <div className="text-secondary text-sm">
            <Trans>
              Juicebox provides trustless payroll capabilities to run automated
              payouts completely on-chain.{' '}
              <ExternalLinkWithIcon
                href={helpPagePath(`/user/project/#payouts`)}
              >
                <Trans>Learn more about payouts</Trans>
              </ExternalLinkWithIcon>
            </Trans>
          </div>
        </div>
        <div className="pt-6 align-top">
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
            {payoutSplits?.length === 0 ? null : <PayoutTableSettings />}
          </div>
        </div>
      </PayoutsTableCell>
      <AddEditAllocationModal
        allocationName="payout"
        availableModes={
          new Set([distributionLimitIsInfinite ? 'percentage' : 'amount'])
        }
        open={addRecipientModalOpen}
        onOk={handleAddRecipientModalOk}
        onCancel={() => setAddRecipientModalOpen(false)}
        hideProjectOwnerOption
        hideFee
      />
    </>
  )
}
