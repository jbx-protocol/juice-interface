import { Tooltip } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { readProvider } from 'constants/readProvider'
import { utils } from 'ethers'
import { useLayoutEffect, useState } from 'react'

export default function FormattedAddress({
  address,
}: {
  address: string | undefined
}) {
  const [ensName, setEnsName] = useState<string>()

  useLayoutEffect(() => {
    const read = async () => {
      if (
        address?.toLowerCase() ===
        '0x64931F06d3266049Bf0195346973762E6996D764'.toLowerCase()
      ) {
        setEnsName('tiledao.eth')
        return
      }

      if (!address || !utils.isAddress(address)) {
        setEnsName(undefined)
        return
      }

      try {
        const name = await readProvider.lookupAddress(address)

        if (!name) {
          setEnsName(undefined);
          return;
        }

        // Reverse lookup to check validity
        const isValid =
          (await (await readProvider.resolveName(name)).toLowerCase()) ===
          address.toLowerCase()

        setEnsName(isValid ? name : undefined)
      } catch (e) {
        console.log('Error looking up ENS name for address', address, e)
        setEnsName(undefined);
      }
    }

    read()
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
