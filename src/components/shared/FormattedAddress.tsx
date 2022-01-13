import { utils } from 'ethers'
import { useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'

type EnsRecord = {
  name: string | null
  expires: number
}

const getStorageKey = () => 'jb_ensDict_' + readProvider.network.chainId

const getEnsDict = () => {
  try {
    return JSON.parse(
      window.localStorage.getItem(getStorageKey()) ?? '{}',
    ) as Record<string, EnsRecord>
  } catch (e) {
    console.info('ENS storage not found')
    return {}
  }
}

export default function FormattedAddress({
  address,
  label,
}: {
  address: string | undefined
  label?: string
}) {
  const [ensName, setEnsName] = useState<string | null>()

  const now = new Date().valueOf()

  useEffect(() => {
    if (!address || !utils.isAddress(address)) return

    const _address = address.toLowerCase()

    const tryUpdateENSDict = async () => {
      const record = getEnsDict()[_address]

      if (record?.expires > now) {
        setEnsName(record.name)
        return
      }

      let newRecord = {
        name: null,
        expires: now + 24 * 60 * 60 * 1000, // Expires in one day
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
        console.log('Error looking up ENS name for address', address, e)
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
    ensName ??
    label ??
    (address
      ? address.substring(0, 6) + '...' + address.substr(address.length - 6, 6)
      : '')

  return (
    <div style={{ cursor: 'default', userSelect: 'all', lineHeight: '22px' }}>
      {formatted}
    </div>
  )
}
