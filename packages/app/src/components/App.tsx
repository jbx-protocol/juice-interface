import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { NETWORKS } from 'constants/networks'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import useContractReader from 'hooks/ContractReader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useSigningProvider } from 'hooks/SigningProvider'
import { useTransactor } from 'hooks/Transactor'
import { ContractName } from 'models/contract-name'
import { NetworkName } from 'models/network-name'
import { useCallback, useEffect, useState } from 'react'
import { web3Modal } from 'utils/web3Modal'

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

  const gasPrice = useGasPrice('average')

  const transactor = useTransactor({
    provider: signingProvider,
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  const adminFeePercent = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'fee',
    provider: signingProvider,
  })

  const userHasProjects = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'balanceOf',
    provider: signingProvider,
    args: userAddress ? [userAddress] : null,
    formatter: (bal?: BigNumber) => bal?.gt(0),
  })

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
        userHasProjects,
        adminFeePercent,
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
