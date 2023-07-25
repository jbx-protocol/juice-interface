import { CrownOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Checkbox, Form } from 'antd'
import { FormInstance, FormProps, useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import EthereumAddress from 'components/EthereumAddress'
import Sticker from 'components/icons/Sticker'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { AttachStickerModal } from 'components/modals/AttachStickerModal'
import Paragraph from 'components/Paragraph'
import { Parenthesis } from 'components/Parenthesis'
import { StickerSelection } from 'components/Project/StickerSelection'
import TooltipIcon from 'components/TooltipIcon'
import { ProjectPreferences } from 'constants/projectPreferences'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useContext, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { isZeroAddress } from 'utils/address'
import { classNames } from 'utils/classNames'
import { formatWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { weightAmountPermyriad } from 'utils/v2v3/math'
import { useNftRewardTiersToMint } from './hooks/useNftRewardTiersToMint.tsx'
import { NftRewardCell } from './NftRewardCell'
import { TCCheckboxContent } from './TCCheckboxContent'

export interface V2V3PayFormType {
  memo?: string
  beneficiary?: string
  stickerUrls?: string[]
  uploadedImage?: string
  preferClaimedTokens?: boolean
}

export const V2V3PayForm = ({
  weiAmount,
  form,
  ...props
}: {
  weiAmount: BigNumber | undefined
  form: FormInstance<V2V3PayFormType>
} & FormProps) => {
  const { fundingCycle, fundingCycleMetadata, tokenSymbol } =
    useContext(V2V3ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)

  const hasIssuedTokens = useProjectHasErc20()
  const nftRewardTiers = useNftRewardTiersToMint()
  const converter = useCurrencyConverter()
  const usdAmount = converter.weiToUsd(weiAmount)

  const beneficiary = useWatch('beneficiary', form)
  const stickerUrls = useWatch('stickerUrls', form)

  const hasStickers = (stickerUrls ?? []).length > 0
  const canAddMoreStickers =
    (stickerUrls ?? []).length < ProjectPreferences.MAX_IMAGES_PAYMENT_MEMO

  const tokensReceived = weightAmountPermyriad(
    fundingCycle?.weight,
    fundingCycleMetadata?.reservedRate?.toNumber(),
    weiAmount,
    'payer',
  )
  const tokensReceivedFormatted =
    formatWad(tokensReceived, { precision: 2 }) ?? '0'
  const tokensText = tokenSymbolText({
    tokenSymbol,
    plural: parseFloat(tokensReceived) !== 1,
  })

  return (
    <>
      <Form form={form} layout="vertical" {...props}>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-6">
            <div className="flex justify-between">
              <span className="font-medium">
                <Trans>Amount:</Trans>
              </span>
              <span>
                <ETHAmount amount={weiAmount} />{' '}
                <Parenthesis>
                  <USDAmount amount={parseWad(usdAmount)} />
                </Parenthesis>
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-medium">
                <Trans>Receive:</Trans>
              </span>
              <div className="text-right">
                <div className="inline-flex items-baseline">
                  <Form.Item
                    hidden={!customBeneficiaryEnabled}
                    className="w-full"
                    name="beneficiary"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || !isAddress(value)) {
                            return Promise.reject('Address is required')
                          }
                          if (isZeroAddress(value)) {
                            return Promise.reject('Cannot use zero address')
                          }
                          return Promise.resolve()
                        },
                        validateTrigger: 'onCreate',
                        required: true,
                      },
                    ]}
                  >
                    <EthAddressInput />
                  </Form.Item>

                  {beneficiary && !customBeneficiaryEnabled && (
                    <EthereumAddress address={beneficiary} />
                  )}

                  {customBeneficiaryEnabled ? (
                    <Button
                      className="pr-0"
                      type="text"
                      size="small"
                      onClick={() => setCustomBeneficiaryEnabled(false)}
                    >
                      <Trans>Save</Trans>
                    </Button>
                  ) : (
                    <Button
                      className="pr-0"
                      size="small"
                      type="text"
                      onClick={() => setCustomBeneficiaryEnabled(true)}
                    >
                      {beneficiary ? (
                        <Trans>Edit</Trans>
                      ) : (
                        <Trans>Choose wallet</Trans>
                      )}
                    </Button>
                  )}
                </div>
                <div>
                  {tokensReceivedFormatted} {tokensText}
                </div>
                {nftRewardTiers?.length ? (
                  <div className="py-3">
                    <NftRewardCell nftRewards={nftRewardTiers} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Form.Item
              label={t`Message`}
              className="antd-no-number-handler mb-4"
              requiredMark="optional"
            >
              <Form.Item className="mb-0" name="memo">
                <JuiceTextArea
                  placeholder={t`Attach an on-chain message to this payment.`}
                  maxLength={256}
                  onPressEnter={e => e.preventDefault()} // prevent new lines in memo
                  showCount
                  autoSize
                />
              </Form.Item>
              <div className="absolute right-2 top-1.5 text-sm">
                {
                  <Sticker
                    className={classNames(
                      'text-grey-500 hover:text-grey-700 dark:text-grey-300 hover:dark:text-grey-400',
                      canAddMoreStickers
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed',
                    )}
                    size={20}
                    onClick={() => {
                      canAddMoreStickers
                        ? setAttachStickerModalVisible(true)
                        : undefined
                    }}
                    role="button"
                  />
                }
              </div>
            </Form.Item>

            <Form.Item
              name="stickerUrls"
              className={twJoin('mb-0', !hasStickers ? 'hidden' : '')}
            >
              <StickerSelection />
            </Form.Item>

            <Form.Item name="uploadedImage" className="mb-0">
              <FormImageUploader text={t`Add image`} />
            </Form.Item>
          </div>

          {projectMetadata?.payDisclosure && (
            <Callout.Info
              icon={<CrownOutlined className="text-2xl" />}
              className="border border-solid border-grey-200 dark:border-grey-400"
            >
              <strong className="block">
                <Trans>Notice from {projectMetadata.name}</Trans>
              </strong>
              <Paragraph
                className="text-sm"
                description={projectMetadata.payDisclosure}
              />
            </Callout.Info>
          )}

          <div className="flex w-full flex-col gap-y-2">
            {hasIssuedTokens && (
              <Form.Item
                name="preferClaimedTokens"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox className="font-normal">
                  <Trans>Receive ERC-20 tokens</Trans>{' '}
                  <TooltipIcon
                    tip={
                      <Trans>
                        Mint this project's ERC-20 tokens to your wallet. Leave
                        unchecked to have Juicebox track your token balance,
                        saving gas on this transaction. You can claim your
                        ERC-20 tokens later.
                      </Trans>
                    }
                  ></TooltipIcon>
                </Checkbox>
              </Form.Item>
            )}
            <Form.Item
              className="mb-0"
              name="riskCheckbox"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(t`You must review and accept the risks.`),
                        ),
                },
              ]}
            >
              <Checkbox>
                <TCCheckboxContent />
              </Checkbox>
            </Form.Item>
            {projectMetadata?.payDisclosure ?? (
              <Form.Item
                className="mb-0"
                name="disclosureCheckbox"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              t`You must understand and accept this project's notice.`,
                            ),
                          ),
                  },
                ]}
              >
                <Checkbox>
                  <Trans>I understand and accept this project's notice.</Trans>
                </Checkbox>
              </Form.Item>
            )}
          </div>
        </div>
      </Form>

      <AttachStickerModal
        open={attachStickerModalVisible}
        onClose={() => setAttachStickerModalVisible(false)}
        onSelect={sticker => {
          if (typeof window === 'undefined') {
            return
          }
          const url = new URL(`${window.location.origin}${sticker.filepath}`)
          const urlString = url.toString()

          const existingStickerUrls = (form.getFieldValue('stickerUrls') ??
            []) as string[]
          const updatedStickerUrls = [...existingStickerUrls, urlString]

          form.setFieldsValue({
            stickerUrls: updatedStickerUrls,
          })
        }}
      />
    </>
  )
}
