import { CrownOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { FormInstance, FormProps, useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import Sticker from 'components/icons/Sticker'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { AttachStickerModal } from 'components/modals/AttachStickerModal'
import Paragraph from 'components/Paragraph'
import { StickerSelection } from 'components/Project/StickerSelection'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import TooltipIcon from 'components/TooltipIcon'
import { ProjectPreferences } from 'constants/projectPreferences'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { isAddress } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectHasErc20 } from 'hooks/v2v3/ProjectHasErc20'
import { useContext, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { classNames } from 'utils/classNames'
import { formattedNum, formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD
} from 'utils/v2v3/currency'
import {
  getUnsafeV2V3FundingCycleProperties,
  getV2V3FundingCycleRiskCount
} from 'utils/v2v3/fundingCycle'
import { weightAmountPermyriad } from 'utils/v2v3/math'
import { useNftRewardTiersToMint } from './hooks/NftRewardTiersToMint'
import { NftRewardCell } from './NftRewardCell'

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
  const [riskModalVisible, setRiskModalVisible] = useState<boolean>()
  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  const beneficiary = useWatch('beneficiary', form)

  const stickerUrls = useWatch('stickerUrls', form)

  const riskCount =
    fundingCycle && fundingCycleMetadata
      ? getV2V3FundingCycleRiskCount(fundingCycle, fundingCycleMetadata)
      : undefined

  const hasIssuedTokens = useProjectHasErc20()
  const canAddMoreStickers =
    (stickerUrls ?? []).length < ProjectPreferences.MAX_IMAGES_PAYMENT_MEMO

  const reservedRate = fundingCycleMetadata?.reservedRate?.toNumber()

  const receivedTickets = weightAmountPermyriad(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'payer',
  )

  const tokenText = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  const nftRewardTiers = useNftRewardTiersToMint()

  return (
    <>
      <Form form={form} layout="vertical" {...props}>
      <div className="flex flex-col gap-6">
          <div>
          <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-between">
                <div className="font-bold">
                  <Trans>Amount:</Trans>
                </div>
                <div>
                  {formattedNum(usdAmount)}{' '}
                  {V2V3CurrencyName(V2V3_CURRENCY_USD)} ({formatWad(weiAmount)}{' '}
                  {V2V3CurrencyName(V2V3_CURRENCY_ETH)})
                </div>
              </div>

              <div className="flex justify-between">
                <div className="font-bold">
                  <Trans>Receive:</Trans>
                </div>
                <div className="text-right">
                  {formatWad(receivedTickets, { precision: 0 })} {tokenText}
                  {nftRewardTiers?.length ? (
                    <div className="py-3">
                      <NftRewardCell nftRewards={nftRewardTiers} />
                    </div>
                  ) : null}
                  <div className="flex items-baseline">
                    {customBeneficiaryEnabled ? (
                      <Button
                        type="text"
                        size="small"
                        onClick={() => setCustomBeneficiaryEnabled(false)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        type="text"
                        onClick={() => {
                          form.setFieldValue('beneficiary', undefined)

                          setCustomBeneficiaryEnabled(true)
                        }}
                      >
                        {beneficiary ? 'Edit' : 'Choose wallet'}
                      </Button>
                    )}

                    <Form.Item
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
                      <EthAddressInput disabled={!customBeneficiaryEnabled} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {hasIssuedTokens && (
            <Form.Item
              name="preferClaimedTokens"
              valuePropName="checked"
              className="m-0"
              extra={
                <Trans>Mint this project's ERC-20 tokens to your wallet.</Trans>
              }
            >
              <Checkbox>
                <Trans>Receive ERC-20 tokens</Trans>{' '}
                <TooltipIcon
                  tip={
                    <Trans>
                      Automatically receive this project's ERC-20 tokens. Leave
                      unchecked to have Juicebox track your token balance,
                      saving gas on this transaction. You can claim your ERC-20
                      tokens later.
                    </Trans>
                  }
                ></TooltipIcon>
              </Checkbox>
            </Form.Item>
          )}

          <Form.Item
            label={t`Message (optional)`}
            className="antd-no-number-handler mb-0"
          >
            <Form.Item className="mb-0" name="memo">
              <Input.TextArea
                placeholder={t`Attach an on-chain message to this payment.`}
                maxLength={256}
                onPressEnter={e => e.preventDefault()} // prevent new lines in memo
                showCount
                autoSize
              />
            </Form.Item>
            <div className="absolute right-2 top-2 text-sm">
              {
                <Sticker
                  className={classNames(
                    'text-grey-500 dark:text-grey-300',
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
                />
              }
            </div>
          </Form.Item>

          <div>
            <Form.Item name="stickerUrls">
              <StickerSelection />
            </Form.Item>

            <Form.Item name="uploadedImage">
              <FormImageUploader text={t`Add image`} />
            </Form.Item>
          </div>

          {projectMetadata?.payDisclosure && (
            <Callout.Info
              icon={<CrownOutlined className="text-2xl" />}
              className="border border-solid border-grey-200 dark:border-grey-400"
            >
              <strong className="block">
                <Trans>Message from {projectMetadata.name}</Trans>
              </strong>
              <Paragraph
                className="text-sm"
                description={projectMetadata.payDisclosure}
              />
            </Callout.Info>
          )}

          {riskCount && fundingCycle ? (
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
                <span className="uppercase">
                  <Trans>
                    I accept this project's{' '}
                    <a
                      onClick={e => {
                        setRiskModalVisible(true)
                        e.preventDefault()
                      }}
                    >
                      unique risks
                    </a>
                    .
                  </Trans>
                </span>
              </Checkbox>
            </Form.Item>
          ) : null}
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
      <Modal
        title={<Trans>Potential risks</Trans>}
        open={riskModalVisible}
        okButtonProps={{ hidden: true }}
        onCancel={() => setRiskModalVisible(false)}
        cancelText={<Trans>Close</Trans>}
      >
        {fundingCycle && fundingCycleMetadata && (
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV2V3FundingCycleProperties(
              fundingCycle,
              fundingCycleMetadata,
            )}
          />
        )}
      </Modal>
    </>
  )
}
