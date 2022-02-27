import { Form, FormInstance } from 'antd'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import PayInputSubText from 'components/v1/V1Project/Pay/PayInputSubText'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/v1/currency'
import { formatWad } from 'utils/formatNumber'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

import CurrencySymbol from '../CurrencySymbol'

export type PayFormFields = {
  amount?: string
  payInCurrency?: number
}

export default function PayInput({
  payButton,
  form,
}: {
  payButton: JSX.Element
  form: FormInstance<PayFormFields>
}) {
  const payAmount: string = form.getFieldValue('amount')
  const payInCurrency = form.getFieldValue('payInCurrency')

  const togglePayInCurrency = () => {
    form.setFieldsValue({ payInCurrency: payInCurrency === 0 ? 1 : 0 })
  }

  return (
    <Form form={form} layout="vertical">
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <FormattedNumberInput
            placeholder="0"
            onChange={val => form.setFieldsValue({ amount: val })}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyName(payInCurrency)}
                onClick={togglePayInCurrency}
              />
            }
          />
          <PayInputSubText payInCurrency={payInCurrency} amount={payAmount} />
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>{payButton}</div>
      </div>
    </Form>
  )
}
