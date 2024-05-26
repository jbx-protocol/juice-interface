import { QuestionCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Tooltip } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import { WarningCallout } from 'components/Callout/WarningCallout'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import PrefixedInput from 'components/inputs/PrefixedInput'
import { NftFileType, UploadNoStyle } from 'components/inputs/UploadNoStyle'
import { VIDEO_FILE_TYPES } from 'constants/fileTypes'
import { DEFAULT_NFT_MAX_SUPPLY } from 'constants/nftRewards'
import { pinFile } from 'lib/api/ipfs'
import random from 'lodash/random'
import { NftRewardTier } from 'models/nftRewards'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  inputIsIntegerRule,
  inputIsValidUrlRule,
  inputMustBeEthAddressRule,
  inputMustExistRule,
  inputNonZeroRule,
} from 'utils/antdRules'
import { withHttps } from 'utils/externalLink'
import { ipfsGatewayUrl } from 'utils/ipfs'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { CreateCollapse } from '../../Create/components/CreateCollapse/CreateCollapse'
import { OptionalHeader } from '../../Create/components/OptionalHeader'

interface AddEditRewardModalFormProps {
  fileUrl: string
  rewardName: string
  description?: string | undefined
  contributionFloor?: string | undefined
  maxSupply?: string | undefined
  nftReservedRate?: number | undefined
  beneficiary?: string | undefined
  votingWeight?: string | undefined
  externalUrl?: string | undefined
}

const NFT_FILE_UPLOAD_EXTRA = (
  <Trans>
    Images will be cropped to a 1:1 square in thumbnail previews on the Juicebox
    app.
  </Trans>
)
const MAX_NFT_FILE_SIZE_MB = 100

// This assumes an existing NFT ID (from the contracts) will never be >= 1000000
export const NEW_NFT_ID_LOWER_LIMIT = 1000000

