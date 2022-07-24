import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Space, Switch } from 'antd'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { ThemeContext } from 'contexts/themeContext'
import { isAddress } from 'ethers/lib/utils'
import { useContext, useState } from 'react'

interface CustomBeneficiaryInputProps {
  form: FormInstance
}

const CustomBeneficiaryInput = ({ form }: CustomBeneficiaryInputProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
    <Form.Item extra={t`Mint NFT to a custom address.`}>
      <Space>
        <Switch
          checked={customBeneficiaryEnabled}
          onChange={setCustomBeneficiaryEnabled}
        />
        <span style={{ color: colors.text.primary, fontWeight: 500 }}>
          <Trans>Custom token beneficiary</Trans>
        </span>
      </Space>
      {customBeneficiaryEnabled && (
        <Form.Item
          style={{ marginTop: '1rem', marginBottom: 0 }}
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
