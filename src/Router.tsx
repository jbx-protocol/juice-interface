import Landing from 'pages'
import PrivacyPolicy from 'pages/privacy'
import Projects from 'pages/projects'
import Loading from 'components/Loading'
import V1Dashboard from 'pages/p'
import { fathom } from 'lib/fathom'
import { V1CurrencyProvider } from 'providers/v1/V1CurrencyProvider'
import { V2UserProvider } from 'providers/v2/UserProvider'
import { usePageTitle } from 'hooks/PageTitle'
import { lazy, Suspense, useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'

const V1Create = lazy(() => import('pages/v1/create'))
const V2Create = lazy(() => import('pages/create'))
const V2DashboardGateway = lazy(() => import('pages/v2/p/V2DashboardGateway'))

function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}

function usePageViews() {
  const location = useLocation()

  useEffect(() => {
    fathom?.trackPageview({
      url: location.pathname,
    })
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

      <Route path="/@:handle">
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
