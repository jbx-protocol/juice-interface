import { isAddress } from '@ethersproject/address'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useUnlockTx } from 'hooks/v2/nft/UnlockTx'
import { VeNftToken } from 'models/v2/stakingNFT'
import { useContext, useState } from 'react'

type UnlockModalProps = {
  visible: boolean
  token: VeNftToken
  tokenSymbol: string
  onCancel: VoidFunction
}

const UnlockModal = ({
  visible,
  token,
  tokenSymbol,
  onCancel,
}: UnlockModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenId } = token
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState(false)
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

    const txSuccess = await unlockTx({
      tokenId,
      beneficiary: txBeneficiary,
    })

    if (!txSuccess) {
      return
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={unlock}
      okText={`Unlock`}
    >
      <h2>Unlock Token</h2>
      <div style={{ color: colors.text.secondary }}>
        <p>
          Unlocking this staking position will burn your NFT and return{' '}
          {token.lockInfo.amount.toNumber()} ${tokenSymbol}.
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
          <FormItems.EthAddress
            defaultValue={undefined}
            name={'beneficiary'}
            onAddressChange={beneficiary => {
              form.setFieldsValue({ beneficiary })
            }}
            formItemProps={{
              rules: [
                {
                  validator: validateCustomBeneficiary,
                },
              ],
            }}
          />
        )}
      </Form>
    </Modal>
  )
}

export default UnlockModal
