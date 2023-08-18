import { Contact } from 'components/Contact'
import { Footer } from 'components/Footer'
import { AppWrapper, Head } from 'components/common'
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
