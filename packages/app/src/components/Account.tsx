import { Button, Col, Row, Tag } from 'antd'
import { useEffect } from 'react'

import { web3Modal } from '../constants/web3-modal'
import { useExchangePrice } from '../hooks/ExchangePrice'
import Balance from './Balance'
import Wallet from './Wallet'

export default function Account({
  userAddress,
  loadWeb3Modal,
  shouldUseNetwork,
}: {
  userAddress?: string
  loadWeb3Modal: VoidFunction
  shouldUseNetwork?: string
}) {
  useEffect(() => {
    if (web3Modal.cachedProvider) loadWeb3Modal()
  }, [loadWeb3Modal])

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const price = useExchangePrice()

  return (
    <div>
      <Row gutter={10} align="middle" style={{ justifyContent: 'flex-end' }}>
        <Col>
          <Balance userAddress={userAddress} dollarMultiplier={price} />
        </Col>
        <Col>
          <Wallet userAddress={userAddress}></Wallet>
        </Col>
        <Col>
          {shouldUseNetwork ? (
            <Tag color="red">Switch to {shouldUseNetwork} to use Juice!</Tag>
          ) : null}
          {web3Modal?.cachedProvider ? (
            <Button onClick={logoutOfWeb3Modal}>Logout</Button>
          ) : (
            <Button onClick={loadWeb3Modal}>Connect</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
