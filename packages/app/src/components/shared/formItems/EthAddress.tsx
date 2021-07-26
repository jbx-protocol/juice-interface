import { CheckCircleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { readProvider } from 'constants/readProvider'
import { ThemeContext } from 'contexts/themeContext'
import { constants, utils } from 'ethers'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'

import { FormItemExt } from './formItemExt'

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

  const [addressForENS, setAddressForENS] = useState<string>()
  const [displayValue, setDisplayValue] = useState<string>()

  const onInputChange = useCallback((value: string) => {
    setDisplayValue(value)

    const read = async () => {
      const address = await readProvider.resolveName(value)
      const newVal = utils.isAddress(address) ? address : ''

      setAddressForENS(newVal)
      onAddressChange(newVal)
    }

    read()
  }, [])

  useLayoutEffect(() => {
    const readENSName = async () => {
      if (!defaultValue || !utils.isAddress(defaultValue)) {
        setDisplayValue(defaultValue)
        return
      }

      try {
        const name = await readProvider.lookupAddress(defaultValue)

        if (!name) {
          setDisplayValue(defaultValue)
          return
        }

        // Reverse lookup to check validity
        const isValid =
          (await readProvider.resolveName(name)).toLowerCase() ===
          defaultValue.toLowerCase()

        setDisplayValue(isValid ? name : defaultValue)

        if (isValid) setAddressForENS(defaultValue)
      } catch (e) {
        console.log('Error looking up ENS name for address', defaultValue, e)
      }
    }

    setDisplayValue(defaultValue)

    readENSName()
  }, [])

  return (
    <Form.Item {...formItemProps}>
      <Input
        placeholder={'juicebox.eth / ' + constants.AddressZero}
        type="string"
        autoComplete="off"
        onChange={e => onInputChange(e.target.value)}
        value={displayValue}
      />
      <Form.Item name={name} style={{ height: 0 }}>
        {/* Hidden input allows for address value to be used in form, while visible input can display ENS name */}
        <Input hidden type="string" autoComplete="off" />
      </Form.Item>
      {addressForENS?.length ? (
        <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>
          <CheckCircleFilled /> {addressForENS}
        </div>
      ) : null}
    </Form.Item>
  )
}
