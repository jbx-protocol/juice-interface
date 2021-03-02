import { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

export function useProviderAddress(
  provider?: JsonRpcProvider,
): string | undefined {
  const [userAddress, setUserAddress] = useState<string>()

  useEffect(() => {
    const getUserAddress = async (injectedProvider: JsonRpcProvider) => {
      const signer = injectedProvider.getSigner()
      if (signer) {
        const newAddress = await signer.getAddress()
        setUserAddress(newAddress)
      }
    }

    if (provider) getUserAddress(provider)
  }, [provider])

  return userAddress
}
