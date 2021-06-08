import { JsonRpcProvider } from '@ethersproject/providers'
import { NetworkContext } from 'contexts/networkContext'
import { useContext, useEffect, useState } from 'react'

export function useProviderAddress(): string | undefined {
  const [userAddress, setUserAddress] = useState<string>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    const getUserAddress = async (injectedProvider: JsonRpcProvider) => {
      const signer = injectedProvider.getSigner()
      if (signer) {
        const newAddress = await signer.getAddress()
        if (newAddress !== userAddress) setUserAddress(newAddress)
      }
    }

    if (signingProvider) getUserAddress(signingProvider)
  }, [signingProvider, userAddress])

  return userAddress
}
