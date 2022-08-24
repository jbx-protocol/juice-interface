import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ButtonType } from 'antd/lib/button'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useState } from 'react'

import LaunchProjectPayerModal from './LaunchProjectPayerModal'

export default function LaunchProjectPayerButton({
  useDeployProjectPayerTx,
  size,
  text,
  onCompleted,
  disabled,
  type,
  tooltipText,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
  size?: SizeType
  text?: JSX.Element
  onCompleted?: VoidFunction
  disabled?: boolean
  type?: ButtonType
  tooltipText?: JSX.Element
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  function DeployButton() {
    return (
      <Tooltip title={!disabled && tooltipText}>
        <Button
          onClick={() => setModalVisible(true)}
          size={size ?? 'small'}
          type={type ?? 'primary'}
          disabled={disabled}
        >
          <span>{text ?? <Trans>Deploy Payment Address</Trans>}</span>
        </Button>
      </Tooltip>
    )
  }
  return (
    <>
      <DeployButton />
      <LaunchProjectPayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
        onConfirmed={onCompleted}
      />
    </>
  )
}
