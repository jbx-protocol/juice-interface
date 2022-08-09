import { useVeNftEnabled } from 'hooks/veNft/VeNftEnabled'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

export function useVeNftContractAddress(projectId: number | undefined) {
  const veNftEnabled = useVeNftEnabled(projectId)
  return veNftEnabled ? VENFT_CONTRACT_ADDRESS : undefined
}
