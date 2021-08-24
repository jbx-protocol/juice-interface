import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import { web3Modal } from 'utils/web3Modal'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress } = useContext(UserContext)
  const {
    onNeedProvider,
    onSelectWallet,
    onLogOut,
    usingBurnerProvider,
    wallet,
    account,
  } = useContext(NetworkContext)

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  return (
    <div>
      <Row gutter={10} align="middle">
        {account && (
          <Col>
            <Balance address={account?.toString()} showEthPrice />
          </Col>
        )}
        {account && (
          <Col>
            <Wallet userAddress={account?.toString()}></Wallet>
          </Col>
        )}
        <Col>
          {wallet && account ? (
            <Button onClick={onLogOut}>Logout</Button>
          ) : (
            <Button onClick={onSelectWallet}>Connect</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
