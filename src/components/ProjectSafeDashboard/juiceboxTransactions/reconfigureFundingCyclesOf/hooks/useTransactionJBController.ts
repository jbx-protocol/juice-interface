import { CV_V2, CV_V3 } from 'constants/cv'
import { useLoadV2V3Contract } from 'hooks/v2v3/useLoadV2V3Contract'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'

export function useTransactionJBController(transaction: SafeTransactionType) {
  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (transaction.to === V2JBController?.address) {
    return V2JBController
  }

  if (transaction.to === V3JBController?.address) {
    return V3JBController
  }
}
