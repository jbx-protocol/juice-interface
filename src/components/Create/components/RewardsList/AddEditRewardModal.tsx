import { t } from '@lingui/macro'
import { Form, Modal, Space } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { JuiceSwitch } from 'components/JuiceSwitch'
import PrefixedInput from 'components/PrefixedInput'
import { SupportedNftFileTypes, UploadNoStyle } from 'components/UploadNoStyle'
import { usePinFileToIpfs } from 'hooks/PinFileToIpfs'
import { useWallet } from 'hooks/Wallet'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { useCallback, useEffect, useState } from 'react'
import { restrictedIpfsUrl } from 'utils/ipfs'
import { v4 } from 'uuid'
import {
  inputIsValidUrlRule,
  inputNonZeroRule,
  inputMustExistRule,
} from 'utils/antd-rules'
import { Reward } from './types'
import { featureFlagEnabled } from 'utils/featureFlags'
import { FEATURE_FLAGS } from 'constants/featureFlags'

interface AddEditRewardModalFormProps {
  fileUrl: string
  rewardName: string
  description?: string | undefined
  minimumContribution?: string | undefined
  maxSupply?: number | undefined
  externalUrl?: string | undefined
}

export const NFT_FILE_UPLOAD_EXTRA = t`NFT will be cropped to a 1:1 square in thumbnail previews on the Juicebox app.`

export const AddEditRewardModal = ({
  className,
  editingData,
  open,
  onOk,
  onCancel,
}: {
  className?: string
  editingData?: Reward | undefined
  open?: boolean
  onOk: (reward: Reward) => void
  onCancel: VoidFunction
}) => {
  const [form] = Form.useForm<AddEditRewardModalFormProps>()
  const [limitedSupply, setLimitedSupply] = useState<boolean>(false)

  const pinFileToIpfs = usePinFileToIpfs()
  const wallet = useWallet()

  useEffect(() => {
    if (!open) return

    if (!editingData) {
      setLimitedSupply(false)
      return
    }

    setLimitedSupply(!!editingData.maximumSupply)
    form.setFieldsValue({
      fileUrl: editingData.fileUrl.toString(),
      rewardName: editingData.title,
      description: editingData.description,
      minimumContribution: editingData.minimumContribution.toString(),
      maxSupply: editingData.maximumSupply,
      externalUrl: editingData.url,
    })
  }, [editingData, form, open])

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    const result: Reward = {
      id: editingData?.id ?? v4(),
      title: fields.rewardName,
      minimumContribution: parseFloat(fields.minimumContribution ?? '0'),
      description: fields.description,
      maximumSupply: fields.maxSupply,
      url: fields.externalUrl ? `https://${fields.externalUrl}` : undefined,
      fileUrl: fields.fileUrl,
    }
    onOk(result)
    form.resetFields()
  }, [editingData?.id, form, onOk])

  const onModalCancel = useCallback(() => {
    onCancel()
    form.resetFields()
  }, [form, onCancel])

  const onCustomRequest = useCallback(
    async (options: UploadRequestOption) => {
      const { file, onProgress } = options
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await pinFileToIpfs({ file, onProgress: onProgress as any })
        if (!res) throw new Error('Failed to pin file to IPFS')
        const url = restrictedIpfsUrl(res.IpfsHash)
        return url
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options.onError?.(null as any)
        throw err
      }
    },
    [pinFileToIpfs],
  )

  const onBeforeUpload = useCallback(async () => {
    let walletConnected = wallet.isConnected
    if (!wallet.isConnected) {
      const connectStates = await wallet.connect()
      walletConnected = connectStates.length > 0
    }
    return walletConnected
  }, [wallet])

  const isEditing = !!editingData

  const nftMp4Enabled = featureFlagEnabled(FEATURE_FLAGS.NFT_MP4)
  const supportedNftFileType: SupportedNftFileTypes[] = [
    ...(nftMp4Enabled ? (['video/mp4'] as SupportedNftFileTypes[]) : []),
    'image/jpeg',
    'image/png',
    'image/gif',
  ]

  return (
    <Modal
      className={className}
      title={
        <h2 className="text-xl font-medium text-black dark:text-grey-200">
          {isEditing ? t`Edit NFT` : t`Add NFT`}
        </h2>
      }
      okText={isEditing ? t`Save NFT` : t`Add NFT`}
      open={open}
      onOk={onModalOk}
      onCancel={onModalCancel}
      destroyOnClose
    >
      <Form form={form} preserve={false} colon={false} layout="vertical">
        <Form.Item
          name="fileUrl"
          label={t`File`}
          extra={NFT_FILE_UPLOAD_EXTRA}
          required
          rules={[inputMustExistRule({ label: t`Image file` })]}
        >
          <UploadNoStyle
            sizeLimit={100 * 1024 * 1024} // 100 MB
            supportedFileTypes={new Set(supportedNftFileType)}
            beforeUpload={onBeforeUpload}
            customRequest={onCustomRequest}
            listType="picture-card" // Tried to do away with styling, but need this -.-
          />
        </Form.Item>
        <Form.Item
          name="rewardName"
          label={t`Name`}
          required
          rules={[inputMustExistRule({ label: t`Name` })]}
        >
          <JuiceInput />
        </Form.Item>
        <Form.Item name="description" label={t`Description`}>
          <JuiceTextArea
            maxLength={256}
            showCount
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item
          name="minimumContribution"
          label={t`Minimum Contribution`}
          extra={t`Contributors will receive this NFT when they contribute at least this amount.`}
          required
          rules={[
            inputMustExistRule({ label: t`Minimum Contribution` }),
            inputNonZeroRule({ label: t`Minimum Contribution` }),
          ]}
        >
          <FormattedNumberInput
            className="w-1/2"
            accessory={<InputAccessoryButton content="ETH" />}
          />
        </Form.Item>
        <Form.Item>
          <Space className="w-full" direction="vertical" size="small">
            <JuiceSwitch
              value={limitedSupply}
              onChange={setLimitedSupply}
              label={t`Limited supply`}
            />
            {limitedSupply && (
              <Form.Item
                name="maxSupply"
                extra={t`The maximum supply of this NFT in circulation.`}
                rules={[
                  inputMustExistRule({ label: t`Max Supply` }),
                  inputNonZeroRule({ label: t`Max Supply` }),
                ]}
              >
                <FormattedNumberInput min={1} />
              </Form.Item>
            )}
          </Space>
        </Form.Item>
        <Form.Item
          name="externalUrl"
          label={t`External link`}
          rules={[
            inputIsValidUrlRule({
              label: t`External link`,
              prefix: 'https://',
              validateTrigger: 'onCreate',
            }),
          ]}
        >
          <PrefixedInput prefix="https://" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
