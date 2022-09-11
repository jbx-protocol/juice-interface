import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useMetamask, useProviderIsMetamask } from 'hooks/Wallet/Metamask'
import React, { useContext } from 'react'

const AddERCToWalletButton = () => {
  const ethereum = useMetamask()
  const isMetamask = useProviderIsMetamask()
  const { tokenAddress, tokenSymbol } = useContext(V2ProjectContext)

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
    <Button size="small" onClick={addTokenToWalletRequest}>
      <Trans>Add to Metamask</Trans>
    </Button>
  )
}

export default AddERCToWalletButton
