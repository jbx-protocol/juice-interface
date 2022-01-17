import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
import Dashboard from 'components/Dashboard'
import Landing from 'components/Landing'
import Create from 'components/Create'
import Projects from 'components/Projects'

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
          <Create />
        </Route>
        <Route path="/projects/:owner">
          <Projects />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/p/:handle">
          <Dashboard />
        </Route>
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
