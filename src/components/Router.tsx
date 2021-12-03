import Landing from 'components/Landing'
import { HashRouter, useParams, Route, Switch } from 'react-router-dom'

import CatchallRedirect from './CatchallRedirect'
import Create from './Create'
import Projects from './Projects'

const RedirectToProject = () => {
  const { handle }: { handle?: string } = useParams()
  window.location.href = 'http://localhost:3000/p/' + handle
  return null
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
          <RedirectToProject />
        </Route>
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