export const AddEditRewardModal = ({
  className,
  editingData,
  open,
  onOk,
  onCancel,
  withEditWarning = false,
}: {
  className?: string
  editingData?: NftRewardTier | undefined
  open?: boolean
  onOk: (reward: NftRewardTier) => void
  onCancel: VoidFunction
  withEditWarning?: boolean
}) => {
  const [form] = Form.useForm<AddEditRewardModalFormProps>()
  const [limitedSupply, setLimitedSupply] = useState<boolean>(false)
  const [isReservingNfts, setIsReservingNfts] = useState<boolean>(false)
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<boolean>(false)

  const { nftRewards } = useAppSelector(state => state.editingV2Project)
  const nftCurrency = nftRewards?.pricing.currency

  useLayoutEffect(() => {
    if (!open) return
    if (!editingData) {
      setLimitedSupply(false)
      return
    }

    setLimitedSupply(
      !!editingData.maxSupply &&
        editingData.maxSupply !== DEFAULT_NFT_MAX_SUPPLY,
    )
    setIsReservingNfts(!!editingData.beneficiary && !!editingData.reservedRate)

    // Wait for form to be visible before setting values
    setTimeout(() => {
      form.setFieldsValue({
        fileUrl: editingData.fileUrl.toString(),
        rewardName: editingData.name,
        description: editingData.description,
        contributionFloor: editingData.contributionFloor.toString(),
        maxSupply: editingData.maxSupply?.toString(),
        externalUrl: editingData.externalLink,
        beneficiary: editingData.beneficiary,
        nftReservedRate: editingData.reservedRate,
        votingWeight: editingData.votingWeight,
      })
    }, 0)
  }, [editingData, form, open])

  // Due to the way antd works, if advanced options are set, we need to open it on load
  useEffect(() => {
    const openAdvancedOptions =
      !!editingData?.reservedRate ||
      !!editingData?.beneficiary ||
      !!editingData?.votingWeight ||
      !!editingData?.externalLink

    setAdvancedOptionsOpen(openAdvancedOptions)
  }, [
    open,
    editingData?.beneficiary,
    editingData?.reservedRate,
    editingData?.externalLink,
    editingData?.votingWeight,
  ])

  const onCollapseChanged = useCallback((key: string | string[]) => {
    const isAdvancedOptionsOpen =
      typeof key === 'string' ? key === '0' : key.includes('0')
    setAdvancedOptionsOpen(isAdvancedOptionsOpen)
  }, [])

  // Used for frontend to distinguish new tiers from old tiers and other new tiers
  const generateNewTierId = () => {
    return random(NEW_NFT_ID_LOWER_LIMIT, NEW_NFT_ID_LOWER_LIMIT * 10)
  }

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    const remainingAndMaxSupply = fields.maxSupply
      ? parseInt(fields.maxSupply)
      : undefined
    const result: NftRewardTier = {
      id: editingData?.id ?? generateNewTierId(),
      name: fields.rewardName,
      contributionFloor: parseFloat(fields.contributionFloor ?? '0'),
      description: fields.description,
      maxSupply: remainingAndMaxSupply,
      remainingSupply: remainingAndMaxSupply,
      externalLink: withHttps(fields.externalUrl),
      fileUrl: fields.fileUrl,
      beneficiary: fields.beneficiary,
      reservedRate: fields.nftReservedRate,
      votingWeight: fields.votingWeight
        ? fields.votingWeight.toString()
        : undefined,
    }
    onOk(result)
    form.resetFields()
  }, [editingData?.id, form, onOk])

  const onModalCancel = useCallback(() => {
    onCancel()
    form.resetFields()
  }, [form, onCancel])

  const onCustomRequest = useCallback(async (options: UploadRequestOption) => {
    const { file, onProgress } = options
    try {
      const res = await pinFile(file, onProgress)
      if (!res) throw new Error('Failed to pin file to IPFS')
      const url = ipfsGatewayUrl(res.Hash)
      return url
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.onError?.(null as any)
      throw err
    }
  }, [])

  const isEditing = !!editingData

  const supportedNftFileType: NftFileType[] = [
    ...VIDEO_FILE_TYPES,
    'image/jpeg',
    'image/png',
    'image/gif',
  ]

  return (
    <Modal
      className={className}
      title={
        <h2 className="z-20 font-heading text-xl text-black dark:text-grey-200">
          {isEditing ? t`Edit NFT` : t`Add NFT`}
        </h2>
      }
      okText={isEditing ? t`Save NFT` : t`Add NFT`}
      open={open}
      onOk={onModalOk}
      onCancel={onModalCancel}
      destroyOnClose
    >
      {withEditWarning ? (
        <WarningCallout className="mb-4">
          <Trans>
            "Editing" an NFT creates a copy of it. The old version won't be
            available, and the new version will have a new token ID.
          </Trans>
        </WarningCallout>
      ) : null}

      <Form form={form} preserve={false} colon={false} layout="vertical">
        <Form.Item
          name="fileUrl"
          label={t`File`}
          extra={NFT_FILE_UPLOAD_EXTRA}
          required
          rules={[inputMustExistRule({ label: t`File` })]}
        >
          <UploadNoStyle
            sizeLimitMB={MAX_NFT_FILE_SIZE_MB}
            supportedFileTypes={new Set(supportedNftFileType)}
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
          <JuiceTextArea maxLength={10000} showCount />
        </Form.Item>
        <Form.Item
          name="contributionFloor"
          label={t`Minimum Contribution`}
          extra={t`Contributors will receive this NFT when they contribute at least this amount.`}
          required
          rules={[inputMustExistRule({ label: t`Minimum Contribution` })]}
        >
          <FormattedNumberInput
            accessory={
              <InputAccessoryButton
                content={nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'}
              />
            }
          />
        </Form.Item>
        <Form.Item>
          <div className="mt-2 flex flex-col gap-2">
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
          </div>
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
