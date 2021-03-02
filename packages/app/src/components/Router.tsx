import Gimme from 'components/Gimme'
import Landing from 'components/Landing'
import Faq from 'components/Landing/Faq'
import Owner from 'components/Owner'
import { Budget } from 'models/budget'
import { HashRouter, Route, Switch } from 'react-router-dom'

export default function Router({ activeBudget }: { activeBudget?: Budget }) {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Landing activeBudget={activeBudget} />
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
