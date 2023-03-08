import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/JB721TieredDelegate'
import { useStoreOfJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/StoreofJB721TieredDelegate'
import { useJB721DelegateVersion } from 'hooks/JB721Delegate/JB721DelegateVersion'
import { useContext } from 'react'
import { JB721DelegateContractsContext } from './JB721DelegateContractsContext'

export const JB721DelegateContractsProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const dataSourceAddress = fundingCycleMetadata?.dataSource
  const contractVersion = useJB721DelegateVersion({
    dataSourceAddress,
  })

  const isDataSourceJB721Delegate = Boolean(contractVersion)

  const JB721TieredDelegate = useJB721TieredDelegate({
    address: isDataSourceJB721Delegate ? dataSourceAddress : undefined, // only load if its a JB721Delegate
  })

  const {
    value: JB721TieredDelegateStore,
    loading: JB721TieredDelegateStoreLoading,
  } = useStoreOfJB721TieredDelegate({
    JB721TieredDelegate,
  })

  const contextData = {
    contracts: {
      JB721TieredDelegate,
      JB721TieredDelegateStore,
    },
    loading: {
      JB721TieredDelegateStoreLoading,
    },
    version: contractVersion,
  }

  return (
    <JB721DelegateContractsContext.Provider value={contextData}>
      {children}
    </JB721DelegateContractsContext.Provider>
  )
}
