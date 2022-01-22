import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect, useParams } from 'react-router'
// import DashboardV1 from 'components/DashboardV1'
import DashboardV2 from 'components/DashboardV1' // TODO update to V2
import Landing from 'components/Landing'
import Create from 'components/Create'
import Projects from 'components/Projects'
import UserProviderV1 from 'providers/UserProviderV1'
import UserProviderV2 from 'providers/UserProviderV2'

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
        {/* <Route path="/p/:handle(.+\.eth)"> */}
        <Route path="/p/:handle">
          <UserProviderV2>
            <UserProviderV1>
              <DashboardV2 />
            </UserProviderV1>
          </UserProviderV2>
        </Route>
        {/* <Route path="/p/:handle">
          <UserProviderV1>
            <DashboardV1 />
          </UserProviderV1>
        </Route> */}
        <Route path="/:route">
          <CatchallRedirect />
        </Route>
      </Switch>
    </HashRouter>
  )
}
