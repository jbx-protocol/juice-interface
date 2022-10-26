import {
  CloseCircleFilled,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Form, Input, Modal, Space } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { UploadNoStyle } from 'components/UploadNoStyle'
import { ThemeContext } from 'contexts/themeContext'
import { pinFileToIpfs } from 'lib/api/ipfs'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { restrictedIpfsUrl } from 'utils/ipfs'
import { v4 } from 'uuid'
import { CreateButton } from '../CreateButton'
import { inputMustExistRule } from '../pages'
import { inputAlreadyExistsRule } from '../pages/utils/rules/inputAlreadyExistsRule'
import { inputIsValidUrlRule } from '../pages/utils/rules/inputIsValidUrlRule'
import { inputNonZeroRule } from '../pages/utils/rules/inputNonZeroRule'
import { RewardImage } from '../RewardImage'
import { RewardsList } from './RewardsList'
import { Reward } from './types'

interface AddEditRewardModalFormProps {
  imgUrl: string
  rewardName: string
  description?: string | undefined
  minimumContribution?: string | undefined
  maxSupply?: number | undefined
  externalUrl?: string | undefined
}

export const AddEditRewardModal = ({
  editingData,
  open,
  onOk,
  onCancel,
}: {
  editingData?: Reward | undefined
  open?: boolean
  onOk: (reward: Reward) => void
  onCancel: VoidFunction
}) => {
  const { rewards } = RewardsList.useRewardsInstance()
  const existingMinimumContributions = useMemo(
    () =>
      rewards
        .filter(r => r.id !== editingData?.id)
        .map(({ minimumContribution }) => minimumContribution.toString()),
    [editingData?.id, rewards],
  )
  const [form] = Form.useForm<AddEditRewardModalFormProps>()
  const [limitedSupply, setLimitedSupply] = useState<boolean>(false)

  useEffect(() => {
    if (!open) return

    if (!editingData) {
      setLimitedSupply(false)
      return
    }

    setLimitedSupply(!!editingData.maximumSupply)
    form.setFieldsValue({
      imgUrl: editingData.imgUrl.toString(),
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
      imgUrl: fields.imgUrl,
    }
    onOk(result)
    form.resetFields()
  }, [editingData?.id, form, onOk])

  const onModalCancel = useCallback(() => {
    onCancel()
    form.resetFields()
  }, [form, onCancel])

  const onCustomRequest = useCallback(async (file: File | string | Blob) => {
    const res = await pinFileToIpfs(file)
    const url = restrictedIpfsUrl(res.IpfsHash)
    return url
  }, [])

  const isEditing = !!editingData
  return (
    <Modal
      title={<h2>{isEditing ? t`Edit NFT Reward` : t`Add NFT Reward`}</h2>}
      okText={isEditing ? t`Save reward` : t`Add reward`}
      open={open}
      onOk={onModalOk}
      onCancel={onModalCancel}
      destroyOnClose
    >
      <Form form={form} preserve={false} colon={false} layout="vertical">
        <Form.Item
          name="imgUrl"
          label={t`Image file`}
          extra={t`Image will be cropped to a 1:1 square in thumbnail previews on the Juicebox app.`}
          required
          rules={[inputMustExistRule({ label: t`Image file` })]}
        >
          <UploadNoStyle
            sizeLimit={5 * 1024 * 1024}
            supportedFileTypes={
              new Set(['image/jpeg', 'image/png', 'image/gif'])
            }
            customRequest={onCustomRequest}
            listType="picture-card" // Tried to do away with styling, but need this -.-
          >
            {({ uploadUrl, isUploading, undo }) => {
              if (isUploading) {
                return <LoadingOutlined />
              }
              if (uploadUrl === undefined) {
                return <UploadButton />
              }
              return (
                <UploadedImage
                  imageUrl={uploadUrl}
                  onRemoveImageClicked={undo}
                />
              )
            }}
          </UploadNoStyle>
        </Form.Item>
        <Form.Item
          name="rewardName"
          label={t`Name`}
          required
          rules={[inputMustExistRule({ label: t`Name` })]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label={t`Description`}>
          <Input.TextArea
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
            inputAlreadyExistsRule({
              inputs: existingMinimumContributions,
              msg: t`A tier at this amount already exists`,
            }),
          ]}
        >
          <FormattedNumberInput
            style={{ width: '50%' }}
            accessory={<InputAccessoryButton content="ETH" />}
          />
        </Form.Item>
        <Form.Item>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
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
          <Input prefix="https://" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const UploadButton = () => {
  return (
    <CreateButton
      icon={<UploadOutlined />}
      style={{
        height: '6rem',
        width: '100%',
      }}
    >
      Upload image
    </CreateButton>
  )
}

const UploadedImage = ({
  imageUrl,
  onRemoveImageClicked,
}: {
  imageUrl: string
  onRemoveImageClicked?: VoidFunction
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        border: '1px dashed',
        borderColor: colors.stroke.tertiary,
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        backgroundColor: colors.background.l1,
      }}
    >
      <div style={{ position: 'relative' }}>
        <RewardImage size="11.5rem" src={imageUrl} />
        <CloseCircleFilled
          style={{
            cursor: 'pointer',
            color: colors.icon.action.primary,
            fontSize: '1.375rem',
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate(50%, -50%)',
          }}
          onClick={stopPropagation(onRemoveImageClicked)}
        />
      </div>
    </div>
  )
}
