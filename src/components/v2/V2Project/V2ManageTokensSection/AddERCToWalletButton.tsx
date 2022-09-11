import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useMetamask } from 'hooks/Wallet/hooks/Metamask'
import React, { useContext } from 'react'

const AddERCToWalletButton = () => {
  const ethereum = useMetamask()
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

  if (!ethereum) {
    return null
  }

  return (
    <Button size="small" onClick={addTokenToWalletRequest}>
      <Trans>Add to Metamask</Trans>
    </Button>
  )
}

export default AddERCToWalletButton
