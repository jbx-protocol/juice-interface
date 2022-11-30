import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { useExtendLockTx } from 'hooks/veNft/transactor/VeNftExtendLockTx'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { useEffect, useMemo, useState } from 'react'
import { emitSuccessNotification } from 'utils/notifications'

import TransactionModal from 'components/TransactionModal'
import LockDurationSelectInput from 'components/veNft/formControls/LockDurationSelectInput'
import { useVeNftLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useWallet } from 'hooks/Wallet'

type VeNftExtendLockModalProps = {
  open: boolean
  token: VeNftToken
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

interface ExtendLockFormProps {
  lockDuration: number
}

const VeNftExtendLockModal = ({
  open,
  token,
  onCancel,
  onCompleted,
}: VeNftExtendLockModalProps) => {
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const { tokenId } = token
  const { data: lockDurationOptions } = useVeNftLockDurationOptions()
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

  const extendLockTx = useExtendLockTx()

  const extendLock = async () => {
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
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
      open={open}
      title={t`Extend Lock`}
      onCancel={onCancel}
      onOk={extendLock}
      okText={`Extend Lock`}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <div className="text-grey-500 dark:text-grey-300">
        <p>
          <Trans>Update your veNFT's lock duration.</Trans>
        </p>
      </div>
      <Form
        layout="vertical"
        className="w-full"
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
