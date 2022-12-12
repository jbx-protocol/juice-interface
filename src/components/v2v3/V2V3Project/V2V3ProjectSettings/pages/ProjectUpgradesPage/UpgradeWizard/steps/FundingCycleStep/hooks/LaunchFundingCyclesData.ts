import { BigNumber } from '@ethersproject/bignumber'
import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import { CV_V3 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { LaunchFundingCyclesData } from 'hooks/v2v3/transactor/LaunchFundingCyclesTx'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { V3FundingCycleMetadata } from 'models/v3/fundingCycle'
import { useContext } from 'react'

/**
 * Transforms given launch data to ensure V3 compatibility.
 */
const transformLaunchDataForV3 = (
  launchData: LaunchFundingCyclesData,
  V3JBETHPaymentTerminalAddress: string,
): LaunchFundingCyclesData => {
  // add in new V3 properties
  const v3FundingCycleMetadata: V3FundingCycleMetadata = {
    ...launchData.fundingCycleMetadata,
    global: {
      ...launchData.fundingCycleMetadata.global,
      pauseTransfers: false,
    },
    preferClaimedTokenOverride: false,
    metadata: BigNumber.from(0),
  }

  // make the fund access constraints uses the V3 terminal.
  // Assumes there's only one constraint, which is the case for now.
  const v3FundAccessConstraints = [
    {
      ...launchData.fundAccessConstraints[0],
      terminal: V3JBETHPaymentTerminalAddress,
    },
  ]

  const newLaunchData = {
    ...launchData,
    fundingCycleMetadata: v3FundingCycleMetadata,
    fundAccessConstraints: v3FundAccessConstraints,
  }

  return newLaunchData
}

export function useLaunchFundingCyclesData({
  editingFundingCycleConfig,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
}) {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId, pv } = useContext(ProjectMetadataContext)
  const V3JBETHPaymentTerminal = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBETHPaymentTerminal,
  })

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

  if (
    !(
      fundingCycle &&
      editingFundingCycleData &&
      editingFundingCycleMetadata &&
      editingFundAccessConstraints &&
      projectId &&
      pv &&
      V3JBETHPaymentTerminal
    )
  ) {
    return
  }

  // set new v3 funding cycle start to be:
  //     `current V2 FC start time + `current V2 FC duration`
  const newStart = fundingCycle.start.add(fundingCycle.duration)

  const initialLaunchData = {
    projectId,
    fundingCycleData: editingFundingCycleData,
    fundingCycleMetadata: {
      ...editingFundingCycleMetadata,
      start: newStart,
    },
    fundAccessConstraints: editingFundAccessConstraints,
    groupedSplits: [
      editingPayoutGroupedSplits,
      editingReservedTokensGroupedSplits,
    ],
    mustStartAtOrAfter: editingMustStartAtOrAfter,
  }

  const launchData = transformLaunchDataForV3(
    initialLaunchData,
    V3JBETHPaymentTerminal.address,
  )

  return launchData
}
