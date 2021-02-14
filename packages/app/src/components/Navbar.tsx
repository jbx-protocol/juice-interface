import { JsonRpcProvider } from '@ethersproject/providers'

import { colors } from '../constants/styles/colors'
import Account from './Account'

export default function Navbar({
  userAddress,
  hasBudget,
  userProvider,
  onConnectWallet,
}: {
  userAddress?: string
  hasBudget?: boolean
  userProvider?: JsonRpcProvider
  onConnectWallet: VoidFunction
}) {
  const menuItem = (text: string, route: string) => {
    const external = route.startsWith('http')

    return (
      <a
        style={{
          textDecoration: 'none',
          fontWeight: 600,
          color: colors.dark,
        }}
        href={route}
        target={external ? '_blank' : ''}
        rel={external ? 'noopener noreferrer' : ''}
      >
        {text}
      </a>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 20px',
      }}
    >
      <div
        style={{
          display: 'inline-grid',
          gridAutoFlow: 'column',
          columnGap: 40,
          alignItems: 'center',
        }}
      >
        <a href="/">
          <img
            style={{ height: 40 }}
            src="/assets/juice_logo-ol.png"
            alt="Juice logo"
          />
        </a>
        {userAddress
          ? hasBudget
            ? menuItem('Your budget', '/#/' + userAddress)
            : menuItem('Create a budget', '/#/create')
          : null}
        {menuItem(
          'Fluid dynamics',
          'https://www.figma.com/file/ZklsxqZUsjK3XO5BksCyE4/Juicy-Funstuff?node-id=0%3A1',
        )}
      </div>
      <Account
        userProvider={userProvider}
        loadWeb3Modal={onConnectWallet}
        userAddress={userAddress}
      />
    </div>
  )
}
