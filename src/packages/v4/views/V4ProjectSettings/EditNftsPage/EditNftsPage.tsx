import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useJBRulesetContext } from 'juice-sdk-react'
import { useNftDeployerCanReconfigure } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useHasNftRewards } from 'packages/v4/hooks/useHasNftRewards'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useContext } from 'react'
import { LaunchNftsPage } from './LaunchNftCollection'
import { EnableNftsCard } from './LaunchNftCollection/EnableNftsCard'
import { UpdateNftsPage } from './UpdateNftsPage'

export function EditNftsPage() {
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  const { rulesetMetadata: { data: _rulesetMetadata } } = useJBRulesetContext()
  const hasExistingNfts = useHasNftRewards()
  
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
