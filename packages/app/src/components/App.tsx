import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Navbar from 'components/Navbar'
import { ContractName } from 'constants/contract-name'
import { localProvider } from 'constants/local-provider'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import useContractReader from 'hooks/ContractReader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useUserProvider } from 'hooks/UserProvider'
import { Budget } from 'models/budget'
import { useCallback, useState } from 'react'
import { budgetsDiff } from 'utils/budgetsDiff'
import { createTransactor } from 'utils/Transactor'

import Router from './Router'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const userProvider = useUserProvider(injectedProvider, localProvider)

  const userAddress = useProviderAddress(userProvider)

  const contracts = useContractLoader(userProvider)

  const gasPrice = useGasPrice('average')

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const currentBudget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [userAddress],
    valueDidChange: budgetsDiff,
    updateOn: userAddress
      ? [
          {
            contract: ContractName.BudgetStore,
            eventName: 'Configure',
            topics: [[], userAddress],
          },
        ]
      : undefined,
  })

  console.log('User:', userAddress, userProvider)

  return (
    <UserContext.Provider
      value={{
        userAddress,
        userProvider,
        transactor,
        contracts,
        onNeedProvider: loadWeb3Modal,
      }}
    >
      <Layout
        className="App"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        <Navbar
          hasBudget={!!currentBudget}
          shouldUseNetwork={
            userProvider &&
            userProvider.network?.chainId !== 3 &&
            process.env.NODE_ENV === 'production'
              ? 'Ropsten'
              : undefined
          }
        />

        <Content>
          <Router activeBudget={currentBudget} />
        </Content>
      </Layout>
    </UserContext.Provider>
  )
}

export default App
