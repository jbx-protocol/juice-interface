import { Trans } from '@lingui/macro'
import TransactorButton from 'components/TransactorButton'
import { useHeldFeesOf } from 'hooks/v2v3/contractReader/HeldFeesOf'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useProcessHeldFeesTx } from 'hooks/v2v3/transactor/ProcessHeldFeesTx'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function HeldFeesSection() {
  const [processingHeldFees, setProcessingHeldFees] = useState<boolean>()

  const heldFees = useHeldFeesOf()
  const processHeldFeesTx = useProcessHeldFeesTx()

  const canProcessHeldFees = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.PROCESS_FEES,
  )

  async function processHeldFees() {
    setProcessingHeldFees(true)

    const result = await processHeldFeesTx(undefined, {
      onConfirmed: () => {
        setProcessingHeldFees(false)
      },
      onDone: () => {
        setProcessingHeldFees(false)
      },
      onError: e => {
        setProcessingHeldFees(false)
        emitErrorNotification(e.message)
      },
    })

    if (!result) {
      setProcessingHeldFees(false)
    }
  }
  if (!heldFees) return null

  return (
    <>
      <p>
        <Trans>
          This project has <strong>{heldFees} ETH</strong> held fees. The
          project owner or JuiceboxDAO can process these fees at an time.
        </Trans>
      </p>
      <p>
        <Trans>
          The held fees will reset as new funds are added to the project's
          balance with the <strong>Add to balance</strong> transaction above.
        </Trans>
      </p>
      <TransactorButton
        onClick={processHeldFees}
        loading={processingHeldFees}
        size="small"
        type="primary"
        text={<Trans>Process held fees</Trans>}
        disabled={!canProcessHeldFees}
      />
    </>
  )
}
