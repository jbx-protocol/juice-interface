import { t, Trans } from '@lingui/macro'
import { Form, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { MemoFormInput } from 'components/inputs/Pay/MemoFormInput'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { isAddress } from 'ethers/lib/utils'
import { useRedeemVeNftTx } from 'hooks/veNft/transactor/RedeemTx'
import { VeNftToken } from 'models/subgraph-entities/veNft/venft-token'
import { useContext, useState } from 'react'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { EthAddressInput } from 'components/inputs/EthAddressInput'

import { JBX_CONTRACT_ADDRESS } from 'constants/v2/veNft/veNftProject'

type RedeemVeNftModalProps = {
  token: VeNftToken
  visible: boolean
  onCancel: VoidFunction
}

const RedeemVeNftModal = ({
  token,
  visible,
  onCancel,
}: RedeemVeNftModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { primaryTerminal } = useContext(V2ProjectContext)
  const { tokenId } = token
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState(false)
  const [form] = useForm<{ beneficiary: string }>()
  const [memo, setMemo] = useState('')
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const redeemTx = useRedeemVeNftTx()

  const validateCustomBeneficiary = () => {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!beneficiary) {
      return Promise.reject(t`Address required`)
    } else if (!isAddress(beneficiary)) {
      return Promise.reject(t`Invalid address`)
    }
    return Promise.resolve()
  }

  const redeem = async () => {
    const { beneficiary } = form.getFieldsValue()
    await form.validateFields()

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txBeneficiary = beneficiary ? beneficiary : userAddress!

    const txSuccess = await redeemTx({
      tokenId,
      token: JBX_CONTRACT_ADDRESS,
      beneficiary: txBeneficiary,
      memo,
      terminal: primaryTerminal ? primaryTerminal : '',
    })

    if (!txSuccess) {
      return
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={redeem}
      okText={`Redeem`}
    >
      <h2>
        <Trans>Redeem Token</Trans>
      </h2>
      <div style={{ color: colors.text.secondary }}>
        <p>
          <Trans>Redeeming this NFT will burn the token and return...</Trans>
        </p>
      </div>
      <Form form={form} layout="vertical">
        <MemoFormInput value={memo} onChange={setMemo} />
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

export default RedeemVeNftModal
