import { CheckCircleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import * as constants from '@ethersproject/constants'
import { isAddress } from '@ethersproject/address'

import { useCallback, useContext, useLayoutEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'

import { FormItemExt } from './formItemExt'

const isENS = (address = '') =>
  address.endsWith('.eth') || address.endsWith('.xyz')

export default function EthAddress({
  name,
  formItemProps,
  onAddressChange,
  defaultValue,
}: FormItemExt & {
  onAddressChange: (address: string) => void
  defaultValue: string | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [value, setValue] = useState<string>()
  const [addressForENSName, setAddressForENSName] = useState<string>()
  const [ENSName, setENSName] = useState<string>()

  const onInputChange = useCallback(
    // value can be ENS name *or* ETH address (0x00...)
    async (value: string) => {
      setValue(value)
      onAddressChange(value)

      setAddressForENSName('')
      setENSName('')

      if (isENS(value)) {
        try {
          const addressForENSName = await readProvider.resolveName(value)
          if (addressForENSName) {
            setAddressForENSName(addressForENSName)
            onAddressChange(addressForENSName)
            setENSName(value)
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      if (isAddress(value)) {
        const ENSNameForAddress = await readProvider.lookupAddress(value)

        if (ENSNameForAddress) {
          setENSName(ENSNameForAddress)
          setAddressForENSName(value)
          setValue(ENSNameForAddress)
        }
      }
    },
    [onAddressChange],
  )

  useLayoutEffect(() => {
    onInputChange(defaultValue ?? '')
  }, [defaultValue, onInputChange])

  const extraText = ENSName && addressForENSName ? addressForENSName : ''

  return (
    <Form.Item
      {...formItemProps}
      className={
        // if we pass form.item an 'extra', need to set different padding for error message
        formItemProps?.extra
          ? 'ant-form-item-control-input-extra-and-error'
          : ''
      }
    >
      <Input
        id="0xAddress" // name it something other than address for auto fill doxxing
        name="0xAddress" // name it something other than address for auto fill doxxing
        autoComplete="off"
        placeholder={'juicebox.eth / ' + constants.AddressZero}
        type="string"
        onChange={e => onInputChange(e.target.value)}
        value={value}
      />
      {extraText ? (
        <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>
          <CheckCircleFilled /> {extraText}
        </div>
      ) : null}
      <Form.Item
        name={name}
        style={{ height: 0, maxHeight: 0, margin: 0 }}
        rules={formItemProps?.rules ?? []} // rules weren't being applied to inner FormItem
      >
        {/* Hidden input allows for address value to be used in form, while visible input can display ENS name */}
        <Input hidden type="string" autoComplete="off" />
      </Form.Item>
    </Form.Item>
  )
}
