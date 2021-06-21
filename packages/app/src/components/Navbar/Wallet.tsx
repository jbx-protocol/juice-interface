import ShortAddress from 'components/shared/ShortAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const { colors } = useContext(ThemeContext).theme

  const height = 30

  return (
    <span
      style={{
        height,
        borderRadius: height / 2,
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        background: colors.background.l2,
        cursor: 'default',
        userSelect: 'all',
      }}
    >
      <ShortAddress address={userAddress} />
    </span>
  )
}
