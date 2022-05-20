import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { Suspense, lazy, useEffect } from 'react'
import V1Dashboard from 'components/v1/V1Dashboard'
import Landing from 'components/Landing'
import Projects from 'components/Projects'
import V2UserProvider from 'providers/v2/UserProvider'
import Loading from 'components/shared/Loading'
import V1CurrencyProvider from 'providers/v1/V1CurrencyProvider'
import PrivacyPolicy from 'components/PrivacyPolicy'
import { t } from '@lingui/macro'

import { DEFAULT_SITE_TITLE } from 'constants/siteMetadata'

const V1Create = lazy(() => import('components/v1/V1Create'))
const V2Create = lazy(() => import('components/v2/V2Create'))
const V2DashboardGateway = lazy(
  () => import('components/v2/V2Dashboard/Gateway'),
)

const pageTitles = (): { [k in string]: string } => {
  return {
    '/create': t`Create project`,
    '/projects': t`Projects`,
  }
}

function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}

function usePageViews() {
  const location = useLocation()

  useEffect(() => {
    window.fathom?.trackPageview({
      url: location.pathname,
    })
  }, [location])
}

function usePageTitle() {
  const location = useLocation()

  useEffect(() => {
    const name = pageTitles()[location.pathname]
    document.title = name ? `${name} | Juicebox` : DEFAULT_SITE_TITLE
  }, [location])
}

function JuiceboxSwitch() {
  usePageViews()
  usePageTitle()

  return (
    <Switch>
      <Route exact path="/">
        <V1CurrencyProvider>
          <Landing />
        </V1CurrencyProvider>
      </Route>

      <Route path="/create">
        <Suspense fallback={<Loading />}>
          <V2Create />
        </Suspense>
      </Route>
      <Route path="/v1/create">
        <V1CurrencyProvider>
          <Suspense fallback={<Loading />}>
            <V1Create />
          </Suspense>
        </V1CurrencyProvider>{' '}
      </Route>

      <Route path="/projects/:owner">
        <Projects />
      </Route>
      <Route path="/projects">
        <Projects />
      </Route>

      <Route path="/p/:ensName(.*.eth)">
        <Suspense fallback={<Loading />}>
          <V2UserProvider>
            <V2DashboardGateway />
          </V2UserProvider>
        </Suspense>
      </Route>
      <Route path="/p/:handle">
        <V1Dashboard />
      </Route>

      <Route path="/v2/p/:projectId">
        <Suspense fallback={<Loading />}>
          <V2UserProvider>
            <V2DashboardGateway />
          </V2UserProvider>
        </Suspense>
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
