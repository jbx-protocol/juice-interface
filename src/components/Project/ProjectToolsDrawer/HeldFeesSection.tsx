import { Trans } from '@lingui/macro'
import { Space, Statistic } from 'antd'
import ExternalLink from 'components/ExternalLink'
import TransactorButton from 'components/buttons/TransactorButton'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useHeldFeesOf } from 'hooks/v2v3/contractReader/HeldFeesOf'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useProcessHeldFeesTx } from 'hooks/v2v3/transactor/ProcessHeldFeesTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { helpPagePath, v2v3ProjectRoute } from 'utils/routes'

export function HeldFeesSection() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [processingHeldFees, setProcessingHeldFees] = useState<boolean>()

  const heldFees = useHeldFeesOf()
  const processHeldFeesTx = useProcessHeldFeesTx()

  const canProcessHeldFees = useV2ConnectedWalletHasPermission(
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
      <Space direction="vertical" size="small">
        <Statistic
          title={<Trans>Fees held</Trans>}
          valueRender={() => <span>{heldFees} ETH</span>}
        />
        <p>
          <Trans>
            The held fees will reset as new funds are added to the project's
            balance with the <strong>Add to balance</strong> transaction above.
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
          <p className="mt-2 text-xs" style={{ color: colors.text.tertiary }}>
            <Trans>
              Processing held fees will pay{' '}
              <Link href={v2v3ProjectRoute({ projectId: 1 })}>JuiceboxDAO</Link>{' '}
              and mint JBX to the project owner's address.
            </Trans>
          </p>
        </div>
      </Space>
    </div>
  )
}
