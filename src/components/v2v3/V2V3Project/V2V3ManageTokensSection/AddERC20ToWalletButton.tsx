import { PlusCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useMetamask, useProviderIsMetamask } from 'hooks/Wallet/Metamask'
import React, { useContext } from 'react'

const AddERC20ToWalletButton = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const ethereum = useMetamask()
  const isMetamask = useProviderIsMetamask()
  const { tokenAddress, tokenSymbol } = useContext(V2V3ProjectContext)

  const addTokenToWalletRequest = async () => {
    if (!ethereum) {
      return
    }
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: 18,
        },
      },
    })
  }

  if (!isMetamask) {
    return null
  }

  return (
    <Button
      style={{
        color: colors.text.tertiary,
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        padding: 0,
      }}
      type="text"
      size="small"
      onClick={addTokenToWalletRequest}
    >
      <Space size="small">
        <Trans>Add to Metamask</Trans>

        <PlusCircleOutlined />
      </Space>
    </Button>
  )
}

export default AddERC20ToWalletButton
