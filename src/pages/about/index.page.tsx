import { t } from '@lingui/macro'
import { AboutDashboard } from 'components/AboutDashboard'
import { AppWrapper, Head } from 'components/common'

export default function AboutPage() {
  return (
    <>
      <Head
        title={t`About`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/about'}
        description={t`About Juicebox`}
      />

      <AppWrapper>
        <AboutDashboard />
      </AppWrapper>
    </>
  )
}
