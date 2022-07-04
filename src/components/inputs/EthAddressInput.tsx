import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import * as constants from '@ethersproject/constants'
import { isAddress } from 'ethers/lib/utils'
import { useContext, useState } from 'react'

import { readProvider } from 'constants/readProvider'

const isENS = (address = '') => address.endsWith('.eth')

export function EthAddressInput({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [input, setInput] = useState<string>(value ?? '')

  const [addressForENSName, setAddressForENSName] = useState<string>()
  const [loadingENSName, setLoadingENSName] = useState<boolean>(false)
  const [ensName, setENSName] = useState<string>()

  const triggerChange = (changedValue?: string) => {
    onChange?.(changedValue ?? input)
  }

  const handleENSInput = async (ens: string) => {
    const addressForENSName = await readProvider.resolveName(ens)
    if (addressForENSName) {
      setAddressForENSName(addressForENSName)

      triggerChange(addressForENSName)
      setENSName(ens)
    }
  }

  const handleAddressInput = async (address: string) => {
    const ensNameForAddress = await readProvider.lookupAddress(address)
    if (ensNameForAddress) {
      setENSName(ensNameForAddress)
      setAddressForENSName(address)
      setInput(ensNameForAddress)
      triggerChange()
    }
  }

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear existing
    if (ensName || addressForENSName) {
      setInput('')
      setAddressForENSName(undefined)
      setENSName(undefined)
      triggerChange('')
    }

    const input = e.target.value
    setInput(input)
    triggerChange(input)

    if (isENS(input)) {
      setLoadingENSName(true)
      try {
        await handleENSInput(input)
        // eslint-disable-next-line no-empty
      } catch (e) {
      } finally {
        setLoadingENSName(false)
      }
    } else if (isAddress(input)) {
      setLoadingENSName(true)
      await handleAddressInput(input)
      setLoadingENSName(false)
    }
  }

  const extraText = ensName && addressForENSName ? addressForENSName : ''

  return (
    <div style={{ width: '100%' }}>
      <Input
        allowClear={true}
        type="text"
        spellCheck={false}
        placeholder={`juicebox.eth / ${constants.AddressZero}`}
        value={ensName ?? value}
        suffix={loadingENSName ? <LoadingOutlined spin /> : null}
        disabled={loadingENSName}
        onChange={onInputChange}
      />
      {extraText ? (
        <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>
          <CheckCircleFilled /> {extraText}
        </div>
      ) : null}
    </div>
  )
}
