import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useContext } from 'react'
import { EditNftsTabs } from '../EditNftsPage/EditNftsTabs'
import { EnableNftsCard } from './EnableNftsCard'
import { LaunchNftsPage } from './LaunchNftsPage'

export function EditNftsPage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { value: hasExistingNfts, loading: hasNftsLoading } = useHasNftRewards()

  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  if (hasNftsLoading) {
    return <Loading />
  }
  if (hasExistingNfts) {
    return <EditNftsTabs />
  } else if (!nftDeployerCanReconfigure) {
    return <EnableNftsCard />
  } else {
    return <LaunchNftsPage />
  }
}
