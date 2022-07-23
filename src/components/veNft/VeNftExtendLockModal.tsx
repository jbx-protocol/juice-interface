import { Form, Modal } from 'antd'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { useExtendLockTx } from 'hooks/veNft/transactor/VeNftExtendLockTx'
import { NetworkContext } from 'contexts/networkContext'
import { t, Trans } from '@lingui/macro'
import { emitSuccessNotification } from 'utils/notifications'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useForm } from 'antd/lib/form/Form'

import LockDurationSelectInput from './formControls/LockDurationSelectInput'

type VeNftExtendLockModalProps = {
  visible: boolean
  token: VeNftToken
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

interface ExtendLockFormProps {
  lockDuration: number
}

const VeNftExtendLockModal = ({
  visible,
  token,
  onCancel,
  onCompleted,
}: VeNftExtendLockModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenId } = token
  const {
    veNft: { lockDurationOptions },
  } = useContext(V2ProjectContext)
  const [form] = useForm<ExtendLockFormProps>()
  const [loading, setLoading] = useState(false)
  const lockDurationOptionsInSeconds = useMemo(() => {
    return lockDurationOptions
      ? lockDurationOptions.map((option: BigNumber) => {
          return option.toNumber()
        })
      : []
  }, [lockDurationOptions])

  useEffect(() => {
    lockDurationOptionsInSeconds.length > 0 &&
      form.setFieldsValue({ lockDuration: lockDurationOptionsInSeconds[0] })
  }, [lockDurationOptionsInSeconds, form])

  const initialValues = {
    lockDuration: 0,
  }

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const extendLockTx = useExtendLockTx()

  const extendLock = async () => {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const lockDuration = form.getFieldValue('lockDuration')

    setLoading(true)

    const txSuccess = await extendLockTx(
      {
        tokenId,
        updatedDuration: lockDuration,
      },
      {
        onConfirmed() {
          setLoading(false)
          emitSuccessNotification(
            t`Extend lock successful. Results will be indexed in a few moments.`,
          )
          onCompleted()
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={extendLock}
      okText={`Extend Lock`}
      confirmLoading={loading}
    >
      <h2>
        <Trans>Extend Lock</Trans>
      </h2>
      <div style={{ color: colors.text.secondary }}>
        <p>
          <Trans>Set an updated duration for your staking position.</Trans>
        </p>
      </div>
      <Form
        layout="vertical"
        style={{ width: '100%' }}
        form={form}
        initialValues={initialValues}
      >
        <LockDurationSelectInput
          form={form}
          lockDurationOptionsInSeconds={lockDurationOptionsInSeconds}
        />
      </Form>
    </Modal>
  )
}

export default VeNftExtendLockModal
