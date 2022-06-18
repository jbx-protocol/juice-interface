import { t } from '@lingui/macro'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode } from 'components/shared/formItems/formHelpers'
import { NFTRewardTier } from 'models/v2/nftRewardTier'
import TooltipLabel from 'components/shared/TooltipLabel'
import { useEffect } from 'react'

import PaymentThresholdFormItem from './PaymentThresholdFormItem'
import NFTUpload from './NFTUpload'
import MaxSupplyFormItem from './MaxSupplyFormItem'

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
  rewardTiers,
  setRewardTiers,
  onClose,
  mode,
  editingTierIndex,
}: {
  visible: boolean
  rewardTiers: NFTRewardTier[]
  setRewardTiers: (rewardTiers: NFTRewardTier[]) => void
  onClose: VoidFunction
  isCreate?: boolean
  mode: ModalMode
  editingTierIndex?: number
}) {
  const [NFTForm] = useForm<NFTFormFields>()

  const onFormSaved = async () => {
    await NFTForm.validateFields()

    const newTier = {
      paymentThreshold: parseFloat(NFTForm.getFieldValue('paymentThreshold')),
      maxSupply: NFTForm.getFieldValue('maxSupply'),
      imageUrl: NFTForm.getFieldValue('imageUrl'),
      name: NFTForm.getFieldValue('name'),
      externalLink: NFTForm.getFieldValue('externalLink'),
      description: NFTForm.getFieldValue('description'),
    } as NFTRewardTier

    const newTiers =
      mode === 'Edit'
        ? rewardTiers.map((tier, i) =>
            i === editingTierIndex
              ? {
                  ...tier,
                  ...newTier,
                }
              : tier,
          )
        : [...rewardTiers, newTier]

    setRewardTiers(newTiers)
    onClose()
    if (mode === 'Add') {
      NFTForm.resetFields()
    }
  }

  useEffect(() => {
    if (editingTierIndex !== undefined) {
      const rewardTier = rewardTiers[editingTierIndex]

      NFTForm.setFieldsValue({
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
      {/* TODO: translate text when confirmed */}
      <p>
        Encourage treasury contributions by offering an NFT reward for
        contributions above a certain threshold.
      </p>
      <Form layout="vertical" form={NFTForm}>
        <PaymentThresholdFormItem form={NFTForm} />
        <MaxSupplyFormItem form={NFTForm} />
        <NFTUpload form={NFTForm} />
        <Form.Item
          name={'name'}
          label={
            <TooltipLabel label={t`Name`} tip={t`Give this NFT a name.`} />
          }
          rules={[{ required: true }]}
        >
          <Input
            placeholder={t`Nammu Banny reward`}
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name={'externalLink'}
          label={
            <TooltipLabel
              label={t`External link`}
              tip={t`Provide a link to additional information about this NFT.`}
            />
          }
        >
          <Input
            placeholder={t`https://bannyverse.com/nammu-banny`}
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label={t`Description`}
          name="description"
          rules={[{ max: 256 }]}
        >
          <Input.TextArea
            placeholder={t`Supporters of the Bannyverse can flex their membership with this unique Banny NFT.`}
            maxLength={256} // TODO: unknown
            showCount
            autoSize
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
