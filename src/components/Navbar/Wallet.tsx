import FormattedAddress from 'components/shared/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { Tooltip } from 'antd'

import EtherscanLink from 'components/shared/EtherscanLink'
import CopyTextButton from 'components/shared/CopyTextButton'

import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const { colors } = useContext(ThemeContext).theme

  const height = 45

  return (
    <Tooltip
      trigger={['hover', 'click']}
      title={
        <span style={{ zIndex: 999999 }}>
          <EtherscanLink value={userAddress} type="address" />{' '}
          <CopyTextButton value={userAddress} />
        </span>
      }
    >
      <div
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
        <FormattedAddress address={userAddress} />
        <Balance address={userAddress} />
      </div>
    </Tooltip>
  )
}
