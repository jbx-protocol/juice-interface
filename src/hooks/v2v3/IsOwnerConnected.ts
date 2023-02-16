import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useContext } from 'react'

export function useIsOwnerConnected() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  return useIsUserAddress(projectOwnerAddress)
}
