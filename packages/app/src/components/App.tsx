import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { NETWORKS } from 'constants/networks'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import { useCurrentBudget } from 'hooks/CurrentBudget'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useTransactor } from 'hooks/Transactor'
import { useUserProvider } from 'hooks/UserProvider'
import { useWeth } from 'hooks/Weth'
import { useCallback, useState } from 'react'

import Navbar from './Navbar'
import Router from './Router'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const userProvider = useUserProvider(injectedProvider)

  const userAddress = useProviderAddress(userProvider)

  const contracts = useContractLoader(userProvider)

  const gasPrice = useGasPrice('average')

  const weth = useWeth()

  const transactor = useTransactor({
    provider: userProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const currentBudget = useCurrentBudget(userAddress)

  console.log('User:', userAddress)

  return (
    <UserContext.Provider
      value={{
        userAddress,
        userProvider,
        transactor,
        contracts,
        onNeedProvider: loadWeb3Modal,
        currentBudget,
        weth,
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
          shouldUseNetwork={
            userProvider &&
            userProvider.network?.chainId !== NETWORKS.kovan.chainId &&
            process.env.NODE_ENV === 'production'
              ? NETWORKS.kovan.name
              : undefined
          }
        />

        <Content>
          <Router />
        </Content>
      </Layout>
    </UserContext.Provider>
  )
}

export default App
