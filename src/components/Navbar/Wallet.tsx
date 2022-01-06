import FormattedAddress from 'components/shared/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { Tooltip } from 'antd'

import EtherscanLink from 'components/shared/EtherscanLink'

import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const { colors } = useContext(ThemeContext).theme

  const height = 45

  return (
    <Tooltip
      trigger={['hover', 'click']}
      title={
        <span>
          <span style={{ userSelect: 'all' }}>{userAddress}</span>{' '}
          <EtherscanLink value={userAddress} type="address" />
        </span>
      }
    >
      <span
        style={{
          height,
          borderRadius: 2,
          padding: '4px 19px 7px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: colors.background.l2,
          cursor: 'default',
          userSelect: 'all',
        }}
      >
        <FormattedAddress address={userAddress} linkDisabled />
        <Balance address={userAddress} />
      </span>
    </Tooltip>
  )
}
