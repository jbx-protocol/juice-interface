import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { SiteBaseUrl } from 'constants/url'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { featureFlagEnabled } from 'utils/featureFlags'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

const V2V3Create = dynamic(
  () => import('packages/v2v3/components/Create/Create'),
  { ssr: false },
)
const V2V3CreateProviders = dynamic(
  () => import('packages/v2v3/components/Create/CreateProviders'),
  { ssr: false },
)
const V4V5Create = dynamic(() => import('packages/v4v5/components/Create/Create'), {
  ssr: false,
})
const V4V5VersionProvider = dynamic(
  () =>
    import('packages/v4v5/contexts/V4V5VersionProvider').then(
      mod => mod.V4V5VersionProvider,
    ),
  { ssr: false },
)

export default function CreatePage() {
  const contentByVersion = featureFlagEnabled(FEATURE_FLAGS.V4) ? (
    <V4V5VersionProvider defaultVersion={5}>
      <V4V5Create />
    </V4V5VersionProvider>
  ) : (
    <V2V3CreateProviders>
      <V2V3Create />
    </V2V3CreateProviders>
  )

  return (
    <>
      <Head
        title="Create your project"
        url={SiteBaseUrl + '/create'}
        description="Launch a project on Juicebox"
      />

      <AppWrapper>
        <Provider store={store}>{contentByVersion}</Provider>
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = globalGetServerSideProps
