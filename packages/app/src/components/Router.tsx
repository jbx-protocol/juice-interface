import Dashboard from 'components/Dashboard'
import Gimme from 'components/Gimme'
import Landing from 'components/Landing'
import { HashRouter, Route, Switch } from 'react-router-dom'

import PlayCreate from './PlayCreate'
import Projects from './Projects'

export default function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/create">
          <PlayCreate />
        </Route>
        <Route path="/gimme">
          <Gimme />
        </Route>
        <Route path="/projects/:owner">
          <Projects />
        </Route>
        <Route path="/p/:projectId">
          <Dashboard />
        </Route>
      </Switch>
    </HashRouter>
  )
}
