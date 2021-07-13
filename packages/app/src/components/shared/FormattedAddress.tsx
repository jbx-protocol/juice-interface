import { Tooltip } from 'antd'
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
      if (!address || !utils.isAddress(address)) {
        setEnsName(undefined)
        return
      }

      try {
        const name = await readProvider.lookupAddress(address)

        // Reverse lookup to check validity
        const isValid = (await readProvider.resolveName(name)) === address

        if (isValid) setEnsName(name)
      } catch (e) {
        console.log('Error looking up ENS name for address', address, e)
      }
    }

    read()
  }, [readProvider, address])

  if (!address) return null

  const formatted =
    ensName ??
    (address
      ? address.substring(0, 6) + '...' + address.substr(address.length - 6, 6)
      : '')

  return (
    <Tooltip title={address}>
      <span style={{ cursor: 'default', userSelect: 'all' }}>{formatted}</span>
    </Tooltip>
  )
}
