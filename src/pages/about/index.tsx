import { AboutDashboard } from 'components/AboutDashboard/AboutDashboard'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

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

export const getServerSideProps = globalGetServerSideProps
