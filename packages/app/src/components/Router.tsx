import Gimme from 'components/Gimme'
import Landing from 'components/Landing'
import Owner from 'components/Owner'
import { HashRouter, Route, Switch } from 'react-router-dom'

import PlayCreate from './PlayCreate'

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
        <Route path="/:owner">
          <Owner />
        </Route>
      </Switch>
    </HashRouter>
  )
}
