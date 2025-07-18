import { Trans } from '@lingui/macro'
import type { MetaMaskInpageProvider } from '@metamask/providers'
import { Button } from 'antd'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import { twMerge } from 'tailwind-merge'

// const useProviderIsMetamask = () => {
//   const { signer } = useWallet()
//   const isMetamask = useMemo(() => {
//     return signer?.provider.connection.url === 'metamask'
//   }, [signer])
//   return isMetamask
// }

const useMetamask = () => {
  // @ts-ignore - ethereum is added by metamask/other wallets
  const ethereum = global?.window?.ethereum
  if (!ethereum || !ethereum.isMetaMask) return
  return ethereum as unknown as MetaMaskInpageProvider
}

function useAddTokenToWalletRequest({
  tokenAddress,
}: {
  tokenAddress: string
}) {
  const ethereum = useMetamask()
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)

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
  tokenAddress,
}: {
  className: string
  tokenAddress: `0x${string}`
}) {
  const addToken = useAddTokenToWalletRequest({
    tokenAddress,
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
