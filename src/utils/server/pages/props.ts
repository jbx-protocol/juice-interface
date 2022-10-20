import { CV_V2, CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { CV2V3 } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { GetServerSidePropsResult } from 'next'
import { findProjectMetadata } from 'utils/server'
import { hasFundingCycle } from 'utils/v2v3/cv'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

export interface ProjectPageProps {
  metadata: ProjectMetadataV5
  projectId: number
  initialCv: CV2V3
  cvs?: CV2V3[]
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

export async function getProjectProps(
  projectId: number,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  if (isNaN(projectId)) {
    return { notFound: true }
  }

  try {
    const metadataCid = await getMetadataCidFromContract(projectId)
    const [metadata, hasV2FundingCycle, hasV3FundingCycle] = await Promise.all([
      findProjectMetadata({ metadataCid }),
      hasFundingCycle(projectId, CV_V2),
      hasFundingCycle(projectId, CV_V3),
    ])

    const initialCv = hasV3FundingCycle ? CV_V3 : CV_V2

    const cvs: CV2V3[] = []
    if (hasV2FundingCycle) cvs.push(CV_V2)
    if (hasV3FundingCycle) cvs.push(CV_V3)

    return {
      props: {
        metadata,
        projectId,
        initialCv,
        cvs,
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
