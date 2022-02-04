import { useEffect } from 'react'
import {
  HashRouter,
  Router as ReactRouter,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import { createBrowserHistory } from 'history'
import Dashboard from 'components/Dashboard'
import Landing from 'components/Landing'
import Create from 'components/Create'
import Projects from 'components/Projects'

function CatchallRedirect() {
  const route = useParams<{ route: string }>()['route']
  return <Redirect to={'/p/' + route} />
}

function BrowserRedirect() {
  const location = useLocation()
  useEffect(() => history.replace(location.pathname), [location.pathname]) //escape from HashRouter
  return null
}

const history = createBrowserHistory()

export default function Router() {
  return (
    <>
      <ReactRouter history={history}>
        <Switch>
          <Route path="/p/:handle">
            <Dashboard />
          </Route>
          <Route exact path="/">
            <HashRouter>
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>
                <Route path="/create">
                  <Create />
                </Route>
                <Route path="/projects/:owner">
                  <Projects />
                </Route>
                <Route path="/projects">
                  <Projects />
                </Route>
                <Route path="/p/:handle">
                  <BrowserRedirect />
                </Route>
              </Switch>
            </HashRouter>
          </Route>
          <Route path="/:route">
            <CatchallRedirect />
          </Route>
        </Switch>
      </ReactRouter>
    </>
  )
}
