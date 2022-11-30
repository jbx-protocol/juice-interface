import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { isAddress } from 'ethers/lib/utils'
import { useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { JuiceInput } from './JuiceTextInput'

const isENS = (address = '') => address.endsWith('.eth')

export function EthAddressInput({
  value,
  placeholder = `juicebox.eth / ${constants.AddressZero}`,
  onChange,
}: {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}) {
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
      triggerChange(address)
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
    <div className="w-full">
      <JuiceInput
        allowClear={true}
        type="text"
        spellCheck={false}
        placeholder={placeholder}
        value={ensName ?? value}
        suffix={loadingENSName ? <LoadingOutlined spin /> : null}
        disabled={loadingENSName}
        onChange={onInputChange}
      />
      {extraText ? (
        <div className="text-sm text-grey-500 dark:text-grey-300">
          <CheckCircleFilled /> {extraText}
        </div>
      ) : null}
    </div>
  )
}
