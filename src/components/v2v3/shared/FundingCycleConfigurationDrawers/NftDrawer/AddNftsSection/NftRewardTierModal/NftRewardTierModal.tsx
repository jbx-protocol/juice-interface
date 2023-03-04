import { t, Trans } from '@lingui/macro'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode } from 'components/formItems/formHelpers'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import PrefixedInput from 'components/PrefixedInput'
import TooltipLabel from 'components/TooltipLabel'
import { NftRewardTier } from 'models/nftRewardTier'
import { useMemo } from 'react'
import { inputIsIntegerRule } from 'utils/antdRules'
import { withHttps } from 'utils/externalLink'
import ContributionFloorFormItem from './ContributionFloorFormItem'
import MaxSupplyFormItem from './MaxSupplyFormItem'
import NftUpload from './NftUpload'

export type NftFormFields = {
  contributionFloor: number
  maxSupply: number | undefined
  name: string
  externalLink: string
  description: string
  fileUrl: string // IPFS link
  votingWeight: number | undefined
}

const MAX_DESCRIPTION_CHARS = 256

export default function NftRewardTierModal({
  open,
  rewardTier,
  onClose,
  mode,
  onChange,
}: {
  open: boolean
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
    const votingWeight = nftForm.getFieldValue('votingWeight')

    const newTier = {
      contributionFloor: parseFloat(nftForm.getFieldValue('contributionFloor')),
      maxSupply,
      remainingSupply: maxSupply,
      fileUrl: nftForm.getFieldValue('fileUrl'),
      name: nftForm.getFieldValue('name'),
      externalLink: withHttps(nftForm.getFieldValue('externalLink')),
      description: nftForm.getFieldValue('description'),
      votingWeight: votingWeight
        ? parseInt(votingWeight.toString())
        : undefined,
    } as NftRewardTier

    onChange(newTier)
    onClose()

    if (mode === 'Add') {
      nftForm.resetFields()
    }
  }

  const initialValues = useMemo(
    () =>
      rewardTier
        ? {
            fileUrl: rewardTier.fileUrl,
            maxSupply: rewardTier.maxSupply,
            name: rewardTier.name,
            externalLink: rewardTier.externalLink?.slice(8), // removes 'https://'
            description: rewardTier.description,
            contributionFloor: rewardTier.contributionFloor,
            votingWeight: rewardTier.votingWeight,
          }
        : undefined,
    [rewardTier],
  )

  return (
    <Modal
      open={open}
      okText={mode === 'Edit' ? t`Save NFT` : t`Add NFT`}
      onOk={onFormSaved}
      onCancel={onClose}
      title={mode === 'Edit' ? t`Edit NFT` : t`Add NFT`}
    >
      <Form layout="vertical" form={nftForm} initialValues={initialValues}>
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
        <MaxSupplyFormItem />
        <Form.Item
          name="votingWeight"
          label={t`Voting Weight`}
          extra={t`Give this NFT a voting weight to be used for on-chain governance. The number you set can be an arbitrary value, and is only used in relation to other NFTs in this collection.`}
          tooltip={
            <Trans>
              If you use the default governance option (no governance), voting
              weights will still be accessible on the blockchain for use in
              Snapshot strategies or any other desired purpose.
            </Trans>
          }
          rules={[
            inputIsIntegerRule({
              label: t`Voting weight`,
              stringOkay: true,
            }),
          ]}
        >
          <FormattedNumberInput />
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
          <PrefixedInput prefix="https://" />
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
