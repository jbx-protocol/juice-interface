import { PropsWithChildren } from 'react'
import { featureFlagEnabled, FEATURE_FLAGS } from 'utils/featureFlags'

import V2SupportWarning from './shared/V2SupportWarning'

export default function V2EntryGuard({ children }: PropsWithChildren<{}>) {
  return !featureFlagEnabled(FEATURE_FLAGS.ENABLE_V2) ? (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <V2SupportWarning />
    </div>
  ) : (
    <>{children}</>
  )
}
