import { Button } from 'antd'
import Callout from 'components/Callout'
import { useV1SetOperatorTx } from 'hooks/v1/transactor/V1SetOperatorTx'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useState } from 'react'
import { Trans } from '@lingui/macro'
import { emitErrorNotification } from 'utils/notifications'
import { V2UserContext } from 'contexts/v2/userContext'

export function GrantTransferPermissionCallout({
  onFinish,
}: {
  onFinish?: VoidFunction
}) {
  const { contracts } = useContext(V2UserContext)
  const [setPermissionLoading, setSetPermissionLoading] =
    useState<boolean>(false)
  const setV1OperatorTx = useV1SetOperatorTx()

  const onGivePermissionClick = async () => {
    setSetPermissionLoading(true)

    const operator = contracts?.JBV1TokenPaymentTerminal.address
    if (!operator) return

    try {
      const res = await setV1OperatorTx({
        operator,
        domain: 0,
        permissionIndexes: [V1OperatorPermission.Transfer],
      })

      if (!res) {
        throw new Error()
      }

      onFinish?.()
    } catch (e) {
      emitErrorNotification('Set permission failed.')
    } finally {
      setSetPermissionLoading(false)
    }
  }

  return (
    <Callout>
      <p>
        <Trans>You must grant permission to swap your tokens.</Trans>
      </p>
      <Button
        loading={setPermissionLoading}
        onClick={() => onGivePermissionClick()}
        type="primary"
      >
        <Trans>Grant permission</Trans>
      </Button>
    </Callout>
  )
}
