import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useUnlockTx } from 'hooks/veNft/transactor/VeNftUnlockTx'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { useContext, useState } from 'react'
import { emitSuccessNotification } from 'utils/notifications'

import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'

type UnlockModalProps = {
  visible: boolean
  token: VeNftToken
  tokenSymbolDisplayText: string
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

const UnlockModal = ({
  visible,
  token,
  tokenSymbolDisplayText,
  onCancel,
  onCompleted,
}: UnlockModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenId } = token
  const [loading, setLoading] = useState(false)
  const [form] = useForm<{ beneficiary: string }>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const unlockTx = useUnlockTx()

  const unlock = async () => {
    await form.validateFields()

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
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
        onConfirmed() {
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
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={unlock}
      okText={`Unlock`}
      confirmLoading={loading}
    >
      <h2>Unlock Token</h2>
      <div style={{ color: colors.text.secondary }}>
        <p>
          <Trans>
            Unlocking this staking position will burn your NFT and return $
            {tokenSymbolDisplayText}.
          </Trans>
        </p>
      </div>
      <Form form={form} layout="vertical">
        <CustomBeneficiaryInput form={form} />
      </Form>
    </Modal>
  )
}

export default UnlockModal
