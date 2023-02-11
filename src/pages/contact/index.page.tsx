import { t } from '@lingui/macro'
import { AppWrapper, Head } from 'components/common'
import Contact from './Contact'

export default function ContactPage() {
  return (
    <>
      <Head
        title={t`Contact`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/contact'}
        description={t`Contact JuiceboxDAO for feature requests, support, or project advice.`}
      />

      <AppWrapper>
        <Contact />
      </AppWrapper>
    </>
  )
}
