import { Contact } from 'components/Contact/Contact'
import { Footer } from 'components/Footer/Footer'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import { SiteBaseUrl } from 'constants/url'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function ContactPage() {
  return (
    <>
      <Head
        title="Contact"
        url={SiteBaseUrl + '/contact'}
        description="Contact JuiceboxDAO for feature requests, support, or project advice."
      />

      <AppWrapper>
        <Contact />
        <Footer />
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = globalGetServerSideProps
