import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { CV2V3 } from 'models/cv'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { loadV2V3Contract } from './loadV2V3Contract'

/**
 * Determine if a project has a funding cycle on the
 * given version of the funding cycle store.
 */
export async function hasFundingCycle(
  projectId: number,
  cv: CV2V3,
): Promise<boolean> {
  const JBFundingCycleStore = await loadV2V3Contract(
    V2V3ContractName.JBFundingCycleStore,
    readNetwork.name,
    readProvider,
    cv,
  )
  if (!JBFundingCycleStore) {
    throw new Error(
      `contract not found: ${V2V3ContractName.JBFundingCycleStore}`,
    )
  }

  const { fundingCycle } = await JBFundingCycleStore.latestConfiguredOf(
    projectId,
  )

  // if the funding cycle number is non-zero, it exists.
  return !fundingCycle.number.eq(0)
}
