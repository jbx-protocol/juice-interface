import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

import { veNftAbi } from 'constants/veNft/veNftAbi'

export function useVeNftContract() {
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  return useLoadContractFromAddress({ address: contractAddress, abi: veNftAbi })
}
