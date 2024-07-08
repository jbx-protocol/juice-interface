import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import { GnosisSafe } from 'models/safe'
import { useRouter } from 'next/router'

export interface ProjectHeaderData {
  title: string | undefined
  subtitle: { text: string; type: SubtitleType } | undefined
  domain: string | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: bigint | undefined
  last7DaysPercent: number
  gnosisSafe: GnosisSafe | undefined | null
  archived: boolean | undefined
  createdAtSeconds: number | undefined
  chainName: string
}

export const useV4ProjectHeader = (): ProjectHeaderData => {
  const router = useRouter()
  const { projectMetadata, projectId } = useProjectMetadataContext()
  // const {
  //   handle,
  //   projectOwnerAddress,
  //   totalVolume,
  //   trendingVolume,
  //   paymentsCount,
  //   createdAt,
  // } = useContext(V2V3ProjectContext) -> How it looks on v2v3

  const projectOwnerAddress = 'placeholderData'
  const totalVolume = 100n
  const trendingVolume =  100n
  const paymentsCount =  100
  const createdAt = 100

  const { chainName } = router.query

  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: BigNumber.from(totalVolume ?? 0),
    trendingVolume: BigNumber.from(trendingVolume ?? 0),
  })
  
  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata)

  return {
    title: projectMetadata?.name,
    chainName: chainName as string,
    subtitle,
    domain: projectMetadata?.domain,
    projectId,
    owner: projectOwnerAddress,
    payments: paymentsCount,
    totalVolume,
    last7DaysPercent,
    gnosisSafe,
    archived: projectMetadata?.archived,
    createdAtSeconds: createdAt,
  }
}
