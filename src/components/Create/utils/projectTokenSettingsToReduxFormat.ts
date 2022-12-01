import { EMPTY_RESERVED_TOKENS_GROUPED_SPLITS } from 'redux/slices/editingV2Project'
import {
  discountRateFrom,
  formatIssuanceRate,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'
import { ProjectTokensFormProps } from '../components/pages/ProjectToken/hooks/ProjectTokenForm'
import { allocationToSplit } from './splitToAllocation'

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

  return {
    weight,
    reservedRate,
    reservedTokensGroupedSplits,
    discountRate,
    redemptionRate,
    allowMinting,
  }
}
