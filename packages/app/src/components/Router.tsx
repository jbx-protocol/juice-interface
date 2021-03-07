import Gimme from 'components/Gimme'
import Landing from 'components/Landing'
import Faq from 'components/Landing/Faq'
import Owner from 'components/Owner'
import { HashRouter, Route, Switch } from 'react-router-dom'

export default function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/gimme">
          <Gimme />
        </Route>
        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/:owner">
          <Owner />
        </Route>
      </Switch>
    </HashRouter>
  )
}
