import { AppWrapper } from 'components/common'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import { NewHomePage } from './home/NewHomePage'
import { OldHomePage } from './home/OldHomePage'

export default function LandingPage() {
  const newLandingEnabled = featureFlagEnabled(FEATURE_FLAGS.NEW_LANDING_PAGE)

  return (
    <AppWrapper>
      {newLandingEnabled ? <NewHomePage /> : <OldHomePage />}
    </AppWrapper>
  )
}
