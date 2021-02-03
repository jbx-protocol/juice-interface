import './App.scss'

import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Gimme from './components/Gimme'
import InitTickets from './components/InitTickets'
import Landing from './components/landing/Landing'
import BudgetsHistory from './components/BudgetsHistory'
import Navbar from './components/Navbar'
import Budgets from './components/Owner'
import { localProvider } from './constants/local-provider'
import { web3Modal } from './constants/web3-modal'
import { createTransactor } from './helpers/Transactor'
import { useContractLoader } from './hooks/ContractLoader'
import useContractReader from './hooks/ContractReader'
import { useGasPrice } from './hooks/GasPrice'
import { useUserProvider } from './hooks/UserProvider'
import { Budget } from './models/budget'
import ConfigureBudget from './components/ConfigureBudget'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [providerAddress, setProviderAddress] = useState<string>()

  const gasPrice = useGasPrice('fast')

  const userProvider = useUserProvider(injectedProvider, localProvider)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  // https://github.com/austintgriffith/eth-hooks/blob/master/src/UserAddress.ts
  useEffect(() => {
    userProvider
      ?.getSigner()
      .getAddress()
      .then(address => setProviderAddress(address))
  }, [userProvider, setProviderAddress])

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const contracts = useContractLoader(userProvider)

  console.log('using provider:', userProvider)

  const hasBudget = useContractReader<boolean>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [providerAddress],
    formatter: (val: Budget) => !!val,
  })

  return (
    <div className="App">
      <Navbar
        hasBudget={hasBudget}
        providerAddress={providerAddress}
        userProvider={userProvider}
        onConnectWallet={loadWeb3Modal}
      />

      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Landing
                providerAddress={providerAddress}
                onNeedAddress={loadWeb3Modal}
              />
            </Route>
            <Route exact path="/gimme">
              <Gimme
                contracts={contracts}
                transactor={transactor}
                providerAddress={providerAddress}
              ></Gimme>
            </Route>
            <Route exact path="/create/:owner">
              <ConfigureBudget contracts={contracts} transactor={transactor} />
            </Route>
            <Route exact path="/:owner">
              <Budgets
                contracts={contracts}
                transactor={transactor}
                providerAddress={providerAddress}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
