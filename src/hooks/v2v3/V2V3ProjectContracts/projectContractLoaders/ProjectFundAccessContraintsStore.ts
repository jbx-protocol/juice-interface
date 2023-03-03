import { Contract } from '@ethersproject/contracts'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContractReadValue } from 'hooks/ContractReader'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export function useProjectFundAccessConstraintsStore({
  JBController,
}: {
  JBController: Contract | undefined
}) {
  const { cv } = useContext(V2V3ContractsContext)
  const { value: fundAccessConstraintsStoreAddress, loading } =
    useContractReadValue<string, string>({
      contract: JBController,
      functionName: 'fundAccessConstraintsStore',
      args: null,
    })

  const JBFundAccessConstraintsStore = useLoadV2V3Contract({
    cv,
    contractName: V2V3ContractName.JBFundAccessConstraintsStore,
    address: fundAccessConstraintsStoreAddress,
  })

  return { JBFundAccessConstraintsStore, loading }
}
