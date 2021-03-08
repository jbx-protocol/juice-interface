import { Button, Col, Row, Tag } from 'antd'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account({
  shouldUseNetwork,
}: {
  shouldUseNetwork?: string
}) {
  const { onNeedProvider, userAddress } = useContext(UserContext)

  useDeepCompareEffect(() => {
    if (web3Modal.cachedProvider && onNeedProvider) {
      onNeedProvider()
    }
  }, [onNeedProvider])

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  return (
    <div>
      <Row gutter={10} align="middle" style={{ justifyContent: 'flex-end' }}>
        <Col>
          <Balance userAddress={userAddress} />
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
            <Button onClick={onNeedProvider}>Connect</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
