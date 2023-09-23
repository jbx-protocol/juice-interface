import * as constants from '@ethersproject/constants'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useContext } from 'react'
import { EnableNftsCard } from './LaunchNftCollection/EnableNftsCard'
import { LaunchNftsPage } from './LaunchNftCollection/LaunchNftsCollection'
import { UpdateNftsPage } from './UpdateNftsPage/UpdateNftsPage'

export function EditNftsPage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)
  const hasExistingNfts =
    fundingCycleMetadata?.dataSource !== constants.AddressZero

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
