import {
  useAccount,
  useLogout,
  useModal,
  useWallet as useParaWallet,
  useWalletBalance,
} from '@getpara/react-sdk'

export function useWallet() {
  const { data: paraAccount } = useAccount()
  const { data: paraWallet } = useParaWallet()
  const { logout: paraLogout } = useLogout()
  const { openModal } = useModal()
  const signer = null
  const userAddress = paraWallet?.address
  const isConnected = paraAccount?.isConnected ?? false
  const chain = null
  const chainUnsupported = false
  const balanceQuery = useWalletBalance({
    walletId: paraWallet?.id ?? '',
  })

  const balance = balanceQuery.data ?? '0'

  const disconnect = () => paraLogout()
  const changeNetworks = null

  return {
    signer,
    userAddress,
    isConnected,
    chain,
    chainUnsupported,
    balance,
    connect,
    disconnect,
    changeNetworks,
  }
}
