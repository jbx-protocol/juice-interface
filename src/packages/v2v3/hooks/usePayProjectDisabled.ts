import { t } from '@lingui/macro'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectIsOFACListed } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectIsOFACListed'
import { useV2V3BlockedProject } from './useBlockedProject'

export enum PayDisabledReason {
  BLOCKED = 'BLOCKED',
  PAUSED = 'PAUSED',
  OFAC = 'OFAC',
}

const disabled = {
  payDisabled: true,
  loading: false,
}

/**
 * Return true if the currently connected user can pay the project. False if not.
 */
export function usePayProjectDisabled(): {
  loading: boolean
  payDisabled: boolean
  reason: PayDisabledReason | undefined
  message: string | undefined
} {
  const { projectMetadata } = useProjectMetadataContext()
  const { fundingCycleMetadata, loading } = useProjectContext()
  const isBlockedProject = useV2V3BlockedProject()
  const { isAddressListedInOFAC, isLoading: isOFACLoading } =
    useProjectIsOFACListed()

  if (loading.fundingCycleLoading || isOFACLoading) {
    return {
      loading: true,
      payDisabled: false,
      reason: undefined,
      message: undefined,
    }
  }

  if (isBlockedProject) {
    return {
      ...disabled,
      reason: PayDisabledReason.BLOCKED,
      message: t`This project has been delisted and can't be paid.`,
    }
  }

  if (fundingCycleMetadata?.pausePay) {
    return {
      ...disabled,
      reason: PayDisabledReason.PAUSED,
      message: t`This project has paused payments this cycle.`,
    }
  }

  if (isAddressListedInOFAC) {
    return {
      ...disabled,
      reason: PayDisabledReason.OFAC,
      message: t`You can't pay this project because your wallet address failed a compliance check set up by the project owner.`,
    }
  }

  if (projectMetadata?.archived) {
    return {
      ...disabled,
      reason: PayDisabledReason.BLOCKED,
      message: t`This project has been archived and can't be paid.`,
    }
  }

  return {
    payDisabled: false,
    loading: false,
    reason: undefined,
    message: undefined,
  }
}
