import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Space, Switch } from 'antd'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { isAddress } from 'ethers/lib/utils'
import { useState } from 'react'

interface CustomBeneficiaryInputProps {
  form: FormInstance
  labelText: string
}

const CustomBeneficiaryInput = ({
  form,
  labelText,
}: CustomBeneficiaryInputProps) => {
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState(false)

  const validateCustomBeneficiary = () => {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!beneficiary) {
      return Promise.reject(t`Address required`)
    } else if (!isAddress(beneficiary)) {
      return Promise.reject(t`Invalid address`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item extra={labelText}>
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
              validator: validateCustomBeneficiary,
            },
          ]}
        >
          <EthAddressInput />
        </Form.Item>
      )}
    </Form.Item>
  )
}

export default CustomBeneficiaryInput
