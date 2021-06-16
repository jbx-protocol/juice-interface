import { Button, Form, Input, Space } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/payment-mod'
import { useContext, useLayoutEffect, useState } from 'react'

import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { constants, utils } from 'ethers'

export default function PaymentMods({
  name,
  initialValues,
  currency,
  onChanged,
}: {
  name: string
  initialValues: ModRef[]
  currency: CurrencyOption
  onChanged: (values: ModRef[]) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [values, setValues] = useState<ModRef[]>([])

  const updateValues = (vals: ModRef[]) => {
    setValues(vals)
    onChanged(vals)
  }

  useLayoutEffect(() => {
    setValues(initialValues)
  }, [])

  return (
    <Form.Item name={name}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {values.map((v, i) => (
          <Space
            className="flex-first"
            style={{ width: '100%' }}
            key={v.address ?? '' + i}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                style={{ width: '100%' }}
                placeholder={constants.AddressZero}
                defaultValue={v.address}
                onChange={e =>
                  updateValues(
                    values.map((_v, _i) =>
                      _i === i ? { ..._v, address: e.target.value } : _v,
                    ),
                  )
                }
              />

              <BudgetTargetInput
                value={v.amount?.toString() ?? '0'}
                onValueChange={val =>
                  updateValues(
                    values.map((_v, _i) =>
                      _i === i ? { ..._v, amount: parseInt(val ?? '0') } : _v,
                    ),
                  )
                }
                currency={currency}
                placeholder="0"
              />
            </Space>

            <Button
              type="ghost"
              onClick={() =>
                updateValues([...values.slice(0, i), ...values.slice(i + 1)])
              }
              icon={<CloseCircleOutlined />}
            ></Button>
          </Space>
        ))}
        <Button
          disabled={values[values.length - 1] === {}}
          type="dashed"
          onClick={() => updateValues([...values, {}])}
          block
        >
          Add a receiver
        </Button>
      </Space>
    </Form.Item>
  )
}
