import { t } from '@lingui/macro'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode } from 'components/formItems/formHelpers'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import TooltipLabel from 'components/TooltipLabel'
import { useEffect } from 'react'

import PaymentThresholdFormItem from './PaymentThresholdFormItem'
import NFTUpload from './NFTUpload'
import MaxSupplyFormItem from './MaxSupplyFormItem'
import { NFT_REWARDS_EXPLAINATION } from '.'

export type NFTFormFields = {
  paymentThreshold: number
  maxSupply: number
  name: string
  externalLink: string
  description: string
  imageUrl: string // IPFS link
}

export default function NFTRewardTierModal({
  visible,
  rewardTier,
  onClose,
  mode,
  onChange,
}: {
  visible: boolean
  rewardTier?: NFTRewardTier // null when mode === 'Add'
  onClose: VoidFunction
  isCreate?: boolean
  mode: ModalMode
  onChange: (rewardTier: NFTRewardTier) => void
}) {
  const [nftForm] = useForm<NFTFormFields>()

  const onFormSaved = async () => {
    await nftForm.validateFields()

    const newTier = {
      paymentThreshold: parseFloat(nftForm.getFieldValue('paymentThreshold')),
      maxSupply: nftForm.getFieldValue('maxSupply'),
      imageUrl: nftForm.getFieldValue('imageUrl'),
      name: nftForm.getFieldValue('name'),
      externalLink: nftForm.getFieldValue('externalLink'),
      description: nftForm.getFieldValue('description'),
    } as NFTRewardTier

    onChange(newTier)
    onClose()

    if (mode === 'Add') {
      nftForm.resetFields()
    }
  }

  useEffect(() => {
    if (rewardTier) {
      nftForm.setFieldsValue({
        imageUrl: rewardTier.imageUrl,
        name: rewardTier.name,
        externalLink: rewardTier.externalLink,
        description: rewardTier.description,
        paymentThreshold: rewardTier.paymentThreshold,
        maxSupply: rewardTier.maxSupply,
      })
    }
  })

  return (
    <Modal
      visible={visible}
      okText={mode === 'Edit' ? t`Save NFT reward` : t`Add NFT reward`}
      onOk={onFormSaved}
      onCancel={onClose}
      title={mode === 'Edit' ? t`Edit NFT reward` : t`Add NFT reward`}
    >
      <p>{NFT_REWARDS_EXPLAINATION}</p>
      <Form layout="vertical" form={nftForm}>
        <PaymentThresholdFormItem form={nftForm} />
        <MaxSupplyFormItem form={nftForm} />
        <NFTUpload form={nftForm} />
        <Form.Item
          name={'name'}
          label={
            <TooltipLabel label={t`Name`} tip={t`Give this NFT a name.`} />
          }
          rules={[{ required: true }]}
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name={'externalLink'}
          label={
            <TooltipLabel
              label={t`Website`}
              tip={t`Provide a link to additional information about this NFT.`}
            />
          }
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label={t`Description`}
          name="description"
          rules={[{ max: 256 }]}
        >
          <Input.TextArea
            maxLength={256} // TODO: unknown
            showCount
            autoSize
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
