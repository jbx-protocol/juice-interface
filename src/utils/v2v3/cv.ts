import { CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { featureFlagEnabled } from 'utils/featureFlags'
import { loadV2V3Contract } from './loadV2V3Contract'

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
export async function isV3Project(projectId: number): Promise<boolean> {
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
