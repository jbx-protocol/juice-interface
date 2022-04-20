import { FEATURE_FLAGS, featureFlagEnabled } from 'utils/featureFlags'

import V2SupportWarning from '../shared/V2SupportWarning'
import V2Dashboard from './Dashboard'

export default function V2DashboardContainer() {
  return (
    <>
      {!featureFlagEnabled(FEATURE_FLAGS.ENABLE_V2) ? (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <V2SupportWarning />
        </div>
      ) : (
        <V2Dashboard />
      )}
    </>
  )
}
