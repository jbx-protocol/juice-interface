import { CV_V2, CV_V3 } from 'constants/cv'
import { useLoadV2V3Contract } from 'hooks/v2v3/useLoadV2V3Contract'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'

export function useTransactionVersion(
  transaction: SafeTransactionType,
): CV2V3 | undefined {
  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (transaction.to === V2JBController?.address) {
    return CV_V2
  }

  if (transaction.to === V3JBController?.address) {
    return CV_V3
  }
}
