import { veNftAbi } from 'constants/contracts/goerli/veNftAbi'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { useContext } from 'react'

export function useVeNftContract() {
  const { contractAddress } = useContext(VeNftContext)
  return useLoadContractFromAddress({ address: contractAddress, abi: veNftAbi })
}
