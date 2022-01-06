import Dashboard from 'components/Dashboard'
import Landing from 'components/Landing'
import { HashRouter, Route, Switch } from 'react-router-dom'

import CatchallRedirect from './CatchallRedirect'
import Create from './Create'
import Projects from './Projects'

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
