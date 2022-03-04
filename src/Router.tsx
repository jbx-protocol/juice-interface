import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { Suspense, lazy, useEffect } from 'react'
import V1Dashboard from 'components/v1/V1Dashboard'
import Landing from 'components/Landing'
import Projects from 'components/Projects'
import V2UserProvider from 'providers/v2/UserProvider'
import Loading from 'components/shared/Loading'
import V1CurrencyProvider from 'providers/v1/V1CurrencyProvider'
import V2EntryGuard from 'components/v2/V2EntryGuard'
import { featureFlagEnabled, FEATURE_FLAGS } from 'utils/featureFlags'
import PrivacyPolicy from 'components/PrivacyPolicy'
import V2Projects from 'components/v2/V2Projects'

const V1Create = lazy(() => import('components/v1/V1Create'))
const V2Create = lazy(() => import('components/v2/V2Create'))
const V2DashboardGateway = lazy(
  () => import('components/v2/V2Dashboard/Gateway'),
)

function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}

const V1CreateRoute = () => (
  <V1CurrencyProvider>
    <Suspense fallback={<Loading />}>
      <V1Create />
    </Suspense>
  </V1CurrencyProvider>
)

const V2CreateRoute = () => (
  <V2EntryGuard>
    <Suspense fallback={<Loading />}>
      <V2Create />
    </Suspense>
  </V2EntryGuard>
)

function usePageViews() {
  let location = useLocation()

  useEffect(() => {
    window.fathom?.trackPageview({
      url: location.pathname,
    })
  }, [location])
}

function JuiceboxSwitch() {
  usePageViews()
  const isV2Enabled = featureFlagEnabled(FEATURE_FLAGS.ENABLE_V2)

  return (
    <Switch>
      <Route exact path="/">
        <V1CurrencyProvider>
          <Landing />
        </V1CurrencyProvider>
      </Route>
      <Route path="/create">
        {isV2Enabled ? <V2CreateRoute /> : <V1CreateRoute />}
      </Route>
      {isV2Enabled ? (
        <Route path="/v1/create">
          <V1CreateRoute />
        </Route>
      ) : (
        <Route path="/v2/create">
          <V2CreateRoute />
        </Route>
      )}

      <Route path="/projects/:owner">
        <Projects />
      </Route>
      <Route path="/projects">
        <Projects />
      </Route>

      <Route path="/p/:ensName(.*.eth)">
        <V2EntryGuard>
          <Suspense fallback={<Loading />}>
            <V2UserProvider>
              <V2DashboardGateway />
            </V2UserProvider>
          </Suspense>
        </V2EntryGuard>
      </Route>
      <Route path="/p/:handle">
        <V1Dashboard />
      </Route>

      <Route path="/v2/p/:projectId">
        <V2EntryGuard>
          <Suspense fallback={<Loading />}>
            <V2UserProvider>
              <V2DashboardGateway />
            </V2UserProvider>
          </Suspense>
        </V2EntryGuard>
      </Route>

      <Route path="/privacy">
        <PrivacyPolicy />
      </Route>
      <Route path="/:route">
        <CatchallRedirect />
      </Route>
    </Switch>
  )
}

export default function Router() {
  return (
    <HashRouter>
      <JuiceboxSwitch />
    </HashRouter>
  )
}
