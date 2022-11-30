import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useUnlockTx } from 'hooks/veNft/transactor/VeNftUnlockTx'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { useState } from 'react'
import { emitSuccessNotification } from 'utils/notifications'

import TransactionModal from 'components/TransactionModal'
import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'
import { useWallet } from 'hooks/Wallet'

type UnlockModalProps = {
  open: boolean
  token: VeNftToken
  tokenSymbolDisplayText: string
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

const UnlockModal = ({
  open,
  token,
  tokenSymbolDisplayText,
  onCancel,
  onCompleted,
}: UnlockModalProps) => {
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  const { tokenId } = token
  const [loading, setLoading] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [form] = useForm<{ beneficiary: string }>()

  const unlockTx = useUnlockTx()

  const unlock = async () => {
    await form.validateFields()

    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    const beneficiary = form.getFieldValue('beneficiary')
    const txBeneficiary = beneficiary ? beneficiary : userAddress
    setLoading(true)

    const txSuccess = await unlockTx(
      {
        tokenId,
        beneficiary: txBeneficiary,
      },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          emitSuccessNotification(
            t`Unlock successful. Results will be indexed in a few moments.`,
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
      title={t`Unlock veNFT`}
      onCancel={onCancel}
      onOk={unlock}
      okText={`Unlock`}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <div className="text-grey-500 dark:text-grey-300">
        <p>
          <Trans>
            Unlocking this staking position will burn your NFT and return $
            {tokenSymbolDisplayText}.
          </Trans>
        </p>
      </div>
      <Form form={form} layout="vertical">
        <CustomBeneficiaryInput
          form={form}
          labelText={t`Send unlocked tokens to a custom address`}
        />
      </Form>
    </TransactionModal>
  )
}

export default UnlockModal
