import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Input, Modal, Space, Switch } from 'antd'
import { FormInstance, FormProps, useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import Sticker from 'components/icons/Sticker'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { AttachStickerModal } from 'components/modals/AttachStickerModal'
import { StickerSelection } from 'components/Project/StickerSelection'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import TooltipIcon from 'components/TooltipIcon'
import { ProjectPreferences } from 'constants/projectPreferences'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { isAddress } from 'ethers/lib/utils'
import { NftRewardTier } from 'models/nftRewardTier'
import { useContext, useEffect, useState } from 'react'
import { classNames } from 'utils/classNames'
import {
  getUnsafeV2V3FundingCycleProperties,
  getV2V3FundingCycleRiskCount,
} from 'utils/v2v3/fundingCycle'

export interface V2V3PayFormType {
  memo?: string
  beneficiary?: string
  stickerUrls?: string[]
  uploadedImage?: string
  preferClaimedTokens?: boolean
}

export const V2V3PayForm = ({
  form,
  nftRewardTiers,
  ...props
}: {
  form: FormInstance<V2V3PayFormType>
  nftRewardTiers: NftRewardTier[] | undefined
} & FormProps) => {
  const { tokenAddress, fundingCycle, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)
  const [riskModalVisible, setRiskModalVisible] = useState<boolean>()

  const stickerUrls = useWatch('stickerUrls', form)

  const riskCount =
    fundingCycle && fundingCycleMetadata
      ? getV2V3FundingCycleRiskCount(fundingCycle, fundingCycleMetadata)
      : undefined

  const hasIssuedTokens = tokenAddress !== constants.AddressZero
  const canAddMoreStickers =
    (stickerUrls ?? []).length < ProjectPreferences.MAX_IMAGES_PAYMENT_MEMO

  useEffect(() => {
    const initialStickerUrls = nftRewardTiers?.map(
      (tier: NftRewardTier) => tier.imageUrl,
    )
    form.setFieldsValue({ stickerUrls: initialStickerUrls })
  })

  return (
    <>
      <Form form={form} layout="vertical" {...props}>
        <Space direction="vertical" size="large">
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
                      Leave unchecked to have Juicebox track your token balance,
                      saving gas on this transaction. You can claim your ERC-20
                      tokens later.
                    </Trans>
                  }
                ></TooltipIcon>
              </Checkbox>
            </Form.Item>
          )}

          <MinimalCollapse
            header={<Trans>Payment options</Trans>}
            defaultOpen={Boolean(nftRewardTiers?.length)}
          >
            <Form.Item
              label={t`Memo (optional)`}
              className="antd-no-number-handler mb-0"
            >
              <Form.Item
                className="mb-0"
                name="memo"
                extra={t`Add an on-chain memo to this payment.`}
              >
                <Input.TextArea
                  placeholder={t`WAGMI!`}
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

            <Form.Item name="stickerUrls">
              <StickerSelection />
            </Form.Item>

            <Form.Item name="uploadedImage">
              <FormImageUploader text={t`Add image`} />
            </Form.Item>

            <Form.Item extra={t`Mint tokens to a custom address.`}>
              <Space>
                <Switch
                  checked={customBeneficiaryEnabled}
                  onChange={setCustomBeneficiaryEnabled}
                />
                <span className="font-medium text-black dark:text-slate-100">
                  <Trans>Custom token beneficiary</Trans>
                </span>
              </Space>
              {customBeneficiaryEnabled && (
                <Form.Item
                  className="mt-4 mb-0"
                  name="beneficiary"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || !isAddress(value)) {
                          return Promise.reject('Address is required')
                        }
                        if (value === constants.AddressZero) {
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
              )}
            </Form.Item>
          </MinimalCollapse>

          {projectMetadata && (
            <Callout.Info>
              <Trans>
                Paying <strong>{projectMetadata.name}</strong> is not an
                investment — it's a way to support the project.{' '}
                <strong>{projectMetadata.name}</strong> determines any value or
                utility of the tokens you receive.
              </Trans>
            </Callout.Info>
          )}

          {riskCount && fundingCycle ? (
            <Form.Item
              className="mb-0 border border-solid border-grey-300 p-4 dark:border-slate-200"
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
                <Trans>
                  I accept this project's{' '}
                  <a
                    onClick={e => {
                      setRiskModalVisible(true)
                      e.preventDefault()
                    }}
                  >
                    risks
                  </a>
                  .
                </Trans>
              </Checkbox>
            </Form.Item>
          ) : null}
        </Space>
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
          form.setFieldsValue({
            stickerUrls: existingStickerUrls.concat(urlString),
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
