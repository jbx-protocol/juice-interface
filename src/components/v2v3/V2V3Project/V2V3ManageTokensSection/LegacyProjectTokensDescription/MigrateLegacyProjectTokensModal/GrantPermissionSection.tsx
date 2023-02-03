import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useSetTransferPermissionTx } from 'hooks/JBV3Token/transactor/SetTransferPermissionTx'
import { useState } from 'react'

export function GrantPermissionSection() {
  const grantPermissionTx = useSetTransferPermissionTx()
  const [loading, setLoading] = useState<boolean>(false)

  async function grantPermission() {
    setLoading(true)

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
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={() => grantPermission()} loading={loading}>
        <Trans>Grant transfer permission</Trans>
      </Button>
    </div>
  )
}
