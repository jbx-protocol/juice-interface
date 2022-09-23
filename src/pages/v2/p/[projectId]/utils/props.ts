import { CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2CVType, V3CVType } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { GetServerSidePropsResult } from 'next'
import { findProjectMetadata } from 'utils/server'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

const DEFAULT_CV: V3CVType | V2CVType = CV_V3

export interface ProjectPageProps {
  metadata: ProjectMetadataV5
  projectId: number
  cv: V3CVType | V2CVType
}

async function getMetadataCidFromContract(projectId: number) {
  const network = readNetwork.name
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    network,
    readProvider,
    DEFAULT_CV, // TODO check this
  )
  if (!contract) {
    throw new Error(`contract not found ${V2V3ContractName.JBProjects}`)
  }

  const metadataCid = (await contract.metadataContentOf(
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
    const metadata = await findProjectMetadata({ metadataCid })
    return { props: { metadata, projectId, cv: DEFAULT_CV } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }

    throw e
  }
}
