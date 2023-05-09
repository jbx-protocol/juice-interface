import { SECONDS_IN_DAY } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { PayoutMod, TicketMod } from 'models/v1/mods'
import { consolidateMetadata } from 'models/projectMetadata'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo } from 'react'
import {
  permyriadToPercent,
  percentToPermyriad,
  perbicentToPercent,
  fromWad,
} from 'utils/format/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { splitPercentFrom, discountRateFrom } from 'utils/v2v3/math'

export const useRelaunchV1ViaV3Create = () => {
  const router = useRouter()

  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { queuedFC, queuedPayoutMods, queuedTicketMods, terminal } =
    useContext(V1ProjectContext)
  const fundingCycleMetadata = decodeFundingCycleMetadata(queuedFC?.metadata)

  const isReady = useMemo(() => {
    return !(
      projectMetadata === undefined ||
      queuedFC === undefined ||
      queuedPayoutMods === undefined ||
      queuedTicketMods === undefined ||
      terminal?.version === undefined
    )
  }, [projectMetadata, queuedFC, queuedPayoutMods, queuedTicketMods, terminal])

  const v1ConvertedInitialState = useMemo(() => {
    // No idea why we have to do this way but it is what it is.
    const convertPayoutMods = (mods: PayoutMod[]) => {
      const converted: unknown[] = []
      for (const mod of mods ?? []) {
        converted.push({
          percent: splitPercentFrom(
            parseFloat(permyriadToPercent(mod.percent)),
          ).toString(),
          allocator: mod.allocator,
          beneficiary: mod.beneficiary,
          lockedUntil: mod.lockedUntil,
          preferClaimed: mod.preferUnstaked,
          projectId: !mod.projectId?.eq(0)
            ? mod.projectId?.toString()
            : undefined,
        })
      }
      return converted
    }
    const convertTicketMods = (mods: TicketMod[]) => {
      const converted: unknown[] = []
      for (const mod of mods ?? []) {
        converted.push({
          percent: splitPercentFrom(
            parseFloat(permyriadToPercent(mod.percent)),
          ).toString(),
          beneficiary: mod.beneficiary,
          lockedUntil: mod.lockedUntil,
          preferClaimed: mod.preferUnstaked,
        })
      }
      return converted
    }
    return {
      projectMetadata: projectMetadata
        ? consolidateMetadata(projectMetadata)
        : undefined,
      fundingCycleData: {
        duration: queuedFC?.duration.mul(SECONDS_IN_DAY).toString(),
        weight: queuedFC?.weight.toString(),
        discountRate: discountRateFrom(queuedFC?.discountRate.toString() ?? 0)
          .div(10)
          .toString(),
        ballot: queuedFC?.ballot,
      },
      fundingCycleMetadata: {
        reservedRate: percentToPermyriad(
          perbicentToPercent(fundingCycleMetadata?.reservedRate),
        ).toString(),

        redemptionRate: percentToPermyriad(
          perbicentToPercent(fundingCycleMetadata?.bondingCurveRate),
        ).toString(),
        ballotRedemptionRate: percentToPermyriad(
          perbicentToPercent(fundingCycleMetadata?.bondingCurveRate),
        ).toString(),
        pausePay: fundingCycleMetadata?.payIsPaused,
        // pauseDistribution: , // Not in v1
        // pauseRedeem: , // Not in v1
        allowMinting: fundingCycleMetadata?.ticketPrintingIsAllowed,
        // allowTerminalMigration: , // Not in v1
        // allowControllerMigration: , // Not in v1
        // holdFees: ,// Not in v1
        // useTotalOverflowForRedemptions: ,// Not in v1
        // useDataSourceForPay: ,// Not in v1
        // useDataSourceForRedeem: ,// Not in v1
        // dataSource: ,// Not in v1
        // preferClaimedTokenOverride: ,// Not in v1
        // metadata: ,// Not in v1
      },
      fundAccessConstraints: [
        {
          distributionLimit: fromWad(queuedFC?.target),
          distributionLimitCurrency: queuedFC?.currency.toString(),
          overflowAllowance: '0', // nothing
          overflowAllowanceCurrency: '0', // nothing
        },
      ],
      payoutGroupedSplits: {
        group: 1,
        splits: queuedPayoutMods ? convertPayoutMods(queuedPayoutMods) : [],
      },
      reservedTokensGroupedSplits: {
        group: 1,
        splits: queuedTicketMods ? convertTicketMods(queuedTicketMods) : [],
      },
    }
  }, [
    fundingCycleMetadata?.bondingCurveRate,
    fundingCycleMetadata?.payIsPaused,
    fundingCycleMetadata?.reservedRate,
    fundingCycleMetadata?.ticketPrintingIsAllowed,
    projectMetadata,
    queuedFC?.ballot,
    queuedFC?.currency,
    queuedFC?.discountRate,
    queuedFC?.duration,
    queuedFC?.target,
    queuedFC?.weight,
    queuedPayoutMods,
    queuedTicketMods,
  ])

  const relaunch = useCallback(() => {
    router.push({
      pathname: '/create',
      query: {
        initialState: JSON.stringify(v1ConvertedInitialState),
        migration: true,
        migrationVersion: terminal?.version,
      },
    })
  }, [router, terminal?.version, v1ConvertedInitialState])

  return { relaunch, isReady }
}
