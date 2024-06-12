import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useV2SetTransferPermissionTx } from 'hooks/JBV3Token/transactor/useV2SetTransferPermissionTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function GrantV2ApprovalCallout({ onDone }: { onDone?: VoidFunction }) {
  const grantPermissionTx = useV2SetTransferPermissionTx()
  const [loading, setLoading] = useState<boolean>(false)

  async function grantPermission() {
    setLoading(true)

    try {
      const txSuccess = await grantPermissionTx(undefined, {
        onConfirmed() {
          setLoading(false)
          onDone?.()
        },
        onError(e) {
          setLoading(false)
          console.error(e)
        },
      })
      if (!txSuccess) {
        throw new Error()
      }
    } catch {
      setLoading(false)

      emitErrorNotification('Grant permission failed.')
    }
  }

  return (
    <Callout.Info>
      <p>
        <Trans>You must grant permission to migrate your V2 tokens.</Trans>
      </p>
      <Button
        loading={loading}
        onClick={() => grantPermission()}
        type="primary"
      >
        <span>
          <Trans>Grant permission</Trans>
        </span>
      </Button>
    </Callout.Info>
  )
}
