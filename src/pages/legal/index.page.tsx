import { Footer } from 'antd/lib/layout/layout'
import { AppWrapper, Head } from 'components/common'
import Legal from './Legal'

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
