import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { MemoFormInput } from 'components/inputs/Pay/MemoFormInput'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useRedeemVeNftTx } from 'hooks/veNft/transactor/VeNftRedeemTx'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { useContext, useState } from 'react'

import { emitSuccessNotification } from 'utils/notifications'

import CustomBeneficiaryInput from 'components/veNft/formControls/CustomBeneficiaryInput'
import { V2ProjectContext } from 'contexts/v2/projectContext'

type VeNftRedeemModalProps = {
  token: VeNftToken
  visible: boolean
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

const VeNftRedeemModal = ({
  token,
  visible,
  onCancel,
  onCompleted,
}: VeNftRedeemModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { primaryTerminal, tokenAddress } = useContext(V2ProjectContext)
  const { tokenId } = token
  const [form] = useForm<{ beneficiary: string }>()
  const [memo, setMemo] = useState('')
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const redeemTx = useRedeemVeNftTx()

  const redeem = async () => {
    const { beneficiary } = form.getFieldsValue()
    await form.validateFields()

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txBeneficiary = beneficiary ? beneficiary : userAddress!

    const txSuccess = await redeemTx(
      {
        tokenId,
        token: tokenAddress || '',
        beneficiary: txBeneficiary,
        memo,
        terminal: primaryTerminal ? primaryTerminal : '',
      },
      {
        onConfirmed() {
          emitSuccessNotification(
            t`Redeem successful. Results will be indexed in a few moments.`,
          )
          onCompleted()
        },
      },
    )

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
        <CustomBeneficiaryInput form={form} />
      </Form>
    </Modal>
  )
}

export default VeNftRedeemModal
