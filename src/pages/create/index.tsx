import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import { Create } from 'components/Create/Create'
import { CV_V3 } from 'constants/cv'
import { SiteBaseUrl } from 'constants/url'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ContractsProvider } from 'contexts/v2v3/Contracts/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'contexts/v2v3/V2V3CurrencyProvider'
import { Provider } from 'react-redux'
import store from 'redux/store'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V2CreatePage() {
  return (
    <>
      <Head
        title="Create your project"
        url={SiteBaseUrl + '/create'}
        description="Launch a project on Juicebox"
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

export const getServerSideProps = globalGetServerSideProps
