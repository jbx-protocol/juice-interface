import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { NETWORKS } from 'constants/networks'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useContractLoader } from 'hooks/ContractLoader'
import { useGasPrice } from 'hooks/GasPrice'
import { useProviderAddress } from 'hooks/ProviderAddress'
import { useSigningProvider } from 'hooks/SigningProvider'
import { useTransactor } from 'hooks/Transactor'
import { useUserBudget } from 'hooks/UserBudget'
import { useUserTickets } from 'hooks/UserTickets'
import { useWeth } from 'hooks/Weth'
import { NetworkName } from 'models/network-name'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { editingBudgetActions } from 'redux/slices/editingBudget'

import Navbar from './Navbar'
import Router from './Router'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [signer, setSigner] = useState<JsonRpcSigner>()

  const dispatch = useAppDispatch()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const signingProvider = useSigningProvider(injectedProvider)

  const userAddress = useProviderAddress(signingProvider)

  const contracts = useContractLoader(signingProvider)

  const gasPrice = useGasPrice('average')

  useEffect(() => {
    async function getSigner() {
      setSigner(await signingProvider?.getSigner())
    }

    getSigner()
  }, [signingProvider])

  const weth = useWeth(signer)

  const transactor = useTransactor({
    provider: signingProvider,
    gasPrice:
      typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  useEffect(() => {
    if (userAddress) dispatch(editingBudgetActions.setProject(userAddress))
  }, [userAddress, dispatch])

  useUserBudget(userAddress)
  useUserTickets(userAddress)

  const network = useMemo(() => {
    const network = Object.entries(NETWORKS).find(
      ([name, info]) => info.chainId === signingProvider?.network?.chainId,
    )
    return network ? (network[0] as NetworkName) : undefined
  }, [signingProvider?.network?.chainId])

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
