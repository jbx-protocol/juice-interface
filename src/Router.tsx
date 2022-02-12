import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { Suspense, lazy } from 'react'
import V1Dashboard from 'components/v1/V1Dashboard'
import Landing from 'components/Landing'
import V1Create from 'components/v1/V1Create'
import Projects from 'components/Projects'

const V2Create = lazy(() => import('components/v2/V2Create'))

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
        <Route path="/create-v2">
          <Suspense fallback={<div>Loading...</div>}>
            <V2Create />
          </Suspense>
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
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
