import { Button, Space } from 'antd'

import { useContext, useEffect } from 'react'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'
import { useAccountCenter } from '@web3-onboard/react'

import Wallet from './Wallet'

export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()
  const updateAccountCenter = useAccountCenter()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    updateAccountCenter({ enabled: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isConnected) {
    return (
      <Button onClick={() => connect()} block>
        <Trans>Connect</Trans>
      </Button>
    )
  }

  if (!userAddress) return null

  if (chainUnsupported) {
    return (
      <Space direction="horizontal">
        {chainUnsupported && (
          <Button
            size="small"
            style={{
              borderColor: colors.stroke.warn,
              color: colors.text.warn,
            }}
            onClick={changeNetworks}
          >
            Wrong network
          </Button>
        )}
        <Wallet userAddress={userAddress} />
      </Space>
    )
  }

  return <Wallet userAddress={userAddress} />
}
