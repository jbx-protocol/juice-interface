import { Form } from 'antd'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { useExtendLockTx } from 'hooks/veNft/transactor/VeNftExtendLockTx'
import { NetworkContext } from 'contexts/networkContext'
import { t, Trans } from '@lingui/macro'
import { emitSuccessNotification } from 'utils/notifications'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'

import TransactionModal from 'components/TransactionModal'
import LockDurationSelectInput from 'components/veNft/formControls/LockDurationSelectInput'
import { VeNftContext } from 'contexts/v2/veNftContext'

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
  const { lockDurationOptions } = useContext(VeNftContext)
  const [form] = Form.useForm<ExtendLockFormProps>()
  const [loading, setLoading] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
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
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
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
    <TransactionModal
      visible={visible}
      title={t`Extend Lock`}
      onCancel={onCancel}
      onOk={extendLock}
      okText={`Extend Lock`}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <div style={{ color: colors.text.secondary }}>
        <p>
          <Trans>Update your veNFT's lock duration.</Trans>
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
    </TransactionModal>
  )
}

export default VeNftExtendLockModal
