import { AppWrapper, Head } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import { Create } from 'components/Create'
import NextHead from 'next/head'

export default function CreatePage() {
  return (
    <>
      <Head />
      <NextHead>
        <DesmosScript />
      </NextHead>
      <AppWrapper>
        <Create />
      </AppWrapper>
    </>
  )
}
