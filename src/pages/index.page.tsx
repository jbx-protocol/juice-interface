import { AppWrapper } from 'components/common'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { Suspense, lazy } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { OldHomePage } from './home/OldHomePage'
const NewHomePage = lazy(() => import('./home/NewHomePage'))

export default function LandingPage() {
  const newLandingEnabled = featureFlagEnabled(FEATURE_FLAGS.NEW_LANDING_PAGE)

  return (
    <AppWrapper>
      {newLandingEnabled ? (
        <Suspense fallback>
          <NewHomePage />
        </Suspense>
      ) : (
        <OldHomePage />
      )}
    </AppWrapper>
  )
}
