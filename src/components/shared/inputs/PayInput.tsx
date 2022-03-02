import { Form, FormInstance } from 'antd'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { CURRENCY_METADATA } from 'constants/currency'
import { CurrencyContext } from 'contexts/currencyContext'
import { useContext } from 'react'

export type PayFormFields = {
  amount?: string
  payInCurrency?: number
}

export default function PayInput({
  payButton,
  inputSubText,
  form,
}: {
  payButton: JSX.Element
  inputSubText?: JSX.Element
  form: FormInstance<PayFormFields>
}) {
  const payAmount: string = form.getFieldValue('amount')
  const payInCurrency = form.getFieldValue('payInCurrency')

  const { currencyMetadata, currencyETH, currencyUSD } =
    useContext(CurrencyContext)

  const togglePayInCurrency = () => {
    form.setFieldsValue({
      payInCurrency: payInCurrency === currencyETH ? currencyUSD : currencyETH,
    })
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
                content={
                  currencyMetadata ? currencyMetadata[payInCurrency].name : ''
                }
                onClick={togglePayInCurrency}
              />
            }
          />
          {inputSubText}
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>{payButton}</div>
      </div>
    </Form>
  )
}
