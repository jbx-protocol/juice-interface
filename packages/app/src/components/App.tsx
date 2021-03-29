import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { ContractName } from 'constants/contract-name'
import { NETWORKS } from 'constants/networks'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import useContractReader from 'hooks/ContractReader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProjects } from 'hooks/Projects'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useSigningProvider } from 'hooks/SigningProvider'
import { useTransactor } from 'hooks/Transactor'
import { useWeth } from 'hooks/Weth'
import { NetworkName } from 'models/network-name'
import { useCallback, useEffect, useState } from 'react'

import Navbar from './Navbar'
import Router from './Router'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const signingProvider = useSigningProvider(injectedProvider)

  useEffect(() => {
    async function getNetwork() {
      await signingProvider?.ready

      const network = signingProvider?.network?.chainId
        ? NETWORKS[signingProvider.network.chainId]
        : undefined

      setNetwork(network?.name)
    }
    getNetwork()
  }, [signingProvider])

  const userAddress = useProviderAddress(signingProvider)

  const contracts = useContractLoader(signingProvider)

  const weth = useWeth(signingProvider)

  const gasPrice = useGasPrice('average')

  const transactor = useTransactor({
    provider: signingProvider,
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const adminFeePercent = useContractReader<number>({
    contract: ContractName.BudgetStore,
    functionName: 'fee',
    formatter: (val: BigNumber) => val?.toNumber(),
  })

  const projects = useProjects(userAddress, signingProvider)

  console.log('User:', userAddress)

  return (
    <UserContext.Provider
      value={{
        userAddress,
        signingProvider,
        network,
        transactor,
        contracts,
        onNeedProvider: loadWeb3Modal,
        projects,
        adminFeePercent,
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
        <Navbar />

        <Content>
          <Router />
        </Content>
      </Layout>
    </UserContext.Provider>
  )
}

export default App
