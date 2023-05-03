import { t } from '@lingui/macro'
import { AppWrapper, Head } from 'components/common'
import { Create } from 'components/Create'
import { CV_V3 } from 'constants/cv'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ContractsProvider } from 'contexts/v2v3/Contracts/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'contexts/v2v3/V2V3CurrencyProvider'
import { Provider } from 'react-redux'
import store from 'redux/store'

export default function V2CreatePage() {
  return (
    <>
      <Head
        title={t`Create your project`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/create'}
        description={t`Launch a project on Juicebox`}
      />

      <AppWrapper>
        <Provider store={store}>
          {/* New projects will be launched using V3 contracts. */}
          <V2V3ContractsProvider initialCv={CV_V3}>
            <TransactionProvider>
              <V2V3CurrencyProvider>
                <Create />
              </V2V3CurrencyProvider>
            </TransactionProvider>
          </V2V3ContractsProvider>
        </Provider>
      </AppWrapper>
    </>
  )
}
