import { CheckCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'
import { useSetNftOperatorPermissionsTx } from 'hooks/JB721Delegate/transactor/useSetNftOperatorPermissionsTx'
import { useState } from 'react'

export function SetNftOperatorPermissionsButton({
  onConfirmed,
  ...props
}: {
  onConfirmed: VoidFunction
} & ButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [txExecuted, setTxExecuted] = useState<boolean>(false)

  const setNftOperatorPermissionsTx = useSetNftOperatorPermissionsTx()

  const setPermissions = async () => {
    setLoading(true)
    await setNftOperatorPermissionsTx(undefined, {
      onConfirmed: () => {
        setTxExecuted(true)
        setLoading(false)
        onConfirmed()
      },
    })
  }

  return (
    <Button
      loading={loading}
      onClick={setPermissions}
      type="primary"
      disabled={txExecuted}
      size="large"
      {...props}
    >
      <span>
        <Trans>Grant NFT permissions</Trans>
      </span>
      {txExecuted ? <CheckCircleOutlined /> : null}
    </Button>
  )
}
