import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Input, Space, Switch } from 'antd'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { MinimalCollapse } from 'components/MinimalCollapse'
import TooltipLabel from 'components/TooltipLabel'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext, useState } from 'react'

import type { AdvancedOptionsFields } from './LaunchProjectPayerModal'

const defaultAdvancedOptions: AdvancedOptionsFields = {
  memo: '',
  memoImageUrl: undefined,
  tokenMintingEnabled: true,
  preferClaimed: false,
  customBeneficiaryAddress: undefined,
}

export default function AdvancedOptionsCollapse({
  form,
}: {
  form: FormInstance<AdvancedOptionsFields>
}) {
  const { tokenAddress } = useContext(V2ProjectContext)

  // need state for this field to update dom
  const [tokenMintingEnabled, setTokenMintingEnabled] = useState<boolean>(
    form.getFieldValue('tokenMintingEnabled') === false ? false : true,
  )

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(Boolean(form.getFieldValue('customBeneficiaryAddress')))

  const switchMargin = '1rem'

  return (
    <MinimalCollapse header={<Trans>Advanced (optional)</Trans>}>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        <Form form={form} initialValues={defaultAdvancedOptions}>
          <div>
            <TooltipLabel
              label={t`Payment memo`}
              tip={
                <Trans>
                  The onchain memo for each payment made to this address. The
                  project's payment feed will include the memo alongside the
                  payment.
                </Trans>
              }
            />
            <Form.Item name={'memo'}>
              <Input
                type="string"
                autoComplete="off"
                style={{ marginTop: 5 }}
              />
            </Form.Item>
            <Form.Item name={'memoImageUrl'}>
              <FormImageUploader text={t`Add image`} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <TooltipLabel
              label={t`Token minting enabled`}
              tip={t`Determines whether tokens will be minted from payments to this address.`}
            />
            <Form.Item
              name={'tokenMintingEnabled'}
              initialValue={tokenMintingEnabled}
            >
              <Switch
                onChange={setTokenMintingEnabled}
                checked={tokenMintingEnabled}
                style={{ marginLeft: switchMargin }}
              />
            </Form.Item>
          </div>
          {tokenMintingEnabled &&
          tokenAddress &&
          tokenAddress !== constants.AddressZero ? (
            <div style={{ display: 'flex' }}>
              <TooltipLabel
                label={t`Mint tokens as ERC-20`}
                tip={
                  <Trans>
                    When checked, payments to this address will mint this
                    project's ERC-20 tokens to the beneficiary's wallet.
                    Payments will cost more gas. When unchecked, Juicebox will
                    track the beneficiary's new tokens when they pay. The
                    beneficiary can claim their ERC-20 tokens at any time.
                  </Trans>
                }
              />
              <Form.Item name={'preferClaimed'} valuePropName="checked">
                <Switch style={{ marginLeft: switchMargin }} />
              </Form.Item>
            </div>
          ) : null}

          {tokenMintingEnabled ? (
            <div
              style={{
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <TooltipLabel
                label={t`Custom token beneficiary`}
                tip={
                  <Trans>
                    By default, newly minted tokens will go to the wallet who
                    sends funds to the address. You can enable this to set the
                    token beneficiary to a custom address.
                  </Trans>
                }
              />
              <Switch
                onChange={checked => {
                  setCustomBeneficiaryEnabled(checked)
                  if (!checked) {
                    form.setFieldsValue({ customBeneficiaryAddress: undefined })
                  }
                }}
                checked={customBeneficiaryEnabled}
                style={{ marginLeft: switchMargin }}
              />
            </div>
          ) : null}
          {tokenMintingEnabled && customBeneficiaryEnabled ? (
            <EthAddressInput
              value={form.getFieldValue('customBeneficiaryAddress')}
              onChange={value =>
                form.setFieldsValue({ customBeneficiaryAddress: value })
              }
            />
          ) : null}
        </Form>
      </Space>
    </MinimalCollapse>
  )
}
