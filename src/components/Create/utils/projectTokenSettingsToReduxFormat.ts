import {
  discountRateFrom,
  formatIssuanceRate,
  redemptionRateFrom,
  reservedRateFrom,
} from 'packages/v2v3/utils/math'
import { EMPTY_RESERVED_TOKENS_GROUPED_SPLITS } from 'redux/slices/editingV2Project'
import { toHexString } from 'utils/bigNumbers'
import { allocationToSplit } from 'utils/splitToAllocation'
import { ProjectTokensFormProps } from '../components/pages/ProjectToken/hooks/useProjectTokenForm'

export const projectTokenSettingsToReduxFormat = (
  projectTokenSettings: Required<Omit<ProjectTokensFormProps, 'selection'>>,
) => {
  const weight = formatIssuanceRate(projectTokenSettings.initialMintRate)
  const reservedRate = toHexString(
    reservedRateFrom(projectTokenSettings.reservedTokensPercentage),
  )
  const reservedTokensGroupedSplits = {
    ...EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
    splits: projectTokenSettings.reservedTokenAllocation.map(allocationToSplit),
  }
  const discountRate = toHexString(
    discountRateFrom(projectTokenSettings.discountRate),
  )
  const redemptionRate = toHexString(
    redemptionRateFrom(projectTokenSettings.redemptionRate),
  )
  const allowMinting = projectTokenSettings.tokenMinting
  const pauseTransfers = projectTokenSettings.pauseTransfers

  return {
    weight,
    reservedRate,
    reservedTokensGroupedSplits,
    discountRate,
    redemptionRate,
    allowMinting,
    pauseTransfers,
  }
}
