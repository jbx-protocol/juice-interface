import { CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'
import { findProjectMetadata } from './ipfs'

export const getProjectMetadata = async (projectId: string | number) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }
  if (isNaN(projectId)) return undefined

  const metadataCid = await getMetadataCidFromContract(projectId)
  return await findProjectMetadata({ metadataCid })
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

const getMetadataCidFromContract = async (projectId: number) => {
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
