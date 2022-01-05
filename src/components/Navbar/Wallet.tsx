import FormattedAddress from 'components/shared/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const { colors } = useContext(ThemeContext).theme

  const height = 45

  return (
    <span
      style={{
        height,
        borderRadius: height / 2,
        padding: '4px 19px 7px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: colors.background.l2,
        cursor: 'default',
        userSelect: 'all',
      }}
    >
      <FormattedAddress address={userAddress} />
      <Balance address={userAddress} />
    </span>
  )
}
