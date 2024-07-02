import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

export function useProjectFundAccessConstraintsStore({
  JBController,
}: {
  JBController: Contract | undefined
}) {
  const { contracts } = useContext(V2V3ContractsContext)
  const { value: fundAccessConstraintsStoreAddress, loading } =
    useContractReadValue<string, string>({
      contract: JBController,
      functionName: 'fundAccessConstraintsStore',
      args:
        typeof JBController?.fundAccessConstraintsStore !== 'undefined'
          ? []
          : null,
    })

  const JBFundAccessConstraintsStore = useLoadContractFromAddress({
    abi: contracts?.JBFundAccessConstraintsStore?.interface,
    address: fundAccessConstraintsStoreAddress,
  })

  return { JBFundAccessConstraintsStore, loading }
}
