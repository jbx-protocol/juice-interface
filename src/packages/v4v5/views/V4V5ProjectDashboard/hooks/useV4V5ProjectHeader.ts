import { SubtitleType, useSubtitle } from 'hooks/useSubtitle'
import {
  useJBChainId,
  useJBContractContext,
  useJBProjectMetadataContext,
} from 'juice-sdk-react'

import { BigNumber } from '@ethersproject/bignumber'
import { useProjectQuery, useSuckerGroupQuery } from 'generated/v4v5/graphql'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { GnosisSafe } from 'models/safe'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { getJBContractAddress } from 'juice-sdk-core'

export interface ProjectHeaderData {
  title: string | undefined
  subtitle: { text: string; type: SubtitleType } | undefined
  projectId: number | undefined
  owner: string | undefined
  payments: number | undefined
  totalVolume: bigint | undefined
  last7DaysPercent: number
  gnosisSafe: GnosisSafe | undefined | null
  archived: boolean | undefined
  createdAtSeconds: number | undefined
  isRevnet: boolean | undefined
  operatorAddress: string | undefined
}

export const useV4V5ProjectHeader = (): ProjectHeaderData => {
  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const projectMetadata = metadata?.data

  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()

  const projectIdNum = parseInt(projectId.toString())

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: projectIdNum,
      chainId: Number(chainId),
      version: version
    },
    skip: !projectId || !chainId,
  })

  const { data: suckerGroup } = useSuckerGroupQuery({
    client: bendystrawClient,
    variables: {
      id: project?.project?.suckerGroupId || '',
    },
    skip: !project?.project?.suckerGroupId,
  })

  const sg = suckerGroup?.suckerGroup

  const last7DaysPercent = useProjectTrendingPercentageIncrease({
    totalVolume: BigNumber.from(sg?.volume ?? 0),
    trendingVolume: BigNumber.from(sg?.trendingVolume ?? 0),
  })

  const { data: gnosisSafe } = useGnosisSafe(projectOwnerAddress)

  const subtitle = useSubtitle(projectMetadata ?? undefined)

  // Extract revnet data from GraphQL (if available)
  const graphQLIsRevnet = project?.project?.isRevnet
  const permissionHolders = project?.project?.permissionHolders?.items
  // For Revnets: Get the permission holder marked as the revnet operator
  // bendystraw sets isRevnetOperator=true for the operator with the required permission set
  const graphQLOperatorAddress = permissionHolders?.find(
    holder => holder.isRevnetOperator
  )?.operator

  // Frontend fallback: Detect Revnet by checking if owner matches REVDeployer contract
  const revDeployerAddress = chainId
    ? getJBContractAddress('REVDeployer', version, chainId)?.toLowerCase()
    : undefined
  const ownerIsRevDeployer =
    projectOwnerAddress && revDeployerAddress
      ? projectOwnerAddress.toLowerCase() === revDeployerAddress
      : false

  // Use GraphQL data if available, otherwise fall back to on-chain detection
  // If GraphQL explicitly says isRevnet=false but owner IS REVDeployer, trust the chain
  const isRevnet = graphQLIsRevnet === false && ownerIsRevDeployer
    ? true
    : graphQLIsRevnet ?? (ownerIsRevDeployer ? true : undefined)
  const operatorAddress = graphQLOperatorAddress

  return {
    title: projectMetadata?.name,
    subtitle,
    projectId: projectIdNum,
    owner: projectOwnerAddress,
    payments: sg?.paymentsCount,
    totalVolume: sg?.volume,
    last7DaysPercent,
    gnosisSafe,
    archived: projectMetadata?.archived,
    createdAtSeconds: sg?.createdAt,
    isRevnet,
    operatorAddress,
  }
}
