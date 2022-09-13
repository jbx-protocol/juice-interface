import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V2ContractName } from 'models/v2/contracts'
import { GetServerSidePropsResult } from 'next'
import { loadContract } from 'utils/contracts'
import { findProjectMetadata } from 'utils/server'

export interface ProjectPageProps {
  metadata: ProjectMetadataV4
  projectId: number
}

async function getMetadataCidFromContract(projectId: number) {
  const network = readNetwork.name
  const contract = await loadContract(
    V2ContractName.JBProjects,
    network,
    readProvider,
  )
  if (!contract) {
    throw new Error(`contract not found ${V2ContractName.JBProjects}`)
  }

  const metadataCid = (await contract.metadataContentOf(
    projectId,
    JUICEBOX_MONEY_METADATA_DOMAIN,
  )) as string

  return metadataCid
}

export async function getProjectProps(
  projectId: number,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  if (isNaN(projectId)) {
    return { notFound: true }
  }

  const metadataCid = await getMetadataCidFromContract(projectId)

  try {
    const metadata = await findProjectMetadata({ metadataCid })
    return { props: { metadata, projectId } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }
    throw e
  }
}
