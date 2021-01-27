import { JsonRpcProvider } from '@ethersproject/providers'

import Account from './Account'

export default function Navbar({
  address,
  userProvider,
  onConnectWallet,
}: {
  address?: string
  userProvider?: JsonRpcProvider
  onConnectWallet: VoidFunction
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 20px',
        borderBottom: '1px solid lightgrey',
      }}
    >
      <span style={{ display: 'grid', gridAutoFlow: 'column', columnGap: 20, alignItems: 'center' }}>
        <a style={{ fontSize: 24 }} href="/">
          🧃⚡️
        </a>
      </span>
      <Account userProvider={userProvider} loadWeb3Modal={onConnectWallet} address={address} />
    </div>
  )
}
