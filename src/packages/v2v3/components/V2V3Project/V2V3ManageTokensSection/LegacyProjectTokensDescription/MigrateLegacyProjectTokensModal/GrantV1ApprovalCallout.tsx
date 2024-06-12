import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useV1ProjectId } from 'hooks/JBV3Token/contractReader/useV1ProjectId'
import { useV1SetTransferPermissionTx } from 'hooks/JBV3Token/transactor/useV1SetTransferPermissionTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function GrantV1ApprovalCallout({ onDone }: { onDone?: VoidFunction }) {
  const [loading, setLoading] = useState<boolean>(false)

  const grantPermissionTx = useV1SetTransferPermissionTx()
  const { value: v1ProjectId } = useV1ProjectId()

  async function grantPermission() {
    setLoading(true)

    try {
      const txSuccess = await grantPermissionTx(
        { v1ProjectId },
        {
          onConfirmed() {
            setLoading(false)
            onDone?.()
          },
          onError(e) {
            setLoading(false)
            console.error(e)
          },
        },
      )
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
        <Trans>You must grant permission to migrate your V1 tokens.</Trans>
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
