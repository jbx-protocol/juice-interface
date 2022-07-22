import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Switch } from 'antd'
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
    <>
      <Form.Item
        label={
          <>
            <Trans>Custom token beneficiary</Trans>
            <Switch
              checked={customBeneficiaryEnabled}
              onChange={setCustomBeneficiaryEnabled}
              style={{ marginLeft: 10 }}
            />
          </>
        }
        extra={
          <div style={{ color: colors.text.primary, marginBottom: 10 }}>
            <p>
              <Trans>Mint NFT to a custom address</Trans>
            </p>
          </div>
        }
        style={{ marginBottom: '1rem' }}
      />
      {customBeneficiaryEnabled && (
        <Form.Item
          name="beneficiary"
          label="Beneficiary"
          rules={[
            {
              validator: validateCustomBeneficiary,
            },
          ]}
        >
          <EthAddressInput />
        </Form.Item>
      )}
    </>
  )
}

export default CustomBeneficiaryInput
