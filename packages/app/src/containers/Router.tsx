import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Faq from '../components/Faq'
import Gimme from '../components/Gimme'
import { useGasPrice } from '../hooks/GasPrice'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { createTransactor } from '../utils/Transactor'
import Landing from './landing/Landing'
import Owner from './Owner'

export default function Router({
  activeBudget,
  contracts,
  userProvider,
  userAddress,
  onNeedProvider,
}: {
  activeBudget?: Budget
  contracts?: Contracts
  userProvider?: JsonRpcProvider
  userAddress?: string
  onNeedProvider: () => Promise<void>
}) {
  const gasPrice = useGasPrice('fast')

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Landing
            userAddress={userAddress}
            activeBudget={activeBudget}
            contracts={contracts}
            transactor={transactor}
            onNeedProvider={onNeedProvider}
          />
        </Route>
        <Route path="/gimme">
          <Gimme
            contracts={contracts}
            transactor={transactor}
            userAddress={userAddress}
          ></Gimme>
        </Route>
        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/:owner">
          <Owner
            contracts={contracts}
            transactor={transactor}
            onNeedProvider={onNeedProvider}
            userProvider={userProvider}
          />
        </Route>
      </Switch>
    </HashRouter>
  )
}
