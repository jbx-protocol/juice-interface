import { VeNftContext } from 'contexts/veNftContext'
import { useVeNftContractForProject } from 'hooks/veNft/VeNftContractForProject'
import { first } from 'lodash'
import { PropsWithChildren } from 'react'

export function VeNftProvider({
  projectId,
  children,
}: PropsWithChildren<{ projectId: number | undefined }>) {
  const { data: veNftInfo } = useVeNftContractForProject(projectId)
  const contractAddress = first(veNftInfo)?.address

  return (
    <VeNftContext.Provider
      value={{
        contractAddress,
      }}
    >
      {children}
    </VeNftContext.Provider>
  )
}
