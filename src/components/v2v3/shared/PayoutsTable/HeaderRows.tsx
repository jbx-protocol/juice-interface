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
import { PayoutTableSettings } from './PayoutTableSettings'
import { PayoutsTableCell } from './PayoutsTableCell'
import { usePayoutsTableContext } from './context/PayoutsTableContext'
import { usePayoutsTable } from './hooks/usePayoutsTable'

export function HeaderRows() {
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState<boolean>()

  const { hideExplaination, hideSettings, addPayoutsDisabled } =
    usePayoutsTableContext()

  const { distributionLimitIsInfinite, handleNewPayoutSplit } =
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
      <PayoutsTableCell className="flex flex-col items-start justify-between gap-0 md:flex-row md:gap-10">
        <div className="py-5">
          <div className="mb-2 text-lg font-medium">
            <Trans>Payout recipients</Trans>
          </div>
          {hideExplaination ? null : (
            <div className="text-secondary text-sm">
              <Trans>
                Juicebox provides trustless payroll capabilities to run
                automated payouts completely on-chain.{' '}
                <ExternalLinkWithIcon
                  href={helpPagePath(`/user/project/#payouts`)}
                >
                  <Trans>Learn more about payouts</Trans>
                </ExternalLinkWithIcon>
              </Trans>
            </div>
          )}
        </div>
        <div className={`align-top ${hideExplaination ? 'pt-3' : 'pt-6'}`}>
          <div className="flex items-center justify-end gap-3">
            {addPayoutsDisabled ? null : (
              <Button
                type="ghost"
                onClick={() => setAddRecipientModalOpen(true)}
                icon={<PlusOutlined />}
              >
                <span>
                  <Trans>Add recipient</Trans>
                </span>
              </Button>
            )}
            {hideSettings ? null : <PayoutTableSettings />}
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
