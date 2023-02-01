import { useIsJB721DelegateV1 } from './IsJB721DelegateV1'
import { useIsJB721DelegateV1_1 } from './IsJB721DelegateV1_1'
import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { DelegateVersion } from 'models/nftRewardTier'

export function useJB721DelegateVersion({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): DelegateVersion | undefined {
  const isV1 = useIsJB721DelegateV1({ dataSourceAddress })
  const isV1_1 = useIsJB721DelegateV1_1({ dataSourceAddress })
  if (!dataSourceAddress) return
  if (isV1) return JB721_DELEGATE_V1
  if (isV1_1) return JB721_DELEGATE_V1_1
  return // not a JB721Delegate
}
