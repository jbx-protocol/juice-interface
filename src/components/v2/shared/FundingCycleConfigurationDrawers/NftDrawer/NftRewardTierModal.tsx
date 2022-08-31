import { t } from '@lingui/macro'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode } from 'components/formItems/formHelpers'
import TooltipLabel from 'components/TooltipLabel'
import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useEffect } from 'react'

import ContributionFloorFormItem from './ContributionFloorFormItem'
import NftUpload from './NftUpload'

import { withHttps } from 'utils/externalLink'
import { NFT_REWARDS_EXPLAINATION } from '.'
import MaxSupplyFormItem from './MaxSupplyFormItem'

export type NftFormFields = {
  contributionFloor: number
  maxSupply: number | undefined
  name: string
  externalLink: string
  description: string
  imageUrl: string // IPFS link
}

const MAX_DESCRIPTION_CHARS = 256

export default function NftRewardTierModal({
  visible,
  rewardTier,
  onClose,
  mode,
  onChange,
}: {
  visible: boolean
  rewardTier?: NftRewardTier // null when mode === 'Add'
  onClose: VoidFunction
  isCreate?: boolean
  mode: ModalMode
  onChange: (rewardTier: NftRewardTier) => void
}) {
  const [nftForm] = useForm<NftFormFields>()

  const onFormSaved = async () => {
    await nftForm.validateFields()
    const maxSupply = nftForm.getFieldValue('maxSupply')

    const newTier = {
      contributionFloor: parseFloat(nftForm.getFieldValue('contributionFloor')),
      maxSupply,
      remainingSupply: maxSupply,
      imageUrl: nftForm.getFieldValue('imageUrl'),
      name: nftForm.getFieldValue('name'),
      externalLink: withHttps(nftForm.getFieldValue('externalLink')),
      description: nftForm.getFieldValue('description'),
    } as NftRewardTier

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
        maxSupply: rewardTier.maxSupply,
        name: rewardTier.name,
        externalLink: rewardTier.externalLink?.slice(8), // removes 'https://'
        description: rewardTier.description,
        contributionFloor: rewardTier.contributionFloor,
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
        <Form.Item
          name={'name'}
          label={
            <TooltipLabel label={t`Name`} tip={t`Give this NFT a name.`} />
          }
          rules={[{ required: true }]}
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
        <ContributionFloorFormItem form={nftForm} />
        <NftUpload form={nftForm} />
        <MaxSupplyFormItem
          value={nftForm.getFieldValue('maxSupply')}
          onChange={value => nftForm.setFieldsValue({ maxSupply: value })}
        />
        <Form.Item
          name={'externalLink'}
          label={
            <TooltipLabel
              label={t`Website`}
              tip={t`Provide a link to additional information about this NFT.`}
            />
          }
        >
          <Input type="string" autoComplete="off" prefix="https://" />
        </Form.Item>
        <Form.Item
          label={t`Description`}
          name="description"
          rules={[{ max: MAX_DESCRIPTION_CHARS }]}
        >
          <Input.TextArea
            maxLength={MAX_DESCRIPTION_CHARS}
            showCount
            autoSize
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
