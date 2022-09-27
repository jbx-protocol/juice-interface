import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2CVType, V3CVType } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { GetServerSidePropsResult } from 'next'
import { featureFlagEnabled } from 'utils/featureFlags'
import { findProjectMetadata } from 'utils/server'
import { loadV2V3Contract } from 'utils/v2v3/loadV2V3Contract'

export interface ProjectPageProps {
  metadata: ProjectMetadataV5
  projectId: number
  cv: V3CVType | V2CVType
}

async function loadJBProjects() {
  const network = readNetwork.name
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    network,
    readProvider,
    CV_V2, // Note: v2 and v3 use the same JBProjects, so the CV doesn't matter.
  )

  return contract
}

async function loadV3JBDirectory() {
  const network = readNetwork.name
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBDirectory,
    network,
    readProvider,
    CV_V3,
  )

  return contract
}

async function loadV3JBController() {
  const network = readNetwork.name
  const contract = await loadV2V3Contract(
    V2V3ContractName.JBController,
    network,
    readProvider,
    CV_V3,
  )

  return contract
}

/**
 * Return whether a project is a v2 or v3 project.
 *
 * A project is considered a v3 project the [projectId]
 * in the V3 JBDirectory contract has its controller set to the V3 JBController address.
 */
async function isV3Project(projectId: number): Promise<boolean> {
  if (!featureFlagEnabled(FEATURE_FLAGS.V3)) {
    return Promise.resolve(false)
  }

  const [V3JBDirectory, V3JBController] = await Promise.all([
    loadV3JBDirectory(),
    loadV3JBController(),
  ])
  if (!V3JBDirectory) {
    throw new Error(`contract not found ${V2V3ContractName.JBDirectory}`)
  }
  if (!V3JBController) {
    throw new Error(`contract not found ${V2V3ContractName.JBController}`)
  }

  const projectControllerAddress = await V3JBDirectory.controllerOf(projectId)

  return projectControllerAddress === V3JBController.address
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

    return { props: { metadata, projectId, cv } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }

    throw e
  }
}
