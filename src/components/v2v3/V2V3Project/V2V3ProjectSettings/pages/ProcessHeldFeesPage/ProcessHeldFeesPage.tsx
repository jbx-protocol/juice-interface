import { Trans } from '@lingui/macro'
import { Statistic } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import TransactorButton from 'components/buttons/TransactorButton'
import { useHeldFeesOf } from 'hooks/v2v3/contractReader/useHeldFeesOf'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { useProcessHeldFeesTx } from 'hooks/v2v3/transactor/useProcessHeldFeesTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { helpPagePath, v2v3ProjectRoute } from 'utils/routes'

export function ProcessHeldFeesPage() {
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

  return (
    <>
      {heldFees ? (
        <>
          <p>
            <Trans>Process this project's held fees.</Trans>
          </p>
          <Statistic
            title={<Trans>Fees held</Trans>}
            valueRender={() => <span>{heldFees} ETH</span>}
            className="my-4"
          />
        </>
      ) : (
        <p>
          <Trans>This project has no held fees.</Trans>
        </p>
      )}
      <MinimalCollapse
        className="mb-4"
        header={<Trans>What are held fees?</Trans>}
      >
        <p>
          <Trans>
            $JBX is the Juicebox governance token. Normally, when a project pays
            ETH out to wallets, a 2.5% fee is taken out and used to buy $JBX
            from Uniswap or from{' '}
            <Link href={v2v3ProjectRoute({ projectId: 1 })}>
              JuiceboxDAO's project
            </Link>{' '}
            (whichever is cheaper). The project's owner gets 50% of that $JBX.
          </Trans>
        </p>
        <p>
          <Trans>
            If your project has "hold fees" enabled, instead of processing that
            that 2.5% fee immediately, the fee gets held within the Juicebox
            contracts. These fees can be unlocked by transferring the ETH back
            to your project.
          </Trans>
        </p>
        <p>
          <Trans>
            If you don't plan on unlocking the held fees later on, you can use
            the button below to process them now. When you press the button, the
            held fees will be used to buy $JBX. This cannot be undone.
          </Trans>
        </p>
        <p>
          <Trans>
            To learn more about this mechanism and $JBX, visit the{' '}
            <Link href={helpPagePath('/dao/jbx/')}>docs</Link>.
          </Trans>
        </p>
      </MinimalCollapse>
      {heldFees ? (
        <TransactorButton
          onClick={processHeldFees}
          loading={processingHeldFees}
          type="primary"
          connectWalletText={<Trans>Not able to process fees</Trans>}
          text={<Trans>Process held fees</Trans>}
          disabled={!canProcessHeldFees}
        />
      ) : (
        ''
      )}
      {!canProcessHeldFees ? (
        <p>
          <Trans>Your wallet isn't allowed to process held fees.</Trans>
        </p>
      ) : (
        ''
      )}
    </>
  )
}
