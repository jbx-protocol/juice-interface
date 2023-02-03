import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContractReadValue } from 'hooks/ContractReader'
import { TransactorInstance } from 'hooks/Transactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/SetOperatorTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/JBV3Token'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'

export function useSetTransferPermissionTx(): TransactorInstance {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const setOperatorTx = useSetOperatorTx()

  const { value: v2TokenStoreAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v2TokenStore',
    args: [],
  })
  const JBTokenStore = useLoadContractFromAddress({
    address: v2TokenStoreAddress,
    abi: contracts?.JBTokenStore.interface,
  })

  const { value: operatorStoreAddress } = useContractReadValue<string, string>({
    contract: JBTokenStore,
    functionName: 'operatorStore',
    args: [],
  })
  const JBOperatorStore = useLoadContractFromAddress({
    address: operatorStoreAddress,
    abi: contracts?.JBOperatorStore.interface,
  })

  return (_, txOpts) => {
    if (!JBOperatorStore || !JBV3TokenContract) return Promise.reject()

    return setOperatorTx(
      {
        operatorAddress: JBV3TokenContract?.address,
        permissionIndexes: [V2V3OperatorPermission.TRANSFER],
        contractOverride: JBOperatorStore,
      },
      txOpts,
    )
  }
}
