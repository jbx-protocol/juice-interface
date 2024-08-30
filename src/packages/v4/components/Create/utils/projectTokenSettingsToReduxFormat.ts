import {
  discountRateFrom,
  formatIssuanceRate,
  redemptionRateFrom,
  reservedRateFrom,
} from 'packages/v2v3/utils/math'
import { allocationToSplit } from 'packages/v2v3/utils/splitToAllocation'
import { EMPTY_RESERVED_TOKENS_GROUPED_SPLITS } from 'redux/slices/editingV2Project'
import { ProjectTokensFormProps } from '../components/pages/ProjectToken/hooks/useProjectTokenForm'

export const projectTokenSettingsToReduxFormat = (
  projectTokenSettings: Required<Omit<ProjectTokensFormProps, 'selection'>>,
) => {
  const weight = formatIssuanceRate(projectTokenSettings.initialMintRate)
  const reservedRate = reservedRateFrom(
    projectTokenSettings.reservedTokensPercentage,
  ).toHexString()
  const reservedTokensGroupedSplits = {
    ...EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
    splits: projectTokenSettings.reservedTokenAllocation.map(allocationToSplit),
  }
  const discountRate = discountRateFrom(
    projectTokenSettings.discountRate,
  ).toHexString()
  const redemptionRate = redemptionRateFrom(
    projectTokenSettings.redemptionRate,
  ).toHexString()
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
