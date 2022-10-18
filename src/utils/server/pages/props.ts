import { CV_V2, CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { CV2V3 } from 'models/cv'
import { NetworkName } from 'models/network-name'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { GetServerSidePropsResult } from 'next'
import { findProjectMetadata } from 'utils/server'
import { isV3Project } from 'utils/v2v3/cv'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

export interface ProjectPageProps {
  metadata: ProjectMetadataV5
  projectId: number
  cv: CV2V3
}

async function loadJBProjects() {
  // Note: v2 and v3 use the same JBProjects, so the CV doesn't matter.
  // Goerli doesn't have a V3 deployment so we must use CV_V3.
  // Rinkeby doesn't have a V2 deployment so we must use CV_V2.
  const contractsVersion =
    readNetwork.name === NetworkName.goerli ? CV_V3 : CV_V2

  const network = readNetwork.name
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    network,
    readProvider,
    contractsVersion,
  )

  return contract
}

async function getMetadataCidFromContract(projectId: number) {
  const JBProjects = await loadJBProjects()
  if (!JBProjects) {
    throw new Error(`contract not found ${V2V3ContractName.JBProjects}`)
  }

  const metadataCid = (await JBProjects.metadataContentOf(
    projectId,
    JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
  )) as string

  return metadataCid
}

export async function getProjectProps(
  projectId: number,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  if (isNaN(projectId)) {
    return { notFound: true }
  }

  try {
    const metadataCid = await getMetadataCidFromContract(projectId)

    const [metadata, isV3ProjectResult] = await Promise.all([
      findProjectMetadata({ metadataCid }),
      isV3Project(projectId),
    ])

    const cv = isV3ProjectResult ? CV_V3 : CV_V2

    return {
      props: {
        metadata,
        projectId,
        cv,
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }

    throw e
  }
}
