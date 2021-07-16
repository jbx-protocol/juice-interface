import { CheckCircleFilled } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { readProvider } from 'constants/readProvider'
import { ThemeContext } from 'contexts/themeContext'
import { constants, utils } from 'ethers'
import { useCallback, useContext, useState } from 'react'

import { FormItemExt } from './formItemExt'

export default function EthAddress({
  name,
  formItemProps,
  onAddressChange,
}: FormItemExt & { onAddressChange: (address: string) => void }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [address, setAddress] = useState<string>()

  const addressFromEnsName = useCallback(
    (name: string) => {
      const read = async () => {
        const address = await readProvider.resolveName(name)
        const newVal = utils.isAddress(address) ? address : ''

        setAddress(newVal)
        onAddressChange(newVal)
      }

      read()
    },
    [readProvider],
  )

  return (
    <Form.Item {...formItemProps}>
      <Form.Item name={name}>
        <Input
          placeholder={'juicebox.eth / ' + constants.AddressZero}
          type="string"
          autoComplete="off"
          onChange={e => addressFromEnsName(e.target.value)}
        />
      </Form.Item>
      {address?.length ? (
        <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>
          <CheckCircleFilled /> {address}
        </div>
      ) : null}
    </Form.Item>
  )
}
