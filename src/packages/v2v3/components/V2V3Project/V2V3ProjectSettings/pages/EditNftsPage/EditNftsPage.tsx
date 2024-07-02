import * as constants from '@ethersproject/constants'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useContext } from 'react'
import { LaunchNftsPage } from './LaunchNftCollection'
import { EnableNftsCard } from './LaunchNftCollection/EnableNftsCard'
import { UpdateNftsPage } from './UpdateNftsPage'

export function EditNftsPage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)
  const hasExistingNfts =
    fundingCycleMetadata?.dataSource &&
    fundingCycleMetadata.dataSource !== constants.AddressZero
  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  if (hasExistingNfts) {
    return <UpdateNftsPage />
  } else if (!nftDeployerCanReconfigure) {
    return <EnableNftsCard />
  } else {
    return <LaunchNftsPage />
  }
}
