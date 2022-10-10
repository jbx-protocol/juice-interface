import { NotificationOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { readNetwork } from 'constants/networks'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { NetworkName } from 'models/network-name'
import { useContext } from 'react'

export function RinkebyDeprecationBroadcastMessage() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()

  if (readNetwork.name === NetworkName.rinkeby) return null

  return (
    <div
      style={{
        backgroundColor: colors.background.brand.primary,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '1.5rem',
        justifyContent: 'center',
        marginTop: isMobile ? '64px' : 0,
        color: '#000',
      }}
    >
      <p style={{ margin: 0 }}>
        <NotificationOutlined />{' '}
        <Trans>
          <strong>The Rinkeby testnet is deprecated.</strong> Use the Goerli
          testnet instead:{' '}
          <a
            href="https://goerli.juicebox.money"
            style={{ color: '#000', textDecoration: 'underline' }}
          >
            https://goerli.juicebox.money
          </a>
        </Trans>
      </p>
    </div>
  )
}
