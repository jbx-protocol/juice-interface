import { t } from '@lingui/macro'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode } from 'components/formItems/formHelpers'
import TooltipLabel from 'components/TooltipLabel'

import NftUpload from 'components/v2/shared/FundingCycleConfigurationDrawers/NftDrawer/NftUpload'
import { VeNftVariant } from 'models/veNft'
import { useEffect } from 'react'

import TokensStakedMinInput from 'components/veNft/formControls/TokensStakedMinInput'

export type VeNftFormFields = {
  name: string
  tokensStakedMin: number
  imageUrl: string
}

export default function VeNftRewardTierModal({
  id,
  visible,
  onClose,
  onChange,
  mode,
  variant,
}: {
  id: number
  visible: boolean
  onClose: VoidFunction
  mode: ModalMode
  variant?: VeNftVariant
  onChange: (variant: VeNftVariant) => void
}) {
  const [nftForm] = useForm<VeNftFormFields>()

  const onFormSaved = async () => {
    await nftForm.validateFields()

    const variant = {
      id,
      name: nftForm.getFieldValue('name'),
      tokensStakedMin: nftForm.getFieldValue('tokensStakedMin'),
      imageUrl: nftForm.getFieldValue('imageUrl'),
    } as VeNftVariant

    onChange(variant)
    onClose()

    if (mode === 'Add') {
      nftForm.resetFields()
    }
  }

  useEffect(() => {
    if (variant) {
      nftForm.setFieldsValue({
        name: variant.name,
        tokensStakedMin: variant.tokensStakedMin,
        imageUrl: variant.imageUrl,
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
      <Form layout="vertical" form={nftForm}>
        <TokensStakedMinInput form={nftForm} />
        <NftUpload form={nftForm} />
        <Form.Item
          name={'name'}
          label={
            <TooltipLabel label={t`Name`} tip={t`Give this NFT a name.`} />
          }
          rules={[{ required: true }]}
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
