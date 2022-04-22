import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { Suspense, lazy } from 'react'
import V1Dashboard from 'components/v1/V1Dashboard'
import Landing from 'components/Landing'
import V1Create from 'components/v1/V1Create'
import Projects from 'components/Projects'
import V2UserProvider from 'providers/v2/UserProvider'
import Loading from 'components/shared/Loading'
import V1CurrencyProvider from 'providers/v1/V1CurrencyProvider'
import V2EntryGuard from 'components/v2/V2EntryGuard'

const V2Create = lazy(() => import('components/v2/V2Create'))
const V2Dashboard = lazy(() => import('components/v2/V2Dashboard'))

function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}

export default function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <V1CurrencyProvider>
            <Landing />
          </V1CurrencyProvider>
        </Route>
        <Route path="/create">
          <V1CurrencyProvider>
            <V1Create />
          </V1CurrencyProvider>
        </Route>

        <Route path="/projects/:owner">
          <Projects />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/p/:handle">
          <V1Dashboard />
        </Route>
        <Route path="/v2/create">
          <V2EntryGuard>
            <Suspense fallback={<Loading />}>
              <V2Create />
            </Suspense>
          </V2EntryGuard>
        </Route>

        <Route path="/v2/p/:projectId">
          <V2EntryGuard>
            <Suspense fallback={<Loading />}>
              <V2UserProvider>
                <V2Dashboard />
              </V2UserProvider>
            </Suspense>
          </V2EntryGuard>
        </Route>
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
