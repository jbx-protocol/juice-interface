import { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

export function useProviderAddress(provider?: JsonRpcProvider): string {
  const [userAddress, setUserAddress] = useState<string>('')

  useEffect(() => {
    const getUserAddress = async (injectedProvider: JsonRpcProvider) => {
      const signer = injectedProvider.getSigner()
      if (signer) setUserAddress(await signer.getAddress())
    }

    if (provider) getUserAddress(provider)
  }, [provider])

  return userAddress
}
