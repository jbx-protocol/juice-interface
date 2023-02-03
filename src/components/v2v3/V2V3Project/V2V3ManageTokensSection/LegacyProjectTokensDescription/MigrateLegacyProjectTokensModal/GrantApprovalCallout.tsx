import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout'
import { useSetTransferPermissionTx } from 'hooks/JBV3Token/transactor/SetTransferPermissionTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function GrantApprovalCallout() {
  const grantPermissionTx = useSetTransferPermissionTx()
  const [loading, setLoading] = useState<boolean>(false)

  async function grantPermission() {
    setLoading(true)

    try {
      const txSuccess = await grantPermissionTx(undefined, {
        onConfirmed() {
          setLoading(false)
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
      emitErrorNotification('Grant permission failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Callout.Info>
      <p>
        <Trans>You must grant permission to swap your tokens.</Trans>
      </p>
      <Button
        loading={loading}
        onClick={() => grantPermission()}
        type="primary"
      >
        <span>
          <Trans>Grant transfer permission</Trans>
        </span>
      </Button>
    </Callout.Info>
  )
}
