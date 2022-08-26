import { V2UserProvider } from 'providers/v2/UserProvider'
import { AppWrapper } from 'components/common'

import V2ProjectSettings from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'

export default function V2ProjectPage() {
  return (
    <AppWrapper>
      <V2UserProvider>
        <V2ProjectSettings />
      </V2UserProvider>
    </AppWrapper>
  )
}
