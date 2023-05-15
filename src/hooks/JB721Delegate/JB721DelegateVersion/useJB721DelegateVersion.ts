import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
} from 'constants/delegateVersions'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useIsJB721DelegateV3 } from './useIsJB721DelegateV3'
import { useIsJB721DelegateV3_1 } from './useIsJB721DelegateV3_1'

export function useJB721DelegateVersion({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): JB721DelegateVersion | undefined {
  const { value: isV3 } = useIsJB721DelegateV3({ dataSourceAddress })
  const { value: isV3_1 } = useIsJB721DelegateV3_1({
    dataSourceAddress: isV3 === false ? dataSourceAddress : undefined, // only check v1_1 if v1 is false
  })
  const isV3_2 = false // TODO implement

  if (!dataSourceAddress) return

  if (isV3) return JB721_DELEGATE_V3
  if (isV3_1) return JB721_DELEGATE_V3_1
  if (isV3_2) return JB721_DELEGATE_V3_2

  return // not a JB721Delegate
}
