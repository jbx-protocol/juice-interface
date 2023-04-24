import { t } from '@lingui/macro'
import { AboutDashboard } from 'components/AboutDashboard'
import { AppWrapper, Head } from 'components/common'

export default function AboutPage() {
  return (
    <>
      <Head
        title={t`About Juicebox | Launch, fund & manage your project`}
        overrideFormattedTitle
        url={process.env.NEXT_PUBLIC_BASE_URL + '/about'}
        description={t`Learn more about Juicebox - the communities #1 choice to launch, get funding and grow their web3 project. Open-source on the Ethereum Blockchain.`}
      />

      <AppWrapper>
        <AboutDashboard />
      </AppWrapper>
    </>
  )
}
