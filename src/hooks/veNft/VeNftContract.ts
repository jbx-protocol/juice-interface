import { Contract } from '@ethersproject/contracts'

import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext, useEffect, useState } from 'react'

import { loadVeNftContract } from 'utils/contracts'

import { readProvider } from 'constants/readProvider'

export function useVeNftContract(): Contract | undefined {
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  const [contract, setContract] = useState<Contract>()
  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    const loadContract = async () => {
      if (!contractAddress) {
        return
      }
      const signerOrProvider = signingProvider?.getSigner() ?? readProvider
      const contract = await loadVeNftContract(
        signerOrProvider,
        contractAddress,
      )
      setContract(contract)
    }
    loadContract()
  }, [contractAddress, signingProvider, setContract])

  return contract
}
