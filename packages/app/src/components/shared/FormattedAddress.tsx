import { LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { readProvider } from 'constants/readProvider'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

type EnsRecord = {
  name: string | null
  expires: number
}

export default function FormattedAddress({
  address,
}: {
  address: string | undefined
}) {
  const [ensName, setEnsName] = useState<string | null>()

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

  const now = new Date().valueOf()

  useEffect(() => {
    if (!address || !utils.isAddress(address)) return

    const tryUpdateENSDict = async () => {
      const record = getEnsDict()[address]

      if (record?.expires > now) {
        setEnsName(record.name)
        return
      }

      console.log('lookup', record, address)

      let newRecord = {
        name: null,
        expires: now + 24 * 60 * 60 * 1000, // Expires in one day
      } as EnsRecord

      try {
        const name = await readProvider.lookupAddress(address)

        // Reverse lookup to check validity
        if (
          (await readProvider.resolveName(name))?.toLowerCase() ===
          address.toLowerCase()
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
          [address]: newRecord,
        }),
      )

      setEnsName(newRecord.name)
    }

    tryUpdateENSDict()
  }, [address])

  if (!address) return null

  const formatted =
    ensName ??
    (address
      ? address.substring(0, 6) + '...' + address.substr(address.length - 6, 6)
      : '')

  return (
    <Tooltip
      title={
        <span>
          <span style={{ userSelect: 'all' }}>{address}</span>{' '}
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkOutlined />
          </a>
        </span>
      }
    >
      <span style={{ cursor: 'default', userSelect: 'all' }}>{formatted}</span>
    </Tooltip>
  )
}
