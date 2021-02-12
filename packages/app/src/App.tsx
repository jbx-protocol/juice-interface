import './App.scss'

import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { useCallback, useState } from 'react'
import { HashRouter, Switch } from 'react-router-dom'
import { GuardedRoute, GuardFunction, GuardProvider } from 'react-router-guards'

import Gimme from './components/Gimme'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import { web3Modal } from './constants/web3-modal'
import { createTransactor } from './helpers/Transactor'
import { useContractLoader } from './hooks/ContractLoader'
import useContractReader from './hooks/ContractReader'
import { useGasPrice } from './hooks/GasPrice'
import { useUserAddress } from './hooks/UserAddress'
import { useUserProvider } from './hooks/UserProvider'
import { Budget } from './models/budget'
import ConfigureBudget from './views/ConfigureBudget'
import Landing from './views/landing/Landing'
import Owner from './views/Owner'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()

  const gasPrice = useGasPrice('fast')

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const userProvider = useUserProvider(injectedProvider)
  const userAddress = useUserAddress(userProvider)

  console.log('using provider:', userAddress, userProvider)

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const contracts = useContractLoader(userProvider)

  const hasBudget = useContractReader<boolean>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [userAddress],
    formatter: (val: Budget) => !!val,
  })

  const budgetGuard: GuardFunction = (to, from, next) => {
    if (to.meta.budget === false) {
      hasBudget && userAddress ? next.redirect(userAddress) : next()
    }
    next()
  }

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Navbar
        hasBudget={hasBudget}
        userAddress={userAddress}
        userProvider={userProvider}
        onConnectWallet={loadWeb3Modal}
      />

      {hasBudget === undefined ? (
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
                  onNeedAddress={loadWeb3Modal}
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
      )}
    </div>
  )
}

export default App
