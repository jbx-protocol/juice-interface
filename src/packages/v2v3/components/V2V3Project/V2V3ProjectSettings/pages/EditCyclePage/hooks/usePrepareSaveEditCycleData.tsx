import { BigNumber } from '@ethersproject/bignumber'
import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'
import moment from 'moment'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'packages/v2v3/models/splits'
import { getV2V3CurrencyOption } from 'packages/v2v3/utils/currency'
import {
  MAX_DISTRIBUTION_LIMIT,
  discountRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'packages/v2v3/utils/math'
import { BaseV3FundingCycleMetadataGlobal } from 'packages/v3/models/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/v2v3/editingV2Project'
import { NftRewardsData } from 'redux/slices/v2v3/shared/v2ProjectTypes'
import { isZeroAddress } from 'utils/address'
import { parseWad } from 'utils/format/formatNumber'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import {
  EditingFundingCycleConfig,
  useEditingFundingCycleConfig,
} from '../../../hooks/useEditingFundingCycleConfig'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { EditCycleFormFields } from '../EditCycleFormFields'
import { useTokensSectionValues } from '../ReviewConfirmModal/hooks/useTokensSectionValues'

export const usePrepareSaveEditCycleData = () => {
  // Use Redux to get current (pre-edit) project state since it's not changed by edit
  // Only using this to get values of FC parameters not supported in the FC form (e.g. allowTerminalMigration, etc.)
  const reduxConfig = useEditingFundingCycleConfig()

  const { newMintRate } = useTokensSectionValues()

  const { editCycleForm } = useEditCycleFormContext()
  const {
    contracts: { JBETHPaymentTerminal },
  } = useContext(V2V3ProjectContractsContext)

  if (!editCycleForm)
    return {
      editingFundingCycleConfig: reduxConfig,
    }

  const fundingCycleMetadata = reduxConfig.editingFundingCycleMetadata

  const formValues = editCycleForm.getFieldsValue(true) as EditCycleFormFields

  const durationSeconds = otherUnitToSeconds({
    duration: formValues.duration,
    unit: formValues.durationUnit.value,
  })

  const editingPayoutGroupedSplits: ETHPayoutGroupedSplits = {
    group: 1,
    splits: formValues.payoutSplits,
  }

  const editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits = {
    group: 2,
    splits: formValues.reservedSplits,
  }

  const editingFundingCycleMetadata: Omit<V2V3FundingCycleMetadata, 'version'> =
    {
      ...fundingCycleMetadata,
      global: {
        allowSetController: formValues.allowSetController,
        allowSetTerminals: formValues.allowSetTerminals,
        pauseTransfers: formValues.pauseTransfers,
      } as BaseV3FundingCycleMetadataGlobal,
      reservedRate: reservedRateFrom(formValues.reservedTokens),
      redemptionRate: redemptionRateFrom(formValues.redemptionRate),
      ballotRedemptionRate: redemptionRateFrom(formValues.redemptionRate),
      pausePay: formValues.pausePay,
      allowMinting: formValues.allowTokenMinting,
      holdFees: formValues.holdFees,
      useDataSourceForPay: isZeroAddress(fundingCycleMetadata?.dataSource)
        ? false
        : true,
      useDataSourceForRedeem: formValues.useDataSourceForRedeem,
      allowControllerMigration: formValues.allowControllerMigration,
      allowTerminalMigration: formValues.allowTerminalMigration,
    }

  const editingFundingCycleData: V2V3FundingCycleData = {
    duration: BigNumber.from(durationSeconds),
    weight: newMintRate,
    discountRate: discountRateFrom(formValues.discountRate),
    ballot: formValues.ballot,
  }
  const distributionLimit =
    formValues.distributionLimit === undefined
      ? MAX_DISTRIBUTION_LIMIT
      : parseWad(formValues.distributionLimit)
  const editingFundAccessConstraints: V2V3FundAccessConstraint[] = [
    {
      terminal: JBETHPaymentTerminal?.address ?? '',
      token: ETH_TOKEN_ADDRESS,
      distributionLimit,
      distributionLimitCurrency: BigNumber.from(
        getV2V3CurrencyOption(formValues.distributionLimitCurrency),
      ),
      overflowAllowance: BigNumber.from(0),
      overflowAllowanceCurrency: BigNumber.from(0),
    },
  ]

  const editingNftRewards: NftRewardsData | undefined = undefined // TODO: isLaunchingNewCollection ? formData : undefined

  const editingFundingCycleConfig: EditingFundingCycleConfig = {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingNftRewards,
    editingMustStartAtOrAfter:
      formValues.mustStartAtOrAfter &&
      formValues.mustStartAtOrAfter !== DEFAULT_MUST_START_AT_OR_AFTER
        ? moment(formValues.mustStartAtOrAfter).unix().toString()
        : DEFAULT_MUST_START_AT_OR_AFTER,
  }

  return {
    editingFundingCycleConfig,
  }
}
