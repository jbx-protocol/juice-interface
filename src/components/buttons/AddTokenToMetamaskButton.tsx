import { Trans } from '@lingui/macro'
import type { MetaMaskInpageProvider } from '@metamask/providers'
import { Button } from 'antd'
import { providers } from 'ethers'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { twMerge } from 'tailwind-merge'
import { Hash } from 'viem'

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

function useAddTokenToWalletRequest({
  tokenAddress,
}:{
  tokenAddress: Hash
}) {
  const ethereum = useMetamask()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)

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

export function AddTokenToMetamaskButton({ 
  className,
  tokenAddress
}: { 
  className: string,
  tokenAddress: Hash
}) {
  const addToken = useAddTokenToWalletRequest({
    tokenAddress
  })
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
