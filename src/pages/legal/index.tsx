import { Footer } from 'components/Footer/Footer'
import { Legal } from 'components/Legal'
import { AppWrapper, Head } from 'components/common'

export default function LegalPage() {
  return (
    <>
      <Head
        title="Legal Resources"
        url={process.env.NEXT_PUBLIC_BASE_URL + '/legal'}
        description="Legal resources for project creators and communities."
      />
      <AppWrapper>
        <Legal />
        <Footer />
      </AppWrapper>
    </>
  )
}
