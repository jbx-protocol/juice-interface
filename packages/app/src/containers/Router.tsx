import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Gimme from '../components/Gimme'
import { useGasPrice } from '../hooks/GasPrice'
import { Contracts } from '../models/contracts'
import { createTransactor } from '../utils/Transactor'
import Landing from './landing/Landing'
import Owner from './Owner'

export default function Router({
  hasBudget,
  contracts,
  userProvider,
  userAddress,
  onNeedProvider,
}: {
  hasBudget?: boolean
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
            hasBudget={hasBudget}
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
        <Route path="/:owner">
          <Owner
            contracts={contracts}
            transactor={transactor}
            userAddress={userAddress}
            onNeedProvider={onNeedProvider}
          />
        </Route>
      </Switch>
    </HashRouter>
  )
}
