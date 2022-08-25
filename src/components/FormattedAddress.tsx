import { isAddress } from '@ethersproject/address'

import { Tooltip } from 'antd'

import { CSSProperties, useEffect, useState } from 'react'

import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { truncateEthAddress } from 'utils/formatAddress'

import { SECONDS_IN_DAY } from 'constants/numbers'
import { readProvider } from 'constants/readProvider'

type EnsRecord = {
  name: string | null
  expires: number
}

const getStorageKey = () => 'jb_ensDict_' + readProvider.network.chainId

const getEnsDict = () => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(
        window.localStorage.getItem(getStorageKey()) ?? '{}',
      ) as Record<string, EnsRecord>
    } catch (e) {
      console.info('ENS storage not found')
      return {}
    }
  } else {
    return {}
  }
}

export default function FormattedAddress({
  address,
  label,
  tooltipDisabled,
  truncateTo,
  style,
}: {
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  truncateTo?: number
  style?: CSSProperties
}) {
  const [ensName, setEnsName] = useState<string | null>()

  const now = new Date().valueOf()

  useEffect(() => {
    if (!address || !isAddress(address)) return

    const _address = address.toLowerCase()

    const tryUpdateENSDict = async () => {
      const record = getEnsDict()[_address]

      if (record?.expires > now) {
        setEnsName(record.name)
        return
      }

      const newRecord = {
        name: null,
        expires: now + SECONDS_IN_DAY * 1000, // Expires in one day
      } as EnsRecord

      try {
        const name = await readProvider.lookupAddress(_address)

        // Reverse lookup to check validity
        if (
          name &&
          (await readProvider.resolveName(name))?.toLowerCase() ===
            _address.toLowerCase()
        ) {
          newRecord.name = name
        }
      } catch (e) {
        console.error('Error looking up ENS name for address', address, e)
      }

      window.localStorage?.setItem(
        getStorageKey(),
        JSON.stringify({
          ...getEnsDict(),
          [_address]: newRecord,
        }),
      )

      setEnsName(newRecord.name)
    }

    tryUpdateENSDict()
  }, [address, now])

  if (!address) return null

  const formatted =
    ensName ?? label ?? truncateEthAddress({ address, truncateTo })

  const mergedStyle: CSSProperties = {
    userSelect: 'all',
    lineHeight: '22px',
    ...style,
  }

  if (tooltipDisabled) {
    return <span style={mergedStyle}>{formatted}</span>
  }

  return (
    <Tooltip
      title={
        <span style={{ fontSize: '0.8rem' }}>
          {address} <CopyTextButton value={address} />
        </span>
      }
    >
      <span>
        <EtherscanLink type="address" value={address} style={mergedStyle}>
          {formatted}
        </EtherscanLink>
      </span>
    </Tooltip>
  )
}
