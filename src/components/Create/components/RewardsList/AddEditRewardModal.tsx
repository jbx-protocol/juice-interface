import {
  CloseCircleFilled,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Progress, Space, Tooltip } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { JuiceSwitch } from 'components/JuiceSwitch'
import PrefixedInput from 'components/PrefixedInput'
import { UploadNoStyle } from 'components/UploadNoStyle'
import { ThemeContext } from 'contexts/themeContext'
import { usePinFileToIpfs } from 'hooks/PinFileToIpfs'
import { useWallet } from 'hooks/Wallet'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { useCallback, useContext, useEffect, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { restrictedIpfsUrl } from 'utils/ipfs'
import { v4 } from 'uuid'
import { CreateButton } from 'components/CreateButton'
import {
  inputIsValidUrlRule,
  inputNonZeroRule,
  inputMustExistRule,
  inputMustBeEthAddressRule,
  inputIsIntegerRule,
} from 'utils/antd-rules'
import { CreateCollapse } from '../CreateCollapse'
import { OptionalHeader } from '../OptionalHeader'
import { RewardImage } from '../RewardImage'
import { Reward } from './types'

interface AddEditRewardModalFormProps {
  imgUrl: string
  rewardName: string
  description?: string | undefined
  minimumContribution?: string | undefined
  maxSupply?: string | undefined
  nftReservedRate?: number | undefined
  beneficiary?: string | undefined
  votingWeight?: number | undefined
  externalUrl?: string | undefined
}

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [form] = Form.useForm<AddEditRewardModalFormProps>()
  const [limitedSupply, setLimitedSupply] = useState<boolean>(false)
  const [isReservingNfts, setIsReservingNfts] = useState<boolean>(false)
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<boolean>(false)

  const pinFileToIpfs = usePinFileToIpfs()
  const wallet = useWallet()

  useEffect(() => {
    if (!open) return

    if (!editingData) {
      setLimitedSupply(false)
      return
    }

    setLimitedSupply(!!editingData.maximumSupply)
    setIsReservingNfts(!!editingData.beneficiary && !!editingData.reservedRate)
    form.setFieldsValue({
      imgUrl: editingData.imgUrl.toString(),
      rewardName: editingData.title,
      description: editingData.description,
      minimumContribution: editingData.minimumContribution.toString(),
      maxSupply: editingData.maximumSupply?.toString(),
      externalUrl: editingData.url,
      beneficiary: editingData.beneficiary,
      nftReservedRate: editingData.reservedRate,
      votingWeight: editingData.votingWeight,
    })
  }, [editingData, form, open])

  // Due to the way antd works, if advanced options are set, we need to open it on load
  useEffect(() => {
    const openAdvancedOptions =
      !!editingData?.reservedRate ||
      !!editingData?.beneficiary ||
      !!editingData?.votingWeight ||
      !!editingData?.url

    setAdvancedOptionsOpen(openAdvancedOptions)
  }, [
    open,
    editingData?.beneficiary,
    editingData?.reservedRate,
    editingData?.url,
    editingData?.votingWeight,
  ])

  const onCollapseChanged = useCallback((key: string | string[]) => {
    const isAdvancedOptionsOpen =
      typeof key === 'string' ? key === '0' : key.includes('0')
    setAdvancedOptionsOpen(isAdvancedOptionsOpen)
  }, [])

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    const result: Reward = {
      id: editingData?.id ?? v4(),
      title: fields.rewardName,
      minimumContribution: parseFloat(fields.minimumContribution ?? '0'),
      description: fields.description,
      maximumSupply: fields.maxSupply ? parseInt(fields.maxSupply) : undefined,
      url: fields.externalUrl ? `https://${fields.externalUrl}` : undefined,
      imgUrl: fields.imgUrl,
      beneficiary: fields.beneficiary,
      reservedRate: fields.nftReservedRate,
      votingWeight: fields.votingWeight
        ? parseInt(fields.votingWeight.toString())
        : undefined,
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
          name="imgUrl"
          label={t`Image file`}
          extra={t`Image will be cropped to a 1:1 square in thumbnail previews on the Juicebox app.`}
          required
          rules={[inputMustExistRule({ label: t`Image file` })]}
        >
          <UploadNoStyle
            sizeLimit={100 * 1024 * 1024} // 100 MB
            supportedFileTypes={
              new Set(['image/jpeg', 'image/png', 'image/gif'])
            }
            beforeUpload={onBeforeUpload}
            customRequest={onCustomRequest}
            listType="picture-card" // Tried to do away with styling, but need this -.-
          >
            {({ uploadUrl, isUploading, undo, percent }) => {
              if (isUploading) {
                return (
                  <div>
                    <Progress
                      width={48}
                      className="h-8 w-8"
                      strokeColor={colors.background.action.primary}
                      type="circle"
                      percent={percent}
                      format={percent => (
                        <div className="text-black dark:text-grey-200">
                          {percent ?? 0}%
                        </div>
                      )}
                    />
                  </div>
                )
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
        <CreateCollapse
          activeKey={advancedOptionsOpen ? ['0'] : []}
          onChange={onCollapseChanged}
        >
          <CreateCollapse.Panel
            header={<OptionalHeader header={t`Advanced options`} />}
            key={0}
            hideDivider
          >
            <Form.Item
              extra={
                <span className="text-xs">
                  <Trans>Set aside a percentage of freshly minted NFTs.</Trans>
                </span>
              }
            >
              <JuiceSwitch
                value={isReservingNfts}
                onChange={setIsReservingNfts}
                label={
                  <span className="flex items-center gap-2">
                    <Trans>Reserved NFTs</Trans>
                    <Tooltip
                      className="cursor-help text-grey-500 dark:text-grey-300"
                      title={t`If Reserved NFTs are set, the first reserved NFT from the tier will be distributable once the tier receives its first mint.`}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
              />
            </Form.Item>
            {isReservingNfts && (
              <>
                <span className="mb-4 flex flex-col gap-2 whitespace-nowrap md:flex-row md:items-center">
                  <Trans>Reserve 1 NFT of every</Trans>
                  <div className="max-w-[78px]">
                    <Form.Item
                      className="mb-0"
                      name="nftReservedRate"
                      rules={[
                        inputMustExistRule(),
                        inputIsIntegerRule({
                          stringOkay: true,
                        }),
                      ]}
                    >
                      <FormattedNumberInput min={2} placeholder="0" />
                    </Form.Item>
                  </div>{' '}
                  <Trans>NFTs minted for:</Trans>
                </span>
                <Form.Item
                  className="mb-8"
                  name="beneficiary"
                  label={t`Ethereum wallet address`}
                  extra={t`Reserved NFTs will be sent to this address once minted.`}
                  rules={[
                    inputMustExistRule({ label: t`Wallet address` }),
                    inputMustBeEthAddressRule({ label: t`Wallet address` }),
                  ]}
                >
                  <EthAddressInput />
                </Form.Item>
              </>
            )}
            <Form.Item
              name="votingWeight"
              label={t`Voting weight`}
              extra={t`Give this NFT a voting weight to be used for on-chain governance. The number you set is only used in relation to other NFTs in this collection.`}
              tooltip={
                <Trans>
                  If you use the default governance option (no governance), the
                  voting weight will still be accessible on the blockchain for
                  use in Snapshot strategies or any other desired purpose.
                </Trans>
              }
              rules={[
                inputIsIntegerRule({
                  label: t`Voting weight`,
                  stringOkay: true,
                }),
              ]}
            >
              <FormattedNumberInput placeholder="300" />
            </Form.Item>
            <Form.Item
              name="externalUrl"
              label={t`External link`}
              tooltip={t`Link minters of this NFT to your project's website, Discord, etc.`}
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
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Form>
    </Modal>
  )
}

const UploadButton = () => {
  return (
    <CreateButton icon={<UploadOutlined />} className="h-24 w-full">
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
  return (
    <div className="flex justify-center bg-smoke-200 py-2 dark:bg-slate-600">
      <div className="relative">
        <RewardImage className="h-[11.5rem] w-[11.5rem]" src={imageUrl} />
        <CloseCircleFilled
          className="absolute top-0 right-0 cursor-pointer text-2xl text-haze-400"
          // TODO: We require @tailwind base to do this in className, so use style for now
          style={{ transform: 'translate(50%, -50%)' }}
          onClick={stopPropagation(onRemoveImageClicked)}
        />
      </div>
    </div>
  )
}
