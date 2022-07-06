import { SmileOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Input, Space, Switch, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { AttachStickerModal } from 'components/modals/AttachStickerModal'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { isAddress } from 'ethers/lib/utils'
import { useContext, useState } from 'react'

import { StickerSelection } from './StickerSelection'

export interface V2PayFormType {
  memo?: string
  beneficiary?: string
  stickerUrls?: string[]
  uploadedImage?: string
  preferClaimed?: boolean
}

export const V2PayForm = ({ form }: { form: FormInstance<V2PayFormType> }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { tokenAddress } = useContext(V2ProjectContext)

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)

  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)

  const hasIssuedTokens = tokenAddress !== constants.AddressZero

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          label={t`Memo (optional)`}
          className={'antd-no-number-handler'}
          extra={t`Add an on-chain memo to this payment.`}
        >
          <Form.Item noStyle name="memo">
            <Input.TextArea
              placeholder={t`WAGMI!`}
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
          <div
            style={{
              fontSize: '.8rem',
              position: 'absolute',
              right: 7,
              top: 7,
            }}
          >
            <Tooltip title={t`Attach a sticker`}>
              <SmileOutlined
                style={{ color: colors.text.secondary }}
                onClick={() => {
                  setAttachStickerModalVisible(true)
                }}
              />
            </Tooltip>
          </div>
          <Form.Item name="stickerUrls">
            <StickerSelection />
          </Form.Item>
        </Form.Item>
        <Form.Item name="uploadedImage">
          <FormImageUploader text={t`Add image`} />
        </Form.Item>
        <Form.Item extra={t`Mint tokens to a custom address.`}>
          <span style={{ color: colors.text.primary, fontWeight: 500 }}>
            <Trans>Custom token beneficiary</Trans>
          </span>
          <Switch
            checked={customBeneficiaryEnabled}
            onChange={setCustomBeneficiaryEnabled}
            style={{ marginLeft: 10 }}
          />
          {customBeneficiaryEnabled && (
            <Form.Item
              noStyle
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
        {hasIssuedTokens ? (
          <Form.Item label={t`Receive ERC-20`}>
            <Space align="start">
              <Checkbox
                style={{ padding: 20 }}
                onChange={e => {
                  form.setFieldsValue({ preferClaimed: e.target.checked })
                }}
              />
              <label htmlFor="preferClaimed">
                <Trans>
                  Check this to mint this project's ERC-20 tokens to your
                  wallet. Leave unchecked to have your token balance tracked by
                  Juicebox, saving gas on this transaction. You can always claim
                  your ERC-20 tokens later.
                </Trans>
              </label>
            </Space>
          </Form.Item>
        ) : null}
      </Form>
      <AttachStickerModal
        visible={attachStickerModalVisible}
        onClose={() => setAttachStickerModalVisible(false)}
        onSelect={sticker => {
          const url = new URL(`${window.location.origin}${sticker.filepath}`)
          const urlString = url.toString()
          const existingStickerUrls = (form.getFieldValue('stickerUrls') ??
            []) as string[]
          form.setFieldsValue({
            stickerUrls: existingStickerUrls.concat(urlString),
          })
        }}
      />
    </>
  )
}
