import { t } from '@lingui/macro'
import { AppWrapper, Head } from 'components/common'
import { Create } from 'components/Create'

export default function V2CreatePage() {
  return (
    <>
      <Head
        title={t`Create a project`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/create'}
        description={t`Create a project on Juicebox`}
      />

      <AppWrapper>
        <Create />
      </AppWrapper>
    </>
  )
}
