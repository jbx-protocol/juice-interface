import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { TransactorInstance } from 'hooks/Transactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/SetOperatorTx'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/JBV3Token'

export function useSetTransferPermissionTx(): TransactorInstance {
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const setOperatorTx = useSetOperatorTx()
  const { userAddress } = useWallet()
  const JBV3TokenContract = useJBV3Token({ tokenAddress })

  const { value: v2TokenStoreAddress } = useContractReadValue<string, string>({
    contract: JBV3TokenContract,
    functionName: 'v2TokenStore',
    args: [],
  })
  const JBTokenStore = new Contract(
    v2TokenStoreAddress ?? '',
    contracts?.JBOperatorStore.interface ?? '',
  ) // TODO

  const { value: operatorStoreAddress } = useContractReadValue<string, string>({
    contract: JBTokenStore.address ?? '',
    functionName: 'v2OperatorStore',
    args: [],
  })
  const JBOperatorStore = new Contract(operatorStoreAddress ?? '', '') // TODO

  return (_, txOpts) => {
    if (!JBOperatorStore) return Promise.reject()

    return setOperatorTx(
      {
        operatorAddress: userAddress,
        permissionIndexes: [V2V3OperatorPermission.TRANSFER],
        contractOverride: JBOperatorStore,
      },
      txOpts,
    )
  }
}
