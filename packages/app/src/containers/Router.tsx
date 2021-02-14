import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import React from 'react'
import { HashRouter, Switch } from 'react-router-dom'
import { GuardedRoute, GuardFunction, GuardProvider } from 'react-router-guards'

import Gimme from '../components/Gimme'
import Loading from '../components/Loading'
import { useGasPrice } from '../hooks/GasPrice'
import { Contracts } from '../models/contracts'
import { createTransactor } from '../utils/Transactor'
import ConfigureBudget from './ConfigureBudget'
import Landing from './landing/Landing'
import Owner from './Owner'

export default function Router({
  hasBudget,
  contracts,
  userProvider,
  userAddress,
}: {
  hasBudget?: boolean
  contracts?: Contracts
  userProvider?: JsonRpcProvider
  userAddress?: string
}) {
  const gasPrice = useGasPrice('fast')

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const budgetGuard: GuardFunction = (to, from, next) => {
    if (to.meta.budget === false) {
      hasBudget && userAddress ? next.redirect(userAddress) : next()
    }
    next()
  }

  return hasBudget === undefined ? (
    <div style={{ flex: 1 }}>
      <Loading />
    </div>
  ) : (
    <HashRouter>
      <GuardProvider guards={[budgetGuard]}>
        <Switch>
          <GuardedRoute exact path="/">
            <Landing
              userAddress={userAddress}
              hasBudget={hasBudget}
              contracts={contracts}
              transactor={transactor}
              userProvider={userProvider}
            />
          </GuardedRoute>
          <GuardedRoute path="/gimme">
            <Gimme
              contracts={contracts}
              transactor={transactor}
              userAddress={userAddress}
            ></Gimme>
          </GuardedRoute>
          <GuardedRoute path="/create" meta={{ budget: false }}>
            <ConfigureBudget
              owner={userAddress}
              contracts={contracts}
              transactor={transactor}
              provider={userProvider}
            />
          </GuardedRoute>
          <GuardedRoute path="/:owner">
            <Owner
              contracts={contracts}
              transactor={transactor}
              userAddress={userAddress}
              provider={userProvider}
            />
          </GuardedRoute>
        </Switch>
      </GuardProvider>
    </HashRouter>
  )
}
