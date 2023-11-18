import { Contact } from 'components/Contact/Contact'
import { Footer } from 'components/Footer/Footer'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function ContactPage() {
  return (
    <>
      <Head
        title="Contact"
        url={process.env.NEXT_PUBLIC_BASE_URL + '/contact'}
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
