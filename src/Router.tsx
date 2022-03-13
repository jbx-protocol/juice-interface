import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { Suspense, lazy } from 'react'
import V2UserProvider from 'providers/v2/UserProvider'
import Loading from 'components/shared/Loading'

import Landing from 'components/Landing'
import Projects from 'components/Projects'
import V1Create from 'components/v1/V1Create'
import V1Dashboard from 'components/v1/V1Dashboard'

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
          <Landing />
        </Route>
        <Route path="/create">
          <V1Create />
        </Route>

        <Route path="/projects/:owner">
          <Projects />
        </Route>
        <Route path="/projects">
          <Suspense fallback={<Loading />}>
            <Projects />
          </Suspense>
        </Route>
        <Route path="/p/:handle">
          <V1Dashboard />
        </Route>
        <Route path="/v2/create">
          <Suspense fallback={<Loading />}>
            <V2Create />
          </Suspense>
        </Route>
        <Route path="/v2/p/:projectId">
          <Suspense fallback={<Loading />}>
            <V2UserProvider>
              <V2Dashboard />
            </V2UserProvider>
          </Suspense>
        </Route>
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
