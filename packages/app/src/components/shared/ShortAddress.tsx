import { Tooltip } from 'antd'

export default function ShortAddress({
  address,
}: {
  address: string | undefined
}) {
  if (!address) return null

  const shortened =
    address.substring(0, 6) + '...' + address.substr(address.length - 6, 6)

  return (
    <Tooltip title={address}>
      <span style={{ cursor: 'default', userSelect: 'all' }}>{shortened}</span>
    </Tooltip>
  )
}
