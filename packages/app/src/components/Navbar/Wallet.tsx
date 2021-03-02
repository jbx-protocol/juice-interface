import { Tooltip } from 'antd'
import { colors } from 'constants/styles/colors'

export default function Wallet({ userAddress }: { userAddress?: string }) {
  const shortened =
    userAddress?.substring(0, 6) +
    '...' +
    userAddress?.substr(userAddress.length - 6, 6)

  return userAddress ? (
    <span
      style={{
        height: 30,
        borderRadius: 15,
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        background: colors.backgroundSecondary,
        cursor: 'default',
        userSelect: 'all',
      }}
    >
      <Tooltip title={userAddress}>{shortened}</Tooltip>
    </span>
  ) : null
}
