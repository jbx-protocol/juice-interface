import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { JB721DelegateVersion } from 'models/nftRewards'
import { useIsJB721DelegateV1 } from './IsJB721DelegateV1'
import { useIsJB721DelegateV1_1 } from './IsJB721DelegateV1_1'

export function useJB721DelegateVersion({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}): JB721DelegateVersion | undefined {
  const { value: isV1 } = useIsJB721DelegateV1({ dataSourceAddress })
  const { value: isV1_1 } = useIsJB721DelegateV1_1({
    dataSourceAddress: isV1 === false ? dataSourceAddress : undefined, // only check v1_1 if v1 is false
  })

  if (!dataSourceAddress) return

  if (isV1) return JB721_DELEGATE_V1
  if (isV1_1) return JB721_DELEGATE_V1_1

  return // not a JB721Delegate
}
