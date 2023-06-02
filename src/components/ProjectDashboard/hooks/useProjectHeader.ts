import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { useProjectMetadata } from './useProjectMetadata'

export const useProjectHeader = () => {
  const { projectMetadata } = useProjectMetadata()
  const { handle, projectOwnerAddress, totalVolume } =
    useContext(V2V3ProjectContext)

  return {
    title: projectMetadata?.name,
    subtitle: 'A place for pyromaniacs of all kinds', // TODO
    handle,
    owner: projectOwnerAddress,
    payments: 227, // TODO
    totalVolume,
    last7DaysPercent: 0, // TODO
  }
}
