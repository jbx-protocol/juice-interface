import { Trans } from '@lingui/macro'
import { TextButton } from 'components/buttons/TextButton'
import { WAD_DECIMALS } from 'constants/numbers'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useMetamask, useProviderIsMetamask } from 'hooks/Wallet/useMetamask'
import { useContext } from 'react'

const AddERC20ToWalletButton = () => {
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
          decimals: WAD_DECIMALS,
        },
      },
    })
  }

  if (!isMetamask) {
    return null
  }

  return (
    <TextButton onClick={addTokenToWalletRequest}>
      <Trans>Add to Metamask</Trans>
    </TextButton>
  )
}

export default AddERC20ToWalletButton
