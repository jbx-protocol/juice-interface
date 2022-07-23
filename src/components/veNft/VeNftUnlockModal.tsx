import { isAddress } from '@ethersproject/address'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useUnlockTx } from 'hooks/veNft/transactor/VeNftUnlockTx'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { useContext, useState } from 'react'
import { emitSuccessNotification } from 'utils/notifications'

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
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = useForm<{ beneficiary: string }>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const unlockTx = useUnlockTx()

  const validateCustomBeneficiary = () => {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!beneficiary) {
      return Promise.reject(t`Address required`)
    } else if (!isAddress(beneficiary)) {
      return Promise.reject(t`Invalid address`)
    }
    return Promise.resolve()
  }

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
        <Form.Item
          label={
            <>
              <Trans>Custom beneficiary</Trans>
              <Switch
                checked={customBeneficiaryEnabled}
                onChange={setCustomBeneficiaryEnabled}
                style={{ marginLeft: 10 }}
              />
            </>
          }
          extra={<Trans>Send unlocked tokens to a custom address.</Trans>}
          style={{ marginBottom: '1rem' }}
        />

        {customBeneficiaryEnabled && (
          <Form.Item
            name="beneficiary"
            label="Beneficiary"
            rules={[
              {
                validator: validateCustomBeneficiary,
              },
            ]}
          >
            <EthAddressInput />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default UnlockModal
