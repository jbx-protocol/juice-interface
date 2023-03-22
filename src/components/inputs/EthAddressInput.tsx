import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
import { useCallback, useEffect, useState } from 'react'

import { JuiceInput } from './JuiceTextInput'

const isENS = (address = '') => address.endsWith('.eth')

export function EthAddressInput({
  value,
  placeholder = `juicebox.eth / ${constants.AddressZero}`,
  onChange,
}: {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
}) {
  const [input, setInput] = useState<string>()

  const [addressForENSName, setAddressForENSName] = useState<string>()
  const [loadingENSName, setLoadingENSName] = useState<boolean>(false)
  const [ensName, setENSName] = useState<string>()

  const handleENSInput = useCallback(
    async (ens: string) => {
      setENSName(ens)

      const addressForENSName = await readProvider.resolveName(ens)
      if (addressForENSName) {
        setAddressForENSName(addressForENSName)
        onChange?.(addressForENSName)
      }
    },
    [onChange],
  )

  const handleAddressInput = useCallback(
    async (address: string) => {
      onChange?.(address)

      const ensNameForAddress = await readProvider.lookupAddress(address)
      if (ensNameForAddress) {
        setENSName(ensNameForAddress)
        setAddressForENSName(address)
      }
    },
    [onChange],
  )

  const onInputChange = useCallback(
    async (val = '') => {
      setInput(val)

      // Reset
      setENSName(undefined)
      setAddressForENSName(undefined)

      if (isENS(val)) {
        setLoadingENSName(true)
        try {
          await handleENSInput(val)
          // eslint-disable-next-line no-empty
        } catch (e) {
        } finally {
          setLoadingENSName(false)
        }
      } else if (isAddress(val)) {
        setLoadingENSName(true)
        await handleAddressInput(val)
        setLoadingENSName(false)
      } else {
        onChange?.(val)
      }
    },
    [handleAddressInput, handleENSInput, onChange],
  )

  useEffect(() => {
    // This hook enables running ENS resolution on any default value

    if (value === addressForENSName || value === input || loadingENSName) {
      // Avoid unnecessary runs
      return
    }

    onInputChange(value)
  }, [value, onInputChange, addressForENSName, loadingENSName, input])

  const extraText = ensName && addressForENSName ? addressForENSName : ''

  return (
    <div className="w-full">
      <JuiceInput
        allowClear={true}
        type="text"
        spellCheck={false}
        placeholder={placeholder}
        value={ensName ?? input}
        suffix={loadingENSName ? <LoadingOutlined spin /> : null}
        disabled={loadingENSName}
        onChange={e => onInputChange(e.target.value)}
      />
      {extraText ? (
        <div className="mt-1 text-xs text-grey-500 dark:text-grey-300">
          <CheckCircleFilled /> {extraText}
        </div>
      ) : null}
    </div>
  )
}
