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
    })

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={() => grantPermission()} loading={loading}>
        Grant transfer permission
      </Button>
    </div>
  )
}
