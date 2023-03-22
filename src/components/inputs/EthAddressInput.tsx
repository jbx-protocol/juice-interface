import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/api/ens'
import { useEffect, useState } from 'react'

import { JuiceInput } from './JuiceTextInput'

const isENS = (address = '') => address.endsWith('.eth')

export function EthAddressInput({
  value,
  placeholder = `juicebox.eth / ${constants.AddressZero}`,
  onChange,
  disabled,
}: {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  const [input, setInput] = useState<string>(value ?? '')

  const [addressForENSName, setAddressForENSName] = useState<string>()
  const [loadingENSName, setLoadingENSName] = useState<boolean>(false)
  const [ensName, setENSName] = useState<string>()

  const triggerChange = (changedValue?: string) => {
    onChange?.(changedValue ?? input)
  }

  const handleENSInput = async (ens: string) => {
    const { address: addressForENSName } = await resolveAddress(ens)
    if (addressForENSName) {
      setAddressForENSName(addressForENSName)

      triggerChange(addressForENSName)
      setENSName(ens)
    }
  }

  const handleAddressInput = async (address: string) => {
    const { name: ensNameForAddress } = await resolveAddress(address)
    if (ensNameForAddress) {
      setENSName(ensNameForAddress)
      setAddressForENSName(address)
      setInput(ensNameForAddress)
      triggerChange(address)
    }
  }

  const onInputChange = async (value = '') => {
    // Clear existing
    if (ensName || addressForENSName) {
      setInput('')
      setAddressForENSName(undefined)
      setENSName(undefined)
      triggerChange('')
    }

    const input = value
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

  useEffect(() => {
    onInputChange(value)
  }, [value])

  const extraText = ensName && addressForENSName ? addressForENSName : ''

  return (
    <div className="w-full">
      <JuiceInput
        allowClear={true}
        type="text"
        spellCheck={false}
        placeholder={placeholder}
        value={ensName ?? value}
        suffix={loadingENSName ? <LoadingOutlined spin /> : null}
        disabled={loadingENSName || disabled}
        onChange={e => onInputChange(e.target.value)}
      />
      {extraText && !disabled ? (
        <div className="mt-1 text-xs text-grey-500 dark:text-grey-300">
          <CheckCircleFilled /> {extraText}
        </div>
      ) : null}
    </div>
  )
}
