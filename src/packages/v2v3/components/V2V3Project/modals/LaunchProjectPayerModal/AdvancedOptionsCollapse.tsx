import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Input, Switch } from 'antd'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { MinimalCollapse } from 'components/MinimalCollapse'
import TooltipLabel from 'components/TooltipLabel'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext, useState } from 'react'
import { isZeroAddress } from 'utils/address'

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
  const { tokenAddress } = useContext(V2V3ProjectContext)

  // need state for this field to update dom
  const [tokenMintingEnabled, setTokenMintingEnabled] = useState<boolean>(
    form.getFieldValue('tokenMintingEnabled') === false ? false : true,
  )

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(Boolean(form.getFieldValue('customBeneficiaryAddress')))

  return (
    <MinimalCollapse header={<Trans>Advanced (optional)</Trans>}>
      <div className="flex flex-col gap-4">
        <Form form={form} initialValues={defaultAdvancedOptions}>
          <div>
            <TooltipLabel
              label={t`Payment memo`}
              tip={
                <Trans>
                  The onchain memo for each payment made through this address.
                  The project's payment feed will include the memo alongside the
                  payment.
                </Trans>
              }
            />
            <Form.Item name={'memo'}>
              <Input type="string" autoComplete="off" className="mt-1" />
            </Form.Item>
            <Form.Item name={'memoImageUrl'}>
              <FormImageUploader text={t`Add image`} />
            </Form.Item>
          </div>
          <div className="flex">
            <TooltipLabel
              label={t`Token minting enabled`}
              tip={t`Determines whether tokens will be minted by payments made through this address.`}
            />
            <Form.Item
              name={'tokenMintingEnabled'}
              initialValue={tokenMintingEnabled}
            >
              <Switch
                className="ml-4"
                onChange={setTokenMintingEnabled}
                checked={tokenMintingEnabled}
              />
            </Form.Item>
          </div>
          {tokenMintingEnabled &&
          tokenAddress &&
          !isZeroAddress(tokenAddress) ? (
            <div className="flex">
              <TooltipLabel
                label={t`Mint tokens as ERC-20`}
                tip={
                  <Trans>
                    When checked, payments made through this address will mint
                    the project's ERC-20 tokens. Payments will incur slightly
                    higher gas fees. When unchecked, the Juicebox protocol will
                    internally track the beneficiary's tokens, and they can
                    claim their ERC-20 tokens at any time.
                  </Trans>
                }
              />
              <Form.Item name={'preferClaimed'} valuePropName="checked">
                <Switch className="ml-4" />
              </Form.Item>
            </div>
          ) : null}

          {tokenMintingEnabled ? (
            <div className="mb-2 flex">
              <TooltipLabel
                label={t`Custom token beneficiary`}
                tip={
                  <Trans>
                    If enabled, project tokens will be minted to a custom
                    beneficiary address. By default, project tokens will be
                    minted to the wallet that pays this address.
                  </Trans>
                }
              />
              <Switch
                className="ml-4"
                onChange={checked => {
                  setCustomBeneficiaryEnabled(checked)
                  if (!checked) {
                    form.setFieldsValue({ customBeneficiaryAddress: undefined })
                  }
                }}
                checked={customBeneficiaryEnabled}
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
      </div>
    </MinimalCollapse>
  )
}
