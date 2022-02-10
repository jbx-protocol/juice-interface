import { BigNumber } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { FundingCycleMetadata } from 'models/funding-cycle-metadata'
import { V1TerminalVersion } from 'models/v1/terminals'

import { readNetwork } from 'constants/networks'
import { disablePayOverrides } from 'constants/v1/overrides'

import { decodeFundingCycleMetadata } from './fundingCycle'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'

// v1 projects who still use 100% RR to disable pay
export const isV1AndMaxRR = (
  version?: V1TerminalVersion,
  reservedRate?: number,
) => version === '1' && reservedRate === 200

// Edge case for MoonDAO, upgraded to v1.1 but can't use payIsPaused for now
export const isMoonAndMaxRR = (
  projectId?: BigNumber,
  fcMetadata?: FundingCycleMetadata,
) => projectId?.eq(V1_PROJECT_IDS.MOON_DAO) && fcMetadata?.reservedRate === 200

// Gets any case where a project's payments are paused
export const paymentsPaused = (
  projectId?: BigNumber,
  currentFC?: FundingCycle,
  terminalVersion?: V1TerminalVersion | undefined,
) => {
  const overridePayDisabled = Boolean(
    projectId &&
      disablePayOverrides[readNetwork.name]?.has(projectId.toNumber()),
  )

  const fcMetadata: FundingCycleMetadata | undefined =
    decodeFundingCycleMetadata(currentFC?.metadata)

  fcMetadata?.payIsPaused ||
    isV1AndMaxRR(terminalVersion, fcMetadata?.reservedRate)
  return (
    fcMetadata?.payIsPaused || // v1.1 only
    overridePayDisabled ||
    isV1AndMaxRR(terminalVersion, fcMetadata?.reservedRate) || // v1 projects who still use 100% RR to disable pay
    currentFC?.configured.eq(0) || // Edge case, see sequoiacapitaldao
    isMoonAndMaxRR(projectId, fcMetadata) // Edge case for MoonDAO
  )
}
