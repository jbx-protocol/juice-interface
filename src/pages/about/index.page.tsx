import { AboutDashboard } from 'components/AboutDashboard'
import { AppWrapper, Head } from 'components/common'

export default function AboutPage() {
  return (
    <>
      <Head
        title="About Juicebox | Crypto Fundraising & DAO Management"
        overrideFormattedTitle
        url={process.env.NEXT_PUBLIC_BASE_URL + '/about'}
        description="Juicebox is the programmable funding platform for crypto and web3. Fund, operate, and scale your project transparently. Community DAO owned, on Ethereum."
      />

      <AppWrapper>
        <AboutDashboard />
      </AppWrapper>
    </>
  )
}
