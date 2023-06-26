import { Trans } from '@lingui/macro'
import { Statistic } from 'antd'
import TransactorButton from 'components/buttons/TransactorButton'
import ExternalLink from 'components/ExternalLink'
import { useHeldFeesOf } from 'hooks/v2v3/contractReader/useHeldFeesOf'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { useProcessHeldFeesTx } from 'hooks/v2v3/transactor/useProcessHeldFeesTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { helpPagePath, v2v3ProjectRoute } from 'utils/routes'

export function HeldFeesSection() {
  const [processingHeldFees, setProcessingHeldFees] = useState<boolean>()

  const heldFees = useHeldFeesOf()
  const processHeldFeesTx = useProcessHeldFeesTx()

  const canProcessHeldFees = useV2V3WalletHasPermission(
    V2V3OperatorPermission.PROCESS_FEES,
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
    <div>
      <h3>
        <Trans>Held fees</Trans>
      </h3>
      <div className="flex flex-col gap-2">
        <Statistic
          title={<Trans>Fees held</Trans>}
          valueRender={() => <span>{heldFees} ETH</span>}
        />
        <p>
          <Trans>
            The held fees will reset as ETH is transferred back to the project
            with the <strong>transfer ETH to project</strong> transaction above.
          </Trans>{' '}
          <ExternalLink href={helpPagePath('/dev/learn/glossary/hold-fees/')}>
            Learn more.
          </ExternalLink>
        </p>
        <div>
          <TransactorButton
            onClick={processHeldFees}
            loading={processingHeldFees}
            size="small"
            type="primary"
            text={<Trans>Process held fees</Trans>}
            disabled={!canProcessHeldFees}
          />
          <p className="text-tertiary mt-2 text-xs">
            <Trans>
              Processing held fees will pay{' '}
              <Link href={v2v3ProjectRoute({ projectId: 1 })}>JuiceboxDAO</Link>{' '}
              and mint JBX to the project owner's address.
            </Trans>
          </p>
        </div>
      </div>
    </div>
  )
}
