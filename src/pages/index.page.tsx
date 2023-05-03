import { AppWrapper } from 'components/common'
import QwestiveSDKContextProvider from 'contexts/QwestiveReferral/QwestiveReferralProvider'
import { HomePage } from './home'

export default function LandingPage() {
  return (
    <AppWrapper>
      <QwestiveSDKContextProvider>
        <HomePage />
      </QwestiveSDKContextProvider>
    </AppWrapper>
  )
}
