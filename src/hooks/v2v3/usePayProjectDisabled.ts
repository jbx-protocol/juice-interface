import { t } from '@lingui/macro'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectIsOFACListed } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectIsOFACListed'
import { useV2V3BlockedProject } from './useBlockedProject'
import { useIsJuicecrowd } from './useIsJuiceCrowd'

export enum PayDisabledReason {
  BLOCKED = 'BLOCKED',
  PAUSED = 'PAUSED',
  OFAC = 'OFAC',
  JUICECROWD = 'JC',
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
  const { fundingCycleMetadata, loading } = useProjectContext()
  const isBlockedProject = useV2V3BlockedProject()
  const isJuicecrowdProject = useIsJuicecrowd()
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
      message: t`You can't pay this project because your wallet address failed the compliance check.`,
    }
  }

  if (isJuicecrowdProject) {
    return {
      ...disabled,
      reason: PayDisabledReason.JUICECROWD,
      message: t`This is a Juicecrowd project. Go to juicecrowd.gg to pay this project.`,
    }
  }

  return {
    payDisabled: false,
    loading: false,
    reason: undefined,
    message: undefined,
  }
}
