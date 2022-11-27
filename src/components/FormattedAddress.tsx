import { isAddress } from '@ethersproject/address'
import { Tooltip } from 'antd'
import { CSSProperties, MouseEventHandler, useEffect, useState } from 'react'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { readProvider } from 'constants/readProvider'

type EnsRecord = {
  name: string | null
  expires: number
}

const ENS_LOCALSTORAGE_KEY = `jb_ensDict_${readProvider.network.chainId}`

const getEnsDict = () => {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(
      window.localStorage.getItem(ENS_LOCALSTORAGE_KEY) ?? '{}',
    ) as Record<string, EnsRecord>
  } catch (e) {
    console.warn('ENS storage not found', e)
    return {}
  }
}

const cacheEnsRecord = (address: string, record: EnsRecord) => {
  window.localStorage?.setItem(
    ENS_LOCALSTORAGE_KEY,
    JSON.stringify({
      ...getEnsDict(),
      [address]: record,
    }),
  )
}

const resolveAddress = async (address: string) => {
  const name = await readProvider.lookupAddress(address)

  // Reverse lookup to check validity
  if (
    name &&
    (await readProvider.resolveName(name))?.toLowerCase() ===
      address.toLowerCase()
  ) {
    return name
  }
}

const getEnsRecord = async (
  address: string,
): Promise<EnsRecord | undefined> => {
  const now = new Date().valueOf()

  // Try getting from cache first
  const cache = getEnsDict()
  const record = cache[address]
  if (record?.expires > now) {
    return record
  }

  // If no cache hit, resolve address
  try {
    const name = await resolveAddress(address)
    if (!name) return

    const newRecord = {
      name,
      expires: now + SECONDS_IN_DAY * 1000, // Expires in one day
    }

    // cache the newly resolved address
    cacheEnsRecord(address, newRecord)

    return newRecord
  } catch (e) {
    return
  }
}

export default function FormattedAddress({
  address,
  label,
  tooltipDisabled,
  truncateTo,
  style,
  onClick,
}: {
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  truncateTo?: number
  style?: CSSProperties
  onClick?: MouseEventHandler
}) {
  const [ensName, setEnsName] = useState<string | null>()

  useEffect(() => {
    async function loadEnsName() {
      if (!address || !isAddress(address)) return

      const ensRecord = await getEnsRecord(address.toLowerCase())
      if (!ensRecord) return

      setEnsName(ensRecord.name)
    }

    loadEnsName()
  }, [address])

  if (!address) return null

  const formatted =
    ensName ?? label ?? truncateEthAddress({ address, truncateTo })

  const mergedStyle: CSSProperties = {
    userSelect: 'all',
    lineHeight: '22px',
    ...style,
  }

  if (tooltipDisabled) {
    return (
      <span onClick={onClick} style={mergedStyle}>
        {formatted}
      </span>
    )
  }

  return (
    <Tooltip
      title={
        <span style={{ fontSize: '0.875rem' }}>
          {address} <CopyTextButton value={address} />
        </span>
      }
    >
      <span>
        <EtherscanLink
          onClick={onClick}
          type="address"
          value={address}
          style={mergedStyle}
        >
          {formatted}
        </EtherscanLink>
      </span>
    </Tooltip>
  )
}
