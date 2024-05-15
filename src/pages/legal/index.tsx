import { Footer } from 'components/Footer/Footer'
import { Legal } from 'components/Legal/Legal'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import { SiteBaseUrl } from 'constants/url'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function LegalPage() {
  return (
    <>
      <Head
        title="Legal Resources"
        url={SiteBaseUrl + '/legal'}
        description="Legal resources for project creators and communities."
      />
      <AppWrapper>
        <Legal />
        <Footer />
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = globalGetServerSideProps
