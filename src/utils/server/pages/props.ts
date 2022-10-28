import { CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { GetStaticPropsResult } from 'next'
import { findProjectMetadata } from 'utils/server'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

export interface ProjectPageProps {
  metadata?: ProjectMetadataV5
  projectId: number
}

async function loadJBProjects() {
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    readNetwork.name,
    readProvider,
    CV_V3, // Note: v2 and v3 use the same JBProjects, so the CV doesn't matter.
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

export async function getProjectStaticProps(
  projectId: number,
): Promise<GetStaticPropsResult<ProjectPageProps>> {
  if (isNaN(projectId)) {
    return { notFound: true }
  }

  try {
    const metadataCid = await getMetadataCidFromContract(projectId)
    const metadata = await findProjectMetadata({ metadataCid })

    return {
      props: {
        metadata,
        projectId,
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
