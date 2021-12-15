import Dashboard from 'components/Dashboard'
import Landing from 'components/Landing'
import { ChildElems } from 'models/child-elems'
import { useHistory } from 'react-router'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import { isCloudflare } from 'utils/cloudflare'

import CatchallRedirect from './CatchallRedirect'
import Create from './Create'
import Projects from './Projects'

interface RouterProps {
  children: ChildElems
}

export const Router = ({ children }: RouterProps) => {
  const history = useHistory()

  if (isCloudflare()) {
    // Redirects any hash routes to regular routes
    if (window && window.location.hash.startsWith('#/')) {
      history.push(window.location.hash.replace('#', ''))
    }
    // Use regular routes
    return <BrowserRouter>{children}</BrowserRouter>
  }

  return <HashRouter>{children}</HashRouter>
}

export default function Routes() {
  return (
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
  )
}
