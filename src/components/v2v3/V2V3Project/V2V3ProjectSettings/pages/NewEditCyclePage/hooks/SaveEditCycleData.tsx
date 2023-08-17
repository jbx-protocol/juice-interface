import { BigNumber } from '@ethersproject/bignumber'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { BaseV3FundingCycleMetadataGlobal } from 'models/v3/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { NftRewardsData } from 'redux/slices/editingV2Project/types'
import { isZeroAddress } from 'utils/address'
import { parseWad } from 'utils/format/formatNumber'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import { getV2V3CurrencyOption } from 'utils/v2v3/currency'
import {
  MAX_DISTRIBUTION_LIMIT,
  discountRateFrom,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'
import {
  EditingFundingCycleConfig,
  useEditingFundingCycleConfig,
} from '../../ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { useReconfigureFundingCycle } from '../../ReconfigureFundingCycleSettingsPage/hooks/useReconfigureFundingCycle'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { EditCycleFormFields } from '../EditCycleFormFields'
// EditingFundingCycleConfig {
//   editingPayoutGroupedSplits: ETHPayoutGroupedSplits
//   editingReservedTokensGroupedSplits: ReservedTokensGroupedSplits
//   editingFundingCycleMetadata: Omit<V2V3FundingCycleMetadata, 'version'>
//   editingFundingCycleData: V2V3FundingCycleData
//   editingFundAccessConstraints: V2V3FundAccessConstraint[]
//   editingNftRewards: NftRewardsData | undefined
//   editingMustStartAtOrAfter: string
// }

// export type V2V3FundingCycleData = {
//   duration: BigNumber
//   weight: BigNumber
//   discountRate: BigNumber
//   ballot: string // hex, contract address
// }

/* export type V2V3FundingCycleMetadata =
  | V2FundingCycleMetadata
   | V3FundingCycleMetadata
 BaseV2V3FundingCycleMetadata = {
  version?: number
  global: BaseV3FundingCycleMetadataGlobal
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  pauseBurn: boolean
  allowMinting: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  holdFees: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean // undefined for outgoing NFT args
  useDataSourceForRedeem: boolean
  dataSource: string // hex, contract address. undefined for outgoing NFT args
}

BaseV3FundingCycleMetadataGlobal = {
  allowSetController: boolean
  allowSetTerminals: boolean
  pauseTransfers?: boolean
}

 V3: preferClaimedTokenOverride?: boolean
  metadata?: BigNumber

V2: allowChangeToken: boolean
**}

//** Converts EditCycleForm data to EditingFundingCycleConfig and calls useReconfigureFundingCycle tx */

export const useSaveEditCycleData = () => {
  // Use Redux to get current (pre-edit) project state since it's not changed by edit
  // Only using this to get values of FC parameters not supported in the FC form (e.g. allowTerminalMigration, etc.)
  const reduxConfig = useEditingFundingCycleConfig()

  const { editCycleForm } = useEditCycleFormContext()
  const {
    contracts: { JBETHPaymentTerminal },
  } = useContext(V2V3ProjectContractsContext)

  if (!editCycleForm)
    return {
      saveEditCycleLoading: false,
      saveEditCycle: () => null,
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
      pausePay: formValues.pausePay,
      allowMinting: formValues.allowTokenMinting,
      holdFees: formValues.holdFees,
      useDataSourceForPay: isZeroAddress(fundingCycleMetadata?.dataSource)
        ? false
        : true,
      useDataSourceForRedeem: formValues.useDataSourceForRedeem,
    }

  const editingFundingCycleData: V2V3FundingCycleData = {
    duration: BigNumber.from(durationSeconds),
    weight: BigNumber.from(issuanceRateFrom(formValues.mintRate.toString())),
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
    editingMustStartAtOrAfter: DEFAULT_MUST_START_AT_OR_AFTER,
  }
  const {
    reconfigureLoading: saveEditCycleLoading,
    reconfigureFundingCycle: saveEditCycle,
  } = useReconfigureFundingCycle({
    editingFundingCycleConfig,
    memo: formValues.memo ?? '',
    launchedNewNfts: false, // TODO: isLaunchingNewCollection,
  })

  return {
    saveEditCycleLoading,
    saveEditCycle,
  }
}
