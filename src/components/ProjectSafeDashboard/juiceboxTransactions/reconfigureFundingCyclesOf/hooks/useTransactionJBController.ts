import { CV_V2, CV_V3 } from 'constants/cv'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useLoadV2V3Contract } from 'packages/v2v3/hooks/useLoadV2V3Contract'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { useContext } from 'react'

export function useTransactionJBController(transaction: SafeTransactionType) {
  const { contracts } = useContext(V2V3ContractsContext)

  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (!contracts) return

  switch (transaction.to) {
    case contracts?.JBController3_1.address:
      return contracts.JBController3_1

    case V2JBController?.address:
      return V2JBController

    case V3JBController?.address:
      return V3JBController
  }
}
