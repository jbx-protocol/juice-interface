import { Trans } from '@lingui/macro'
import type { MetaMaskInpageProvider } from '@metamask/providers'
import { Button } from 'antd'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { providers } from 'ethers'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider
  }
}

// const useProviderIsMetamask = () => {
//   const { signer } = useWallet()
//   const isMetamask = useMemo(() => {
//     return signer?.provider.connection.url === 'metamask'
//   }, [signer])
//   return isMetamask
// }

const useMetamask = () => {
  const ethereum = global?.window?.ethereum
  if (!ethereum || !ethereum.isMetaMask) return
  return ethereum as unknown as MetaMaskInpageProvider
}

function useAddTokenToWalletRequest() {
  const ethereum = useMetamask()
  const { tokenAddress, tokenSymbol } = useContext(V2V3ProjectContext)

  if (!ethereum) {
    return
  }

  return async function () {
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
}

export function AddTokenToMetamaskButton({ className }: { className: string }) {
  const addToken = useAddTokenToWalletRequest()
  if (!addToken) return null

  return (
    <Button
      type="link"
      size="small"
      onClick={() => {
        addToken()
      }}
      className={twMerge('p-0 text-start md:text-end', className)}
    >
      <Trans>Add token to Metamask</Trans>
    </Button>
  )
}
