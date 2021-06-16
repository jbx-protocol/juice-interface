import { Button, Form, Input, Select, Space } from 'antd'
import { constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/payment-mod'

import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useLayoutEffect, useState } from 'react'
import { currencyName } from '../../../utils/currency'

export default function ProjectTarget({
  name,
  hideLabel,
  value,
  mods,
  currency,
  onValueChanged,
  onModsChanged,
  onCurrencyChanged,
  formItemProps,
}: {
  value: string | undefined
  mods: ModRef[]
  onModsChanged: (mods: ModRef[]) => void
  onValueChanged: (val: string | undefined) => void
  currency: CurrencyOption
  onCurrencyChanged: (val: CurrencyOption) => void
} & FormItemExt) {
  const [_mods, setMods] = useState<ModRef[]>([])

  useLayoutEffect(() => {
    setMods(mods)
  }, [])

  const updateMods = (mods: ModRef[]) => {
    setMods(mods)
    onModsChanged(mods)
  }

  const modInput = (mod: ModRef, index: number) => (
    <Space
      className="flex-first"
      style={{ width: '100%' }}
      key={mod.address ?? '' + index}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          style={{ width: '100%' }}
          placeholder={constants.AddressZero}
          defaultValue={mod.address}
          onChange={e =>
            updateMods(
              _mods.map((_v, _i) =>
                _i === index ? { ..._v, address: e.target.value } : _v,
              ),
            )
          }
        />

        <BudgetTargetInput
          value={mod.amount?.toString() ?? '0'}
          onValueChange={val =>
            updateMods(
              _mods.map((_v, _i) =>
                _i === index ? { ..._v, amount: parseInt(val ?? '0') } : _v,
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
          updateMods([..._mods.slice(0, index), ..._mods.slice(index + 1)])
        }
        icon={<CloseCircleOutlined />}
      ></Button>
    </Space>
  )

  return (
    <Form.Item
      extra="The money you need to run your project for one funding cycle. You'll be paid in $ETH no matter the denomination currency you choose."
      name={name}
      label={hideLabel ? undefined : 'Funding target'}
      {...formItemProps}
    >
      {/* <BudgetTargetInput
        value={value}
        onValueChange={onValueChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        disabled={disabled}
        placeholder="0"
      /> */}
      <Space direction="vertical">
        <Select value={currency} onChange={val => onCurrencyChanged(val)}>
          <Select.Option value={1}>{currencyName(1)} </Select.Option>
          <Select.Option value={0}>{currencyName(0)}</Select.Option>
        </Select>
        <Space direction="vertical" style={{ width: '100%' }}>
          {_mods.map((v, i) => modInput(v, i + 1))}
          <Button
            disabled={_mods[_mods.length - 1] === {}}
            type="dashed"
            onClick={() => updateMods([..._mods, {}])}
            block
          >
            Add a receiver
          </Button>
        </Space>
      </Space>
    </Form.Item>
  )
}
