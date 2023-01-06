import { t } from '@lingui/macro'
import { AppWrapper, Head } from 'components/common'
import { Create } from 'components/Create'
import { CV_V3 } from 'constants/cv'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'providers/v2v3/V2V3CurrencyProvider'

export default function V2CreatePage() {
  return (
    <>
      <Head
        title={t`Create a project`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/create'}
        description={t`Create a project on Juicebox`}
      />

      <AppWrapper>
        {/* New projects will be launched using V3 contracts. */}
        <V2V3ContractsProvider initialCv={CV_V3}>
          <TransactionProvider>
            <V2V3CurrencyProvider>
              <Create />
            </V2V3CurrencyProvider>
          </TransactionProvider>
        </V2V3ContractsProvider>
      </AppWrapper>
    </>
  )
}
