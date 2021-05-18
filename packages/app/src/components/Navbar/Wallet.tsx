import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function Wallet({ userAddress }: { userAddress?: string }) {
  const { colors } = useContext(ThemeContext).theme

  const shortened =
    userAddress?.substring(0, 6) +
    '...' +
    userAddress?.substr(userAddress.length - 6, 6)

  const height = 30

  return userAddress ? (
    <span
      style={{
        height,
        borderRadius: height / 2,
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        background: colors.background.l1,
        cursor: 'default',
        userSelect: 'all',
      }}
    >
      <Tooltip title={userAddress}>{shortened}</Tooltip>
    </span>
  ) : null
}
